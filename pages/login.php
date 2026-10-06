<?php
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../backend/config/auth.php';

startAppSession();
if (isAuthenticated()) {
    header('Location: ' . page_url('dashboard.php'));
    exit;
}

$sjdmLogoUrl = asset_url('logo.jpg');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login — SP Committee System</title>
    <link rel="stylesheet" href="<?php echo htmlspecialchars(asset_url('css/style.css')); ?>">
</head>
<body>
<div class="login-page">
    <div class="login-layout">
        <div class="login-branding">
            <div class="login-seal" role="img" aria-label="Sangguniang Panlungsod">
                <svg class="login-seal-svg" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <circle cx="120" cy="120" r="118" fill="#0B2E50"/>
                    <circle cx="120" cy="120" r="112" fill="none" stroke="#F4B400" stroke-width="3"/>
                    <circle cx="120" cy="120" r="102" fill="none" stroke="#F4B400" stroke-width="1" opacity="0.45"/>
                    <text x="120" y="54" text-anchor="middle" fill="#F4B400" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="16" font-weight="700" letter-spacing="1.2">SANGGUNIANG</text>
                    <line x1="78" y1="74" x2="102" y2="74" stroke="#F4B400" stroke-width="1.25" opacity="0.7"/>
                    <circle cx="120" cy="74" r="2" fill="#F4B400" opacity="0.85"/>
                    <line x1="138" y1="74" x2="162" y2="74" stroke="#F4B400" stroke-width="1.25" opacity="0.7"/>
                    <text x="120" y="138" text-anchor="middle" fill="#FFFFFF" font-family="Georgia, 'Times New Roman', serif" font-size="58" font-weight="700">SP</text>
                    <line x1="78" y1="162" x2="102" y2="162" stroke="#F4B400" stroke-width="1.25" opacity="0.7"/>
                    <circle cx="120" cy="162" r="2" fill="#F4B400" opacity="0.85"/>
                    <line x1="138" y1="162" x2="162" y2="162" stroke="#F4B400" stroke-width="1.25" opacity="0.7"/>
                    <text x="120" y="190" text-anchor="middle" fill="#F4B400" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="16" font-weight="700" letter-spacing="1.6">PANLUNGSOD</text>
                </svg>
            </div>
            <h1>SP Committee<br>Management System</h1>
            <p>Empowering youth governance through digital management and AI-assisted tools.</p>
            <div class="login-metrics">
                <div class="login-metric"><strong>AI</strong><span>Assisted</span></div>
                <div class="login-metric"><strong>SP</strong><span>Official</span></div>
                <div class="login-metric"><strong>LGU</strong><span>Ready</span></div>
            </div>
        </div>

        <div class="login-card">
            <div class="login-card-header">
                <img
                    src="<?php echo htmlspecialchars($sjdmLogoUrl); ?>"
                    alt="Official seal of Lungsod ng San Jose del Monte, Bulacan"
                    class="login-sjdm-logo"
                    width="90"
                    height="92"
                    decoding="async"
                >
                <h2>Welcome Back</h2>
                <p>Sign in with one-time password verification</p>
                <div class="online-pill"><span class="online-dot" aria-hidden="true"></span> System Online</div>
            </div>

            <div class="alert alert-info mb-5" role="note">
                A one-time password will be sent to your registered email address.
            </div>

            <div id="stepEmail">
                <div class="form-group mb-5">
                    <label class="form-label" for="emailInput">Email Address <span class="required">*</span></label>
                    <input type="email" id="emailInput" class="form-control" placeholder="admin@sk.gov.ph" autocomplete="email" onkeypress="if(event.key==='Enter') sendOTP()">
                </div>
                <button type="button" id="sendOTPBtn" class="btn btn-primary btn-block" onclick="sendOTP()">Send OTP Code</button>
            </div>

            <div id="stepOTP" class="hidden">
                <div class="state-box" style="padding:0 0 1rem;">
                    <p class="state-text">OTP sent to</p>
                    <p class="state-title" id="emailDisplay"></p>
                </div>
                <div class="form-group mb-5">
                    <label class="form-label" for="otpInput">Enter OTP Code <span class="required">*</span></label>
                    <input type="text" id="otpInput" class="form-control" maxlength="6" inputmode="numeric" placeholder="6-digit code" style="text-align:center;letter-spacing:0.35em;font-weight:700;font-size:1.1rem;" onkeypress="if(event.key==='Enter') verifyOTP()">
                </div>
                <button type="button" id="verifyBtn" class="btn btn-primary btn-block mb-4" onclick="verifyOTP()">Verify &amp; Login</button>
                <button type="button" class="btn btn-ghost btn-block" onclick="backToEmail()">Back / Resend OTP</button>
            </div>

            <div id="msgBox" class="hidden mt-4 alert" role="status" aria-live="polite"></div>

            <div class="login-footer">
                <p>Official SP Committee Management System</p>
                <p>Secured by OTP verification</p>
            </div>
        </div>
    </div>
</div>

<div id="toastStack" class="toast-stack" aria-live="polite"></div>

<script>
window.APP_CONFIG = {
    base: <?php echo json_encode(APP_BASE); ?>,
    pages: <?php echo json_encode(APP_PAGES); ?>,
    api: <?php echo json_encode(APP_API); ?>,
    login: <?php echo json_encode(page_url('login.php')); ?>
};
</script>
<script src="<?php echo htmlspecialchars(asset_url('js/app.js')); ?>"></script>
<script>
var BACKEND = window.APP_CONFIG.api;

function showMsg(msg, type) {
    var box = document.getElementById('msgBox');
    box.className = 'mt-4 alert ' + (type === 'error' ? 'alert-error' : 'alert-success');
    box.textContent = msg;
    box.classList.remove('hidden');
    App.toast(msg, type === 'error' ? 'error' : 'success');
    setTimeout(function () { box.classList.add('hidden'); }, 4000);
}

function sendOTP() {
    var email = document.getElementById('emailInput').value.trim();
    if (!email) { showMsg('Please enter your email address.', 'error'); return; }
    if (!email.includes('@')) { showMsg('Please enter a valid email.', 'error'); return; }

    var btn = document.getElementById('sendOTPBtn');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    fetch(BACKEND + '/send_otp.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email: email })
    })
    .then(function (r) { return r.json(); })
    .then(function (data) {
        if (data.success) {
            document.getElementById('stepEmail').classList.add('hidden');
            document.getElementById('stepOTP').classList.remove('hidden');
            document.getElementById('emailDisplay').textContent = email;
            showMsg('OTP sent! Check your email.', 'success');
        } else {
            showMsg(data.message || 'Failed to send OTP.', 'error');
        }
    })
    .catch(function () {
        showMsg('Connection error. Check your server.', 'error');
    })
    .finally(function () {
        btn.textContent = 'Send OTP Code';
        btn.disabled = false;
    });
}

function verifyOTP() {
    var email = document.getElementById('emailInput').value.trim();
    var otp = document.getElementById('otpInput').value.trim();
    if (!otp) { showMsg('Please enter the OTP code.', 'error'); return; }

    var btn = document.getElementById('verifyBtn');
    btn.textContent = 'Verifying...';
    btn.disabled = true;

    fetch(BACKEND + '/verify_otp.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email: email, otp: otp })
    })
    .then(function (r) { return r.json(); })
    .then(function (data) {
        if (data.success) {
            showMsg('Login successful! Redirecting...', 'success');
            localStorage.setItem('user', JSON.stringify(data.user || { email: email }));
            setTimeout(function () {
                window.location.href = <?php echo json_encode(page_url('dashboard.php')); ?>;
            }, 900);
        } else {
            showMsg(data.message || 'Invalid OTP. Try again.', 'error');
        }
    })
    .catch(function () {
        showMsg('Connection error. Check your server.', 'error');
    })
    .finally(function () {
        btn.textContent = 'Verify & Login';
        btn.disabled = false;
    });
}

function backToEmail() {
    document.getElementById('stepOTP').classList.add('hidden');
    document.getElementById('stepEmail').classList.remove('hidden');
    document.getElementById('otpInput').value = '';
}
</script>
</body>
</html>
