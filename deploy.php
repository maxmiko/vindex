<?php
/**
 * GitHub Webhook → cPanel Auto-Deploy
 *
 * GitHub sends POST to this URL on every push.
 * This script pulls latest code and copies files to deploy path.
 *
 * Setup: create /home/omarketi/.deploy_secret with your webhook secret.
 *   echo 'YOUR_SECRET_HERE' > /home/omarketi/.deploy_secret
 *   chmod 600 /home/omarketi/.deploy_secret
 */

// Read secret from file outside webroot
$secretFile = '/home/omarketi/.deploy_secret';
if (!file_exists($secretFile)) {
    http_response_code(500);
    die('Config error');
}
$secret = trim(file_get_contents($secretFile));

// Require signature header — reject if missing
$signature = isset($_SERVER['HTTP_X_HUB_SIGNATURE_256']) ? $_SERVER['HTTP_X_HUB_SIGNATURE_256'] : '';
$payload = file_get_contents('php://input');

if (!$signature) {
    http_response_code(403);
    die('Forbidden');
}

// Verify GitHub HMAC signature
$hash = 'sha256=' . hash_hmac('sha256', $payload, $secret);
if (!hash_equals($hash, $signature)) {
    http_response_code(403);
    die('Forbidden');
}

// Only process push events
$event = isset($_SERVER['HTTP_X_GITHUB_EVENT']) ? $_SERVER['HTTP_X_GITHUB_EVENT'] : '';
if ($event !== 'push') {
    http_response_code(200);
    die('OK');
}

// Paths (all hardcoded, no user input)
$repoPath = '/home/omarketi/repositories/vindex_2026';
$deployPath = '/home/omarketi/dev.omarketing.lv/vindex';

// Pull latest from GitHub
$pullOutput = array();
$pullReturn = 0;
chdir($repoPath);
exec('/usr/local/bin/git pull origin main 2>&1', $pullOutput, $pullReturn);

// Deploy: create dir and copy files
$dirs = array('css', 'js', 'en', 'pakalpojumi', 'birojs', 'kontakti');

if (!is_dir($deployPath)) {
    mkdir($deployPath, 0755, true);
}

foreach ($dirs as $dir) {
    $src = $repoPath . '/' . $dir;
    if (is_dir($src)) {
        exec('/bin/cp -R ' . escapeshellarg($src) . ' ' . escapeshellarg($deployPath) . '/');
    }
}

$filesToCopy = array('index.html', '.htaccess', 'deploy.php');
foreach ($filesToCopy as $file) {
    $src = $repoPath . '/' . $file;
    if (file_exists($src)) {
        copy($src, $deployPath . '/' . $file);
    }
}

// Log result
$log = date('Y-m-d H:i:s') . " - Deploy " . ($pullReturn === 0 ? 'OK' : 'FAIL') . "\n";
$log .= implode("\n", $pullOutput) . "\n---\n";
file_put_contents($repoPath . '/deploy.log', $log, FILE_APPEND);

http_response_code(200);
echo 'OK';
