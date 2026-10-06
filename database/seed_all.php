<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(403); exit("CLI only\n"); }
date_default_timezone_set('Asia/Manila');

require_once __DIR__ . '/../backend/config/database.php';

echo "=== Seeding SP Committee Management System Database ===\n";

try {
    $pdo = localPdo();
    foreach ($argv as $argument) {
        if (str_starts_with($argument, '--database=')) {
            $testDatabase = substr($argument, 11);
            if (!preg_match('/^committee_seed_test_[a-z0-9_]+$/', $testDatabase)) { throw new RuntimeException('Only isolated seed-test database overrides are allowed.'); }
            $pdo->exec('USE `' . $testDatabase . '`');
        }
    }
    $resetTables = [];
    if (in_array('--reset', $argv, true)) {
        if (!in_array(committeeEnv('COMMITTEE_DB_HOST'), ['127.0.0.1', 'localhost', '::1'], true)) { throw new RuntimeException('Reset is restricted to the local development database.'); }
        $backupPath = '';
        foreach ($argv as $argument) { if (str_starts_with($argument, '--backup=')) { $backupPath = substr($argument, 9); } }
        if ($backupPath === '') { throw new RuntimeException('Reset requires --backup=/absolute/path.sql'); }
        require_once __DIR__ . '/reset_support.php';
        $resetTables = backupSeedDatabase($pdo, $backupPath);
        $pdo->exec('SET FOREIGN_KEY_CHECKS=0');
    }
    $pdo->beginTransaction();
    foreach ($resetTables as $table) { $pdo->exec('DELETE FROM `' . $table . '`'); }

    // 1. ROLES
    echo "1. Seeding Roles...\n";
    $roles = [
        ['code' => 'super_admin', 'label' => 'Super Administrator', 'description' => 'Full system access, settings, and user management'],
        ['code' => 'sk_chairperson', 'label' => 'Sanggunian Chairperson', 'description' => 'Council governance, executive oversight, and committee coordination'],
        ['code' => 'secretary', 'label' => 'Sanggunian Secretary', 'description' => 'Records, minutes, committee assignments, and official notices'],
        ['code' => 'treasurer', 'label' => 'Treasurer', 'description' => 'Budget tracking, financial allocations, and committee monitoring'],
        ['code' => 'committee_chairperson', 'label' => 'Committee Chairperson', 'description' => 'Leads specific committee projects, tasks, and member assignments'],
        ['code' => 'sk_member', 'label' => 'Committee Member', 'description' => 'Participates in committee deliberations, projects, and task execution'],
    ];

    $roleStmt = $pdo->prepare("INSERT INTO roles (id, code, label, description) VALUES (UUID(), :code, :label, :description) ON DUPLICATE KEY UPDATE label = VALUES(label), description = VALUES(description)");
    foreach ($roles as $r) {
        $roleStmt->execute($r);
    }
    
    // 2. PERMISSIONS
    echo "2. Seeding Permissions...\n";
    $permissions = [
        ['code' => 'dashboard.view', 'label' => 'View Dashboard', 'module' => 'dashboard'],
        ['code' => 'members.view', 'label' => 'View Members', 'module' => 'members'],
        ['code' => 'members.create', 'label' => 'Create Member', 'module' => 'members'],
        ['code' => 'members.update', 'label' => 'Update Member', 'module' => 'members'],
        ['code' => 'members.delete', 'label' => 'Delete Member', 'module' => 'members'],
        ['code' => 'committees.view', 'label' => 'View Committees', 'module' => 'committees'],
        ['code' => 'committees.create', 'label' => 'Create Committee', 'module' => 'committees'],
        ['code' => 'committees.update', 'label' => 'Update Committee', 'module' => 'committees'],
        ['code' => 'committees.delete', 'label' => 'Delete Committee', 'module' => 'committees'],
        ['code' => 'assignments.view', 'label' => 'View Assignments', 'module' => 'assignments'],
        ['code' => 'assignments.create', 'label' => 'Create Assignment', 'module' => 'assignments'],
        ['code' => 'assignments.update', 'label' => 'Update Assignment', 'module' => 'assignments'],
        ['code' => 'assignments.delete', 'label' => 'Delete Assignment', 'module' => 'assignments'],
        ['code' => 'jurisdictions.view', 'label' => 'View Jurisdictions', 'module' => 'jurisdictions'],
        ['code' => 'jurisdictions.create', 'label' => 'Create Jurisdiction', 'module' => 'jurisdictions'],
        ['code' => 'jurisdictions.update', 'label' => 'Update Jurisdiction', 'module' => 'jurisdictions'],
        ['code' => 'jurisdictions.delete', 'label' => 'Delete Jurisdiction', 'module' => 'jurisdictions'],
        ['code' => 'workload.view', 'label' => 'View Workload Analysis', 'module' => 'workload'],
        ['code' => 'performance.view', 'label' => 'View Performance Metrics', 'module' => 'performance'],
        ['code' => 'performance.create', 'label' => 'Record Performance', 'module' => 'performance'],
        ['code' => 'performance.delete', 'label' => 'Delete Performance Record', 'module' => 'performance'],
        ['code' => 'tasks.view', 'label' => 'View Tasks', 'module' => 'tasks'],
        ['code' => 'tasks.create', 'label' => 'Create Task', 'module' => 'tasks'],
        ['code' => 'tasks.update', 'label' => 'Update Task', 'module' => 'tasks'],
        ['code' => 'tasks.delete', 'label' => 'Delete Task', 'module' => 'tasks'],
        ['code' => 'reports.view', 'label' => 'View Reports', 'module' => 'reports'],
        ['code' => 'reports.create', 'label' => 'Create Report', 'module' => 'reports'],
        ['code' => 'reports.delete', 'label' => 'Delete Report', 'module' => 'reports'],
        ['code' => 'archives.view', 'label' => 'View Legislative Archives', 'module' => 'reports'],
        ['code' => 'archives.create', 'label' => 'Export to Legislative Archives', 'module' => 'reports'],
        ['code' => 'session.view', 'label' => 'View Session Performance', 'module' => 'performance'],
        ['code' => 'session.create', 'label' => 'Send to Session', 'module' => 'performance'],
        ['code' => 'users.view', 'label' => 'View System Users', 'module' => 'users'],
        ['code' => 'users.create', 'label' => 'Create System User', 'module' => 'users'],
        ['code' => 'users.update', 'label' => 'Update System User', 'module' => 'users'],
        ['code' => 'users.delete', 'label' => 'Delete System User', 'module' => 'users'],
        ['code' => 'roles.manage', 'label' => 'Manage Roles & Permissions', 'module' => 'roles'],
        ['code' => 'ai.use', 'label' => 'Use AI Decision Tools', 'module' => 'ai'],
    ];

    $permStmt = $pdo->prepare("INSERT INTO permissions (id, code, label, module) VALUES (UUID(), :code, :label, :module) ON DUPLICATE KEY UPDATE label = VALUES(label), module = VALUES(module)");
    foreach ($permissions as $p) {
        $permStmt->execute($p);
    }

    // 3. ROLE PERMISSIONS
    echo "3. Linking Role Permissions...\n";
    $allRoles = $pdo->query("SELECT id, code FROM roles")->fetchAll(PDO::FETCH_KEY_PAIR);
    $allPerms = $pdo->query("SELECT id, code FROM permissions")->fetchAll(PDO::FETCH_KEY_PAIR);
    $rpStmt = $pdo->prepare("INSERT IGNORE INTO role_permissions (id, role_id, permission_id) VALUES (UUID(), :role_id, :permission_id)");

    foreach ($allRoles as $roleId => $code) {
        if (in_array($code, ['super_admin', 'sk_chairperson', 'secretary'])) {
            foreach ($allPerms as $permId => $pCode) {
                $rpStmt->execute(['role_id' => $roleId, 'permission_id' => $permId]);
            }
        } elseif ($code === 'treasurer') {
            foreach ($allPerms as $permId => $pCode) {
                if (!str_starts_with($pCode, 'users.') && $pCode !== 'roles.manage') {
                    $rpStmt->execute(['role_id' => $roleId, 'permission_id' => $permId]);
                }
            }
        } elseif ($code === 'committee_chairperson') {
            $chairPerms = ['dashboard.view', 'committees.view', 'members.view', 'assignments.view', 'tasks.view', 'tasks.create', 'tasks.update', 'workload.view', 'performance.view', 'reports.view', 'reports.create', 'ai.use'];
            foreach ($allPerms as $permId => $pCode) {
                if (in_array($pCode, $chairPerms)) {
                    $rpStmt->execute(['role_id' => $roleId, 'permission_id' => $permId]);
                }
            }
        } elseif ($code === 'sk_member') {
            $memberPerms = ['dashboard.view','members.view','committees.view','assignments.view','workload.view','tasks.view','tasks.update','reports.view','performance.view'];
            foreach ($allPerms as $permId => $pCode) {
                if (in_array($pCode, $memberPerms)) {
                    $rpStmt->execute(['role_id' => $roleId, 'permission_id' => $permId]);
                }
            }
        }
    }

    // 4. USERS (LOGIN ACCOUNTS)
    echo "4. Seeding User Accounts...\n";
    $superAdminRoleId = $pdo->query("SELECT id FROM roles WHERE code = 'super_admin'")->fetchColumn();
    $chairRoleId = $pdo->query("SELECT id FROM roles WHERE code = 'sk_chairperson'")->fetchColumn();
    $secRoleId = $pdo->query("SELECT id FROM roles WHERE code = 'secretary'")->fetchColumn();
    $tresRoleId = $pdo->query("SELECT id FROM roles WHERE code = 'treasurer'")->fetchColumn();

    $seededUsers = [
        ['email' => 'waniwangerald13@gmail.com', 'role_id' => $superAdminRoleId],
        ['email' => 'caranyagan.johnpaul.bueno@gmail.com', 'role_id' => $superAdminRoleId],
        ['email' => 'admin@sk.gov.ph', 'role_id' => $superAdminRoleId],
        ['email' => 'chairperson@sk.gov.ph', 'role_id' => $chairRoleId],
        ['email' => 'secretary@sk.gov.ph', 'role_id' => $secRoleId],
        ['email' => 'treasurer@sk.gov.ph', 'role_id' => $tresRoleId],
    ];

    $userStmt = $pdo->prepare("INSERT INTO users (id, email, role_id, is_active) VALUES (UUID(), :email, :role_id, 1) ON DUPLICATE KEY UPDATE role_id = VALUES(role_id), is_active = 1");
    foreach ($seededUsers as $u) {
        $userStmt->execute($u);
    }

    // 5. COMMITTEES
    echo "5. Seeding Committees...\n";
    $committees = [
        [
            'name' => 'Committee on Education, Culture and Sports',
            'type' => 'Standing',
            'purpose' => 'Promote quality education, cultural preservation, and youth sports development programs.',
            'mandate' => 'Lead educational financial assistance, cultural exhibitions, and athletic training leagues.',
            'qualification_requirements' => 'Background in sports leadership, academic mentoring, or youth organization.'
        ],
        [
            'name' => 'Committee on Health, Sanitation and Environment',
            'type' => 'Standing',
            'purpose' => 'Promote community cleanliness, mental health awareness, and environmental sustainability.',
            'mandate' => 'Organize medical-dental missions, clean-up drives, and community recycling drives.',
            'qualification_requirements' => 'Experience in community wellness, first aid, or environmental projects.'
        ],
        [
            'name' => 'Committee on Youth Employment and Livelihood',
            'type' => 'Standing',
            'purpose' => 'Enhance youth economic self-reliance through skills development and entrepreneurial training.',
            'mandate' => 'Host career guidance seminars, job match expos, and micro-grant training for young entrepreneurs.',
            'qualification_requirements' => 'Skills in business administration, vocational training, or enterprise management.'
        ],
        [
            'name' => 'Committee on Peace and Order, Public Safety',
            'type' => 'Standing',
            'purpose' => 'Maintain safe and peaceful community conditions with proactive youth involvement.',
            'mandate' => 'Implement drug awareness workshops (BKD), disaster preparedness drills, and night visibility patrols.',
            'qualification_requirements' => 'Knowledge in community safety, disaster response, or youth advocacy.'
        ],
        [
            'name' => 'Committee on Gender and Development (GAD)',
            'type' => 'Special',
            'purpose' => 'Advance gender equality, inclusivity, and protection against discrimination.',
            'mandate' => 'Organize GAD sensitivity orientations, anti-VAWC youth forums, and women/LGBTQIA+ empowerment seminars.',
            'qualification_requirements' => 'Advocacy experience in gender equality and human rights.'
        ],
        [
            'name' => 'Committee on Disaster Risk Reduction and Management (DRRM)',
            'type' => 'Special',
            'purpose' => 'Lead youth response in disaster resilience, relief operations, and climate adaptation.',
            'mandate' => 'Train youth volunteers in basic life support, emergency rescue, and evacuation management.',
            'qualification_requirements' => 'Certified in emergency response or community risk management.'
        ],
    ];

    $commStmt = $pdo->prepare("INSERT INTO committees (id, name, type, purpose, mandate, qualification_requirements, status) VALUES (UUID(), :name, :type, :purpose, :mandate, :qualification_requirements, 'active')");
    $existingCommNames = $pdo->query("SELECT name FROM committees")->fetchAll(PDO::FETCH_COLUMN);

    foreach ($committees as $c) {
        if (!in_array($c['name'], $existingCommNames, true)) {
            $commStmt->execute($c);
        }
    }

    // 6. MEMBERS
    echo "6. Seeding Members...\n";
    $members = [
        [
            'full_name' => 'Gerald Waniwan',
            'email' => 'waniwangerald13@gmail.com',
            'phone' => '09170001301',
            'position' => 'Sanggunian Chairperson',
            'skills' => json_encode(['Executive Leadership', 'Strategic Planning', 'Policy Formulation', 'Public Relations']),
            'availability' => 'available',
            'workload_score' => 20.00
        ],
        [
            'full_name' => 'Juan Dela Cruz',
            'email' => 'juan@sk.gov.ph',
            'phone' => '09171234567',
            'position' => 'SK Kagawad',
            'skills' => json_encode(['Athletics', 'Public Speaking', 'Event Organization']),
            'availability' => 'available',
            'workload_score' => 45.00
        ],
        [
            'full_name' => 'Maria Santos',
            'email' => 'maria@sk.gov.ph',
            'phone' => '09181234567',
            'position' => 'SK Kagawad',
            'skills' => json_encode(['Financial Planning', 'Documentation', 'Administrative Support']),
            'availability' => 'available',
            'workload_score' => 30.00
        ],
        [
            'full_name' => 'Carlos Reyes',
            'email' => 'carlos@sk.gov.ph',
            'phone' => '09191234567',
            'position' => 'SK Kagawad',
            'skills' => json_encode(['Community Organizing', 'Emergency Response', 'Logistics']),
            'availability' => 'available',
            'workload_score' => 50.00
        ],
        [
            'full_name' => 'Alyssa Garcia',
            'email' => 'alyssa@sk.gov.ph',
            'phone' => '09201234567',
            'position' => 'SK Kagawad',
            'skills' => json_encode(['Graphic Design', 'Social Media Management', 'Creative Writing']),
            'availability' => 'available',
            'workload_score' => 25.00
        ],
        [
            'full_name' => 'Kenneth Bautista',
            'email' => 'kenneth@sk.gov.ph',
            'phone' => '09211234567',
            'position' => 'SK Kagawad',
            'skills' => json_encode(['Youth Mobilization', 'Health Advocacy', 'First Aid']),
            'availability' => 'available',
            'workload_score' => 35.00
        ],
        [
            'full_name' => 'Nicole Mendoza',
            'email' => 'nicole@sk.gov.ph',
            'phone' => '09221234567',
            'position' => 'SK Kagawad',
            'skills' => json_encode(['Environmental Science', 'Event Coordination', 'Research']),
            'availability' => 'busy',
            'workload_score' => 70.00
        ],
    ];

    $memStmt = $pdo->prepare("INSERT INTO members (id, full_name, email, phone, position, skills, availability, workload_score) VALUES (UUID(), :full_name, :email, :phone, :position, :skills, :availability, :workload_score)");
    $existingMemEmails = $pdo->query("SELECT email FROM members WHERE email IS NOT NULL")->fetchAll(PDO::FETCH_COLUMN);

    foreach ($members as $m) {
        if (!in_array($m['email'], $existingMemEmails, true)) {
            $memStmt->execute($m);
        }
    }

    // Link Gerald's user account with his member record if not yet linked
    $geraldMemberId = $pdo->query("SELECT id FROM members WHERE email = 'waniwangerald13@gmail.com' LIMIT 1")->fetchColumn();
    if ($geraldMemberId) {
        $pdo->prepare("UPDATE users SET member_id = :mid WHERE email = 'waniwangerald13@gmail.com'")->execute(['mid' => $geraldMemberId]);
    }

    $scopedUsers = $pdo->prepare("INSERT INTO users (id, email, role_id, member_id, is_active) SELECT UUID(), :email, r.id, m.id, 1 FROM roles r JOIN members m ON m.email = :member_email WHERE r.code = :role ON DUPLICATE KEY UPDATE member_id = VALUES(member_id)");
    foreach ([['kenneth@sk.gov.ph', 'committee_chairperson'], ['nicole@sk.gov.ph', 'sk_member']] as [$email, $role]) {
        $scopedUsers->execute(['email' => $email, 'member_email' => $email, 'role' => $role]);
    }

    // 7. COMMITTEE ASSIGNMENTS
    echo "7. Seeding Committee Assignments...\n";
    $commLookup = $pdo->query("SELECT name, id FROM committees")->fetchAll(PDO::FETCH_KEY_PAIR);
    $memLookup = $pdo->query("SELECT email, id FROM members")->fetchAll(PDO::FETCH_KEY_PAIR);

    $assignments = [
        ['comm' => 'Committee on Education, Culture and Sports', 'email' => 'waniwangerald13@gmail.com', 'role' => 'Chairperson'],
        ['comm' => 'Committee on Education, Culture and Sports', 'email' => 'juan@sk.gov.ph', 'role' => 'Vice Chairperson'],
        ['comm' => 'Committee on Education, Culture and Sports', 'email' => 'alyssa@sk.gov.ph', 'role' => 'Member'],

        ['comm' => 'Committee on Health, Sanitation and Environment', 'email' => 'kenneth@sk.gov.ph', 'role' => 'Chairperson'],
        ['comm' => 'Committee on Health, Sanitation and Environment', 'email' => 'nicole@sk.gov.ph', 'role' => 'Member'],

        ['comm' => 'Committee on Youth Employment and Livelihood', 'email' => 'maria@sk.gov.ph', 'role' => 'Chairperson'],
        ['comm' => 'Committee on Youth Employment and Livelihood', 'email' => 'carlos@sk.gov.ph', 'role' => 'Member'],

        ['comm' => 'Committee on Peace and Order, Public Safety', 'email' => 'carlos@sk.gov.ph', 'role' => 'Chairperson'],
        ['comm' => 'Committee on Peace and Order, Public Safety', 'email' => 'waniwangerald13@gmail.com', 'role' => 'Member'],
        ['comm' => 'Committee on Gender and Development (GAD)', 'email' => 'alyssa@sk.gov.ph', 'role' => 'Chairperson'],
        ['comm' => 'Committee on Gender and Development (GAD)', 'email' => 'maria@sk.gov.ph', 'role' => 'Member'],
        ['comm' => 'Committee on Disaster Risk Reduction and Management (DRRM)', 'email' => 'carlos@sk.gov.ph', 'role' => 'Chairperson'],
        ['comm' => 'Committee on Disaster Risk Reduction and Management (DRRM)', 'email' => 'kenneth@sk.gov.ph', 'role' => 'Member'],
    ];

    $assignStmt = $pdo->prepare("INSERT IGNORE INTO committee_members (id, committee_id, member_id, role) VALUES (UUID(), :cid, :mid, :role)");
    foreach ($assignments as $a) {
        if (isset($commLookup[$a['comm']]) && isset($memLookup[$a['email']])) {
            $assignStmt->execute([
                'cid' => $commLookup[$a['comm']],
                'mid' => $memLookup[$a['email']],
                'role' => $a['role']
            ]);
        }
    }

    // 8. JURISDICTIONS
    echo "8. Seeding Jurisdictions...\n";
    $jurisdictions = [
        ['comm' => 'Committee on Education, Culture and Sports', 'area_name' => 'Zone 1 - Youth Learning & Sports Complex', 'category' => 'Education'],
        ['comm' => 'Committee on Health, Sanitation and Environment', 'area_name' => 'Zone 2 - Barangay Eco-Park & Community Clinic', 'category' => 'Health'],
        ['comm' => 'Committee on Youth Employment and Livelihood', 'area_name' => 'Zone 3 - Livelihood & Skills Training Center', 'category' => 'Livelihood'],
        ['comm' => 'Committee on Peace and Order, Public Safety', 'area_name' => 'Zone 4 - Barangay Patrol Outposts & Evacuation Center', 'category' => 'Peace and Order'],
        ['comm' => 'Committee on Gender and Development (GAD)', 'area_name' => 'Community Gender and Youth Support Center', 'category' => 'Social Services'],
        ['comm' => 'Committee on Disaster Risk Reduction and Management (DRRM)', 'area_name' => 'Community Disaster Response & Evacuation Hub', 'category' => 'Infrastructure'],
    ];

    $jurStmt = $pdo->prepare("INSERT INTO jurisdictions (id, committee_id, area_name, category) VALUES (UUID(), :cid, :area_name, :category)");
    $existingAreas = $pdo->query("SELECT CONCAT(committee_id, '|', area_name) FROM jurisdictions")->fetchAll(PDO::FETCH_COLUMN);

    foreach ($jurisdictions as $j) {
        if (isset($commLookup[$j['comm']]) && !in_array($commLookup[$j['comm']] . '|' . $j['area_name'], $existingAreas, true)) {
            $jurStmt->execute([
                'cid' => $commLookup[$j['comm']],
                'area_name' => $j['area_name'],
                'category' => $j['category']
            ]);
        }
    }

    // 9. TASKS
    echo "9. Seeding Tasks...\n";
    $tasks = [
        [
            'comm' => 'Committee on Education, Culture and Sports',
            'mem' => 'waniwangerald13@gmail.com',
            'title' => 'Launch 2026 Inter-Barangay Basketball & Volleyball League',
            'desc' => 'Finalize team rosters, officiators, schedule brackets, and medical standby personnel.',
            'status' => 'pending',
            'due' => date('Y-m-d', strtotime('+10 days'))
        ],
        [
            'comm' => 'Committee on Education, Culture and Sports',
            'mem' => 'juan@sk.gov.ph',
            'title' => 'Educational Assistance Distribution for Senior High Students',
            'desc' => 'Verify student enrollment certificates and prepare stipends distribution vouchers.',
            'status' => 'pending',
            'due' => date('Y-m-d', strtotime('+5 days'))
        ],
        [
            'comm' => 'Committee on Health, Sanitation and Environment',
            'mem' => 'kenneth@sk.gov.ph',
            'title' => 'Youth Mental Health Awareness & Wellness Forum',
            'desc' => 'Invite clinical psychologists and peer facilitators for the wellness session.',
            'status' => 'pending',
            'due' => date('Y-m-d', strtotime('+12 days'))
        ],
        [
            'comm' => 'Committee on Health, Sanitation and Environment',
            'mem' => 'nicole@sk.gov.ph',
            'title' => 'Barangay-Wide Riverbank Tree Planting & Clean-up Drive',
            'desc' => 'Mobilized 80 youth volunteers to clean riverbank Zone 2 and plant 200 bamboo saplings.',
            'status' => 'completed',
            'due' => date('Y-m-d', strtotime('-3 days'))
        ],
        [
            'comm' => 'Committee on Youth Employment and Livelihood',
            'mem' => 'maria@sk.gov.ph',
            'title' => 'Digital Freelancing and AI Tools Bootcamp for Youth',
            'desc' => 'Coordinate with DICT trainer and set up 25 desktop workstations at training hall.',
            'status' => 'pending',
            'due' => date('Y-m-d', strtotime('+8 days'))
        ],
        [
            'comm' => 'Committee on Peace and Order, Public Safety',
            'mem' => 'carlos@sk.gov.ph',
            'title' => 'Drug Prevention and BARKADA Kontra Droga Campaign',
            'desc' => 'Distributed anti-drug brochures and conducted interactive workshop in 2 public high schools.',
            'status' => 'completed',
            'due' => date('Y-m-d', strtotime('-5 days'))
        ],
    ];

    $taskStmt = $pdo->prepare("INSERT INTO tasks (id, committee_id, member_id, title, description, status, due_date) VALUES (UUID(), :cid, :mid, :title, :desc, :status, :due)");
    $existingTaskTitles = $pdo->query("SELECT title FROM tasks")->fetchAll(PDO::FETCH_COLUMN);

    foreach ($tasks as $t) {
        if (!in_array($t['title'], $existingTaskTitles, true)) {
            $taskStmt->execute([
                'cid' => $commLookup[$t['comm']] ?? null,
                'mid' => $memLookup[$t['mem']] ?? null,
                'title' => $t['title'],
                'desc' => $t['desc'],
                'status' => $t['status'],
                'due' => $t['due']
            ]);
        }
    }

    // 10. PERFORMANCE
    echo "10. Seeding Performance Records...\n";
    $perfRecords = [
        ['email' => 'waniwangerald13@gmail.com', 'comm' => 'Committee on Education, Culture and Sports', 'att' => 98.00, 'task' => 95.00, 'score' => 96.50, 'period' => 'Q3 2026'],
        ['email' => 'juan@sk.gov.ph', 'comm' => 'Committee on Education, Culture and Sports', 'att' => 92.00, 'task' => 88.00, 'score' => 90.00, 'period' => 'Q3 2026'],
        ['email' => 'maria@sk.gov.ph', 'comm' => 'Committee on Youth Employment and Livelihood', 'att' => 95.00, 'task' => 92.00, 'score' => 93.50, 'period' => 'Q3 2026'],
        ['email' => 'carlos@sk.gov.ph', 'comm' => 'Committee on Peace and Order, Public Safety', 'att' => 90.00, 'task' => 94.00, 'score' => 92.00, 'period' => 'Q3 2026'],
    ];

    $perfStmt = $pdo->prepare("INSERT INTO performance (id, member_id, committee_id, attendance_rate, task_completion_rate, performance_score, period) VALUES (UUID(), :mid, :cid, :att, :task, :score, :period)");
    $perfExists = $pdo->prepare("SELECT COUNT(*) FROM performance WHERE member_id = ? AND committee_id = ? AND period = ?");

    {
        foreach ($perfRecords as $p) {
            if (isset($memLookup[$p['email']]) && isset($commLookup[$p['comm']])) {
                $perfExists->execute([$memLookup[$p['email']], $commLookup[$p['comm']], $p['period']]);
                if ($perfExists->fetchColumn()) { continue; }
                $perfStmt->execute([
                    'mid' => $memLookup[$p['email']],
                    'cid' => $commLookup[$p['comm']],
                    'att' => $p['att'],
                    'task' => $p['task'],
                    'score' => $p['score'],
                    'period' => $p['period']
                ]);
            }
        }
    }

    // 11. REPORTS
    echo "11. Seeding Reports...\n";
    $reports = [
        [
            'title' => 'Q3 2026 Comprehensive Youth Sports & Education Accomplishment Report',
            'comm' => 'Committee on Education, Culture and Sports',
            'report_type' => 'committee',
            'from' => '2026-07-01',
            'to' => '2026-09-30'
        ],
        [
            'title' => 'Annual Community Greening & Cleanliness Drive Summary 2026',
            'comm' => 'Committee on Health, Sanitation and Environment',
            'report_type' => 'full',
            'from' => '2026-01-01',
            'to' => '2026-09-30'
        ],
    ];

    $repStmt = $pdo->prepare("INSERT INTO reports (id, title, committee_id, report_type, date_from, date_to) VALUES (UUID(), :title, :cid, :type, :from, :to)");
    $repExists = $pdo->prepare("SELECT COUNT(*) FROM reports WHERE title = ? AND committee_id = ? AND report_type = ?");

    {
        foreach ($reports as $r) {
            if (isset($commLookup[$r['comm']])) {
                $repExists->execute([$r['title'], $commLookup[$r['comm']], $r['report_type']]);
                if ($repExists->fetchColumn()) { continue; }
                $repStmt->execute([
                    'title' => $r['title'],
                    'cid' => $commLookup[$r['comm']],
                    'type' => $r['report_type'],
                    'from' => $r['from'],
                    'to' => $r['to']
                ]);
            }
        }
    }

    $pdo->commit();
    $pdo->exec('SET FOREIGN_KEY_CHECKS=1');
    echo "\n=== ALL DATA SEEDED SUCCESSFULLY! ===\n";

    echo "\nSeeded Accounts Available for Login:\n";
    $accounts = $pdo->query("SELECT u.email, r.label AS role, r.code AS role_code, m.full_name FROM users u LEFT JOIN roles r ON r.id = u.role_id LEFT JOIN members m ON m.id = u.member_id ORDER BY u.email ASC")->fetchAll();
    foreach ($accounts as $acc) {
        echo " - " . str_pad($acc['email'], 38) . " | Role: " . str_pad($acc['role'] ?: $acc['role_code'], 20) . " | Member: " . ($acc['full_name'] ?: 'None') . "\n";
    }

} catch (Throwable $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    if (isset($pdo) && $pdo instanceof PDO) { $pdo->exec('SET FOREIGN_KEY_CHECKS=1'); }
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
