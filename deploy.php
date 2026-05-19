<?php
/**
 * GitHub Webhook → cPanel Auto-Deploy
 *
 * GitHub sends POST to this URL on every push.
 * This script pulls latest code and copies files to deploy path.
 */

// Secret token - change this to something unique
$secret = 'vindex-deploy-2026';

// Verify GitHub signature
$signature = isset($_SERVER['HTTP_X_HUB_SIGNATURE_256']) ? $_SERVER['HTTP_X_HUB_SIGNATURE_256'] : '';
$payload = file_get_contents('php://input');

if ($signature) {
    $hash = 'sha256=' . hash_hmac('sha256', $payload, $secret);
    if (!hash_equals($hash, $signature)) {
        http_response_code(403);
        die('Invalid signature');
    }
}

// Only process push events
$event = isset($_SERVER['HTTP_X_GITHUB_EVENT']) ? $_SERVER['HTTP_X_GITHUB_EVENT'] : 'push';
if ($event !== 'push') {
    echo 'Ignored: ' . $event;
    exit;
}

// Paths (no user input used in commands - all hardcoded)
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

$filesToCopy = array('index.html', '.htaccess');
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
echo 'Deployed: ' . date('Y-m-d H:i:s');
