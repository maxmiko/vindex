<?php
$secret = 'vindex-deploy-2026';
$signature = isset($_SERVER['HTTP_X_HUB_SIGNATURE_256']) ? $_SERVER['HTTP_X_HUB_SIGNATURE_256'] : '';
$payload = file_get_contents('php://input');

if (!hash_equals('sha256=' . hash_hmac('sha256', $payload, $secret), $signature)) {
    http_response_code(403);
    die('Forbidden');
}

shell_exec('cd /home/omarketi/dev.omarketing.lv/vindex && git checkout -- . && git pull 2>&1');
echo 'OK';
