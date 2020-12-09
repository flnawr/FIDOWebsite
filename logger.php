<?php

function throw_error($code = 404) {
    http_response_code($code);
    die();
}

function getRandomString($length) {
    $alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $generated = '';
    for ($charPos = 0; $i < $length; $charPos++) {
        $char = rand(0, strlen($alphabet) - 1);
        $generated .= $alphabet[$char];
    }
    return $generated;
}

function validate_data($params = null) {
    $secret = 'uXEOtrrFboy4BLaQ9c12a9wCNac8EfhU';
    
    if (empty($params)) {
        throw_error(400);
    } elseif (!isset($params['secret']) || empty($params['secret']) || $params['secret'] !== $secret) {
        throw_error(403);
    } elseif (!isset($params['worker_id']) || empty($params['worker_id'])) {
        throw_error(400);
    } elseif (!isset($params['is_fingerprint_clicked']) || empty($params['is_fingerprint_clicked'])) {
        throw_error(400);
    } elseif (!isset($params['is_successful_fingerprint']) || empty($params['is_successful_fingerprint'])) {
        throw_error(400);
    } elseif (!isset($params['is_securityDevice_clicked']) || empty($params['is_securityDevice_clicked'])) {
        throw_error(400);
    } elseif (!isset($params['is_successful_securitydevice']) || empty($params['is_successful_securitydevice'])) {
        throw_error(400);
    } elseif (!isset($params['platform']) || empty($params['platform'])) {
        throw_error(400);
    }
}

function log_data($data = null) {
    if (!empty($data)) {
        $connection = pg_connect("host=localhost dbname=DATABASENAME user=DATABASEUSER password=DATABASEPASSWORD");
        if ($connection) {
            $query = 'INSERT INTO data (workerID, isFingerprintClicked, isFingerprintSuccessful, isSecurityDeviceClicked, isSecurityDeviceSuccessful, platform, token) VALUES ($1, $2, $3, $4, $5, $6, $7);';
            $statement = pg_prepare($connection, "newEntry", $query);
            $customToken = getRandomString(10);
            $result = pg_execute(
                $connection, 
                "newEntry", 
                [
                    $data['worker_id'],
                    $data['is_fingerprint_clicked'],
                    $data['is_successful_fingerprint'],
                    $data['is_securityDevice_clicked'],
                    $data['is_successful_securitydevice'],
                    $data['platform'],
                    $customToken
                ]
            );
            pg_close($connection);
            echo 'Thank you for participating. Have a cookie <code>' . $customToken . '</code>';
        }
    }
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);
validate_data($data);
log_data($data);

?>