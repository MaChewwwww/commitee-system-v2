<?php
/** Application workflow controls; these are not a substitute for sanggunian proceedings. */
const OPEN_TASK_STATUSES = ['pending', 'in_progress', 'awaiting_approval'];

function workflowDate(mixed $value, string $label): ?string {
    if ($value === null || $value === '') return null;
    $date = is_string($value) ? DateTimeImmutable::createFromFormat('!Y-m-d', $value) : false;
    if (!$date || $date->format('Y-m-d') !== $value || (int)$date->format('Y') < 1000) {
        throw new DomainException($label . ' must be a valid YYYY-MM-DD date.', 400);
    }
    return $value;
}

function workflowNow(): string {
    return (new DateTimeImmutable('now', new DateTimeZone('Asia/Manila')))->format('Y-m-d H:i:s');
}

function workflowCommitteeOpen(array $committee, ?string $today = null): bool {
    return ($committee['status'] ?? 'active') === 'active'
        && (empty($committee['effective_until']) || $committee['effective_until'] >= ($today ?? substr(workflowNow(), 0, 10)));
}

function workflowAssertCommitteeOpen(PDO $pdo, string $id): void {
    $statement = $pdo->prepare('SELECT status, effective_until FROM committees WHERE id = :id');
    $statement->execute(['id'=>$id]);
    $committee = $statement->fetch();
    if (!$committee) throw new DomainException('Committee not found.', 404);
    if (!workflowCommitteeOpen($committee)) throw new DomainException('This committee is inactive, dissolved, or past its effective-until date. New assignments are not allowed.', 409);
}

/** One term end date shared by committee and every jurisdiction row. Caller owns transaction. */
function workflowSetCommitteeEndDate(PDO $pdo, string $id, ?string $end): void {
    $lock=$pdo->prepare('SELECT issued_date FROM committees WHERE id=:id FOR UPDATE');
    $lock->execute(['id'=>$id]);
    $issued=$lock->fetchColumn();
    if ($end && $issued && $issued > $end) throw new DomainException('Effective until must not precede the committee issuance date.',400);
    if ($end) {
        $starts=$pdo->prepare('SELECT COUNT(*) FROM jurisdictions WHERE committee_id=:id AND effectivity_date>:end');
        $starts->execute(['id'=>$id,'end'=>$end]);
        if ($starts->fetchColumn()>0) throw new DomainException('The committee end date must not precede an existing jurisdiction start date.',409);
    }
    $pdo->prepare('UPDATE committees SET effective_until=:end WHERE id=:id')->execute(['end'=>$end,'id'=>$id]);
    $pdo->prepare('UPDATE jurisdictions SET effective_until=:end WHERE committee_id=:id')->execute(['end'=>$end,'id'=>$id]);
}

function workflowTaskTransition(array $task, string $next, array $actor): array {
    $current = $task['status'];
    if ($next === $current) return [];
    $transitions = ['pending'=>['in_progress'], 'in_progress'=>['awaiting_approval'], 'awaiting_approval'=>['in_progress','completed'], 'completed'=>[]];
    if (!in_array($next, $transitions[$current] ?? [], true)) throw new DomainException('Start the task, submit it for review, then have an authorized reviewer approve completion.', 409);
    $reviewer = in_array($actor['role_code'], ['super_admin','sk_chairperson','secretary'], true)
        || ($actor['role_code'] === 'committee_chairperson' && in_array($task['committee_id'], $actor['chair_committee_ids'] ?? [], true));
    if ($current === 'awaiting_approval' && !$reviewer) throw new DomainException('Only an authorized committee reviewer can approve or return submitted work.', 403);
    if ($next === 'completed' && !empty($actor['member_id']) && $actor['member_id'] === $task['member_id']) throw new DomainException('A different authorized reviewer must approve your work.', 403);
    $changes = ['status'=>$next];
    if ($next === 'awaiting_approval') $changes['submitted_at'] = workflowNow();
    if ($next === 'completed') {
        $changes['completed_at'] = $task['submitted_at'] ?? workflowNow();
        $changes['approved_at'] = workflowNow();
        $changes['approved_by'] = $actor['email'];
        $changes['approved_by_user_id'] = $actor['id'];
    }
    if ($current === 'awaiting_approval' && $next === 'in_progress') $changes['submitted_at'] = null;
    return $changes;
}
