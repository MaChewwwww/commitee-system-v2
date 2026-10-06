<?php
require_once __DIR__ . '/../domain/reporting.php';
function check(bool $condition,string $label): void { if (!$condition) throw new RuntimeException($label); }
function rejected(callable $operation,int $code): void { try {$operation();} catch (DomainException $e) {check($e->getCode()===$code,'Unexpected rejection');return;} throw new RuntimeException('Expected rejection'); }
check(workflowDate('2028-02-29','Date')==='2028-02-29','Leap year');
rejected(fn()=>workflowDate('2026-02-29','Date'),400);
check(workflowCommitteeOpen(['status'=>'active','effective_until'=>'2026-10-06'],'2026-10-06'),'Last day inclusive');
check(!workflowCommitteeOpen(['status'=>'active','effective_until'=>'2026-10-05'],'2026-10-06'),'Expired committee');
check(!workflowCommitteeOpen(['status'=>'dissolved'],'2026-10-06'),'Dissolved committee');
$member=['id'=>'u1','role_code'=>'sk_member','member_id'=>'m1','email'=>'member@example.test'];
$reviewer=['id'=>'u2','role_code'=>'committee_chairperson','member_id'=>'m2','email'=>'chair@example.test','chair_committee_ids'=>['c1']];
$task=['committee_id'=>'c1','member_id'=>'m1','status'=>'pending'];
rejected(fn()=>workflowTaskTransition($task,'completed',$reviewer),409);
$task=array_merge($task,workflowTaskTransition($task,'in_progress',$member));
$task=array_merge($task,workflowTaskTransition($task,'awaiting_approval',$member));
check(!empty($task['submitted_at']),'Submission date recorded');
rejected(fn()=>workflowTaskTransition($task,'completed',$member),403);
rejected(fn()=>workflowTaskTransition($task,'completed',array_merge($reviewer,['member_id'=>'m1'])),403);
rejected(fn()=>workflowTaskTransition($task,'completed',array_merge($reviewer,['chair_committee_ids'=>['c2']])),403);
$returned=workflowTaskTransition($task,'in_progress',$reviewer);
check($returned['submitted_at']===null,'Revision clears submission date');
$approved=workflowTaskTransition($task,'completed',$reviewer);
check($approved['completed_at']===$task['submitted_at'],'Completion preserves submission date, not review lag');
check($approved['approved_by_user_id']==='u2' && $approved['approved_by']==='chair@example.test','Reviewer from authenticated identity');
rejected(fn()=>workflowTaskTransition(array_merge($task,$approved),'in_progress',$reviewer),409);
$scores=workflowScores([['id'=>'m1','full_name'=>'One'],['id'=>'m2','full_name'=>'Two']], [array_merge($task,$approved,['due_date'=>substr($task['submitted_at'],0,10)]),['member_id'=>'m1','status'=>'in_progress']], [['id'=>'a1','member_id'=>'m1','attendance_rate'=>20,'created_at'=>'2026-01-01'],['id'=>'a2','member_id'=>'m1','attendance_rate'=>100,'created_at'=>'2026-10-01']]);
check($scores[0]['performance_score']==75 && $scores[0]['grade']==='Good','Weighted score 50/20/30 and latest attendance');
check($scores[1]['performance_score']==0,'Zero tasks and no attendance');
echo "Workflow date, term, approval, identity, and weighted score checks passed.\n";
