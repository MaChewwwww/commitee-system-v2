<?php
require_once __DIR__ . '/lifecycle.php';

/** Same documented weights used by the monitoring page, computed from source records. */
function workflowScores(array $members, array $tasks, array $attendance): array {
    $scores = [];
    foreach ($members as $member) {
        $own = array_values(array_filter($tasks, fn($t) => $t['member_id'] === $member['id']));
        $done = array_values(array_filter($own, fn($t) => $t['status'] === 'completed'));
        $onTime = array_filter($done, fn($t) => !empty($t['due_date']) && !empty($t['completed_at']) && substr($t['completed_at'], 0, 10) <= $t['due_date']);
        $records = array_values(array_filter($attendance, fn($r) => $r['member_id'] === $member['id']));
        $attendanceDate = fn($r)=>preg_match('/^\d{4}-\d{2}$/',$r['period']??'') ? $r['period'].'-01' : substr($r['created_at']??'',0,10);
        usort($records, fn($a,$b) => strcmp($attendanceDate($b),$attendanceDate($a)) ?: strcmp($b['created_at'] ?? '',$a['created_at'] ?? '') ?: strcmp($b['id'] ?? '', $a['id'] ?? ''));
        $rate = (float)($records[0]['attendance_rate'] ?? 0);
        $completion = count($own) ? round(count($done)/count($own)*100) : 0;
        $punctuality = count($done) ? round(count($onTime)/count($done)*100) : 0;
        $score = round(.5*$completion + .2*$rate + .3*$punctuality);
        $scores[] = ['member_id'=>$member['id'], 'full_name'=>$member['full_name'], 'total_tasks'=>count($own), 'completed_tasks'=>count($done), 'attendance_rate'=>$rate, 'task_completion_rate'=>$completion, 'on_time_rate'=>$punctuality, 'performance_score'=>$score, 'grade'=>$score>=90?'Excellent':($score>=75?'Good':($score>=60?'Average':'Needs Improvement'))];
    }
    usort($scores, fn($a,$b)=> $b['performance_score'] <=> $a['performance_score']);
    return $scores;
}

/** Committee roster is the population; task creation date selects work in the reporting period. */
function workflowReportData(PDO $pdo, ?string $committeeId, ?string $from = null, ?string $to = null): array {
    $committees = $pdo->query('SELECT * FROM committees')->fetchAll();
    $members = $pdo->query('SELECT * FROM members')->fetchAll();
    $assignments = $pdo->query('SELECT * FROM committee_members')->fetchAll();
    $tasks = $pdo->query('SELECT * FROM tasks')->fetchAll();
    $attendance = $pdo->query('SELECT * FROM performance')->fetchAll();
    if ($committeeId !== null) {
        $committees = array_values(array_filter($committees, fn($c)=>$c['id']===$committeeId));
        $assignments = array_values(array_filter($assignments, fn($a)=>$a['committee_id']===$committeeId));
        $ids = array_merge(array_column($assignments,'member_id'),array_column(array_filter($tasks,fn($t)=>$t['committee_id']===$committeeId),'member_id'));
        $members = array_values(array_filter($members, fn($m)=>in_array($m['id'],$ids,true)));
        $tasks = array_values(array_filter($tasks, fn($t)=>$t['committee_id']===$committeeId));
        $attendance = array_values(array_filter($attendance, fn($r)=>$r['committee_id']===$committeeId));
    }
    $inRange = fn($date)=> (!$from || substr((string)$date,0,10)>=$from) && (!$to || substr((string)$date,0,10)<=$to);
    $tasks = array_values(array_filter($tasks, fn($t)=>$inRange($t['created_at'])));
    $attendance = array_values(array_filter($attendance, fn($r)=>preg_match('/^\d{4}-\d{2}$/',$r['period']??'')
        ? (!$from || $r['period']>=substr($from,0,7)) && (!$to || $r['period']<=substr($to,0,7))
        : $inRange($r['created_at'])));
    return compact('committees','members','assignments','tasks','attendance');
}

function workflowReport(PDO $pdo, string $type, string $title, ?string $committeeId, ?string $from, ?string $to): array {
    $data = workflowReportData($pdo,$committeeId,$from,$to);
    extract($data);
    $scores = workflowScores($members,$tasks,$attendance);
    switch ($type) {
        case 'committee':
            $headers=['Name','Committee Type','Issued date','Issued by','Authority reference','Effective until'];
            $rows=array_map(fn($c)=>[$c['name'],$c['type'],$c['issued_date']??'Not recorded',$c['issued_by']??'Not recorded',$c['establishing_reference']??'Not recorded',$c['effective_until']??'No end date recorded'],array_values(array_filter($committees,fn($c)=>(!$from || substr($c['issued_date']??$c['created_at'],0,10)>=$from)&&(!$to || substr($c['issued_date']??$c['created_at'],0,10)<=$to))));
            break;
        case 'member':
            $headers=['Name','Position','Email','Availability','Open tasks'];
            $rows=array_map(fn($m)=>[$m['full_name'],$m['position']??'—',$m['email']??'—',$m['availability'],count(array_filter($tasks,fn($t)=>$t['member_id']===$m['id']&&$t['status']!=='completed'))],$members);
            break;
        case 'performance':
            $headers=['Member','Assigned','Completed','Attendance','On-time','Final score','Grade'];
            $rows=array_map(fn($s)=>[$s['full_name'],$s['total_tasks'],$s['completed_tasks'],$s['attendance_rate'].'%',$s['completed_tasks']?$s['on_time_rate'].'%':'—',$s['performance_score'].'%',$s['grade']],$scores);
            break;
        case 'workload':
            $headers=['Member','Open','Completed'];
            $rows=array_map(fn($s)=>[$s['full_name'],$s['total_tasks']-$s['completed_tasks'],$s['completed_tasks']],$scores);
            break;
        default:
            $headers=['Category','Count'];
            $rows=[['Committees',count($committees)],['Members',count($members)],['Tasks created in period',count($tasks)],['Open tasks',count(array_filter($tasks,fn($t)=>$t['status']!=='completed'))],['Completed tasks',count(array_filter($tasks,fn($t)=>$t['status']==='completed'))],['Roster assignments',count($assignments)]];
    }
    return ['title'=>$title,'headers'=>$headers,'rows'=>array_values($rows),'generated_at'=>workflowNow(),'date_from'=>$from,'date_to'=>$to,'basis'=>'Task creation date; attendance reporting month; committee issuance date. Rosters reflect generation time.'];
}
