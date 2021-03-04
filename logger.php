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
    $hitId_desktop = [];
    $hitId_mobile = ["3DIIW4IV8P1V8BXGCEGFMDVL75S4IA"];

    
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
    } elseif (!isset($params['hitId']) || empty($params['hitId']) || ! in_array($params['hitId'], array_merge($hitId_desktop, $hitId_mobile))) {
        echo "Error: Please open the page via mTurk to receive a Secret Key";
        return false;
    } elseif (in_array($params['hitId'], $hitId_desktop)) {
        if (strpos($params['platform'], 'Windows') !== false) {
           return true;
        } elseif (strpos($params['platform'], 'X11') !== false || strpos($params['platform'], 'Wayland') !== false) {
           return true;
        } elseif (strpos($params['platform'], 'Mac') !== false && strpos($params['platform'], 'iPhone') === false && strpos($params['platform'], 'iPad') === false ) {
           return true;
        } elseif (strpos($params['platform'], 'OpenBSD') !== false) {
           return true;
        }
        echo "Error: You opened the Desktop study with a mobile system. Please switch to your Desktop to receive a Secret Key.";
        return false;

    } elseif (in_array($params['hitId'], $hitId_mobile)) {
        if (strpos($params['platform'], 'Windows') !== false) {
           echo "Error: You opened the mobile study with Windows(mobile/tablet is determinded by the Operating System). Please switch to your mobile device.";
           return false;
        } elseif (strpos($params['platform'], 'X11') !== false || strpos($params['platform'], 'Wayland') !== false) {
           echo "Error: You opened the mobile study with Linux. Please switch to your mobile device to receive a Secret Key.";
           return false;
        } elseif (strpos($params['platform'], 'Mac') !== false  && strpos($params['platform'], 'iPhone') === false && strpos($params['platform'], 'iPad') === false) {
           echo "Error: You opened the mobile study with Mac. Please switch to your mobile device to receive a Secret Key.";
           return false;
        } elseif (strpos($params['platform'], 'OpenBSD') !== false) {
           echo "Error: You opened the mobile study with OpenBSD. Please switch to your mobile device to receive a Secret Key.";
           return false;
        }
        return true;
   }
  return true;
}


function log_data($data = null) {
    if (!empty($data)) {
        $connection = pg_connect("host=localhost dbname=DATABASENAME user=DATABASEUSER password=DATABASEPASSWORD"); // not the actual password
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
            echo 'Here is your Secret Key: ' . $customToken;
        }
    }
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);
if(validate_data($data)) {
 log_data($data);
 } else {
 error_log(print_r($data, true));
}

?>
