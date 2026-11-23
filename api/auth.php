<?php
require_once __DIR__ . '/config.php';

$action = $_REQUEST['action'] ?? '';

function hidePassword(array $user) {
    unset($user['password']);
    if (isset($user['addresses']) && is_string($user['addresses'])) {
        $user['addresses'] = json_decode($user['addresses'], true) ?: [];
    }
    return $user;
}

function getUserByEmail(PDO $pdo, string $email) {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    return $stmt->fetch();
}

function getUserById(PDO $pdo, int $id) {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    return $stmt->fetch();
}

switch ($action) {
    case 'register':
        $body = getJsonBody();
        $name = sanitize($body['name'] ?? '');
        $email = filter_var($body['email'] ?? '', FILTER_VALIDATE_EMAIL);
        $phone = sanitize($body['phone'] ?? '');
        $password = $body['password'] ?? '';

        if (!$name || !$email || !$phone || !$password) {
            sendError('Semua kolom harus diisi.');
        }
        if (strlen($password) < 6) {
            sendError('Password minimal 6 karakter.');
        }
        if (getUserByEmail($pdo, $email)) {
            sendError('Email sudah terdaftar.');
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare('INSERT INTO users (name, email, phone, password, addresses, created_at) VALUES (?, ?, ?, ?, ?, NOW())');
        $stmt->execute([$name, $email, $phone, $hash, json_encode([])]);

        $userId = (int)$pdo->lastInsertId();
        $_SESSION['user_id'] = $userId;

        $user = getUserById($pdo, $userId);
        jsonResponse(['ok' => true, 'user' => hidePassword($user)]);
        break;

    case 'login':
        $body = getJsonBody();
        $email = filter_var($body['email'] ?? '', FILTER_VALIDATE_EMAIL);
        $password = $body['password'] ?? '';

        if (!$email || !$password) {
            sendError('Email dan password harus diisi.');
        }

        $user = getUserByEmail($pdo, $email);
        if (!$user || !password_verify($password, $user['password'])) {
            sendError('Email atau password salah.');
        }

        $_SESSION['user_id'] = (int)$user['id'];
        jsonResponse(['ok' => true, 'user' => hidePassword($user)]);
        break;

    case 'logout':
        unset($_SESSION['user_id']);
        session_destroy();
        jsonResponse(['ok' => true]);
        break;

    case 'current':
        if (empty($_SESSION['user_id'])) {
            jsonResponse(['ok' => false, 'msg' => 'Belum login']);
        }
        $user = getUserById($pdo, (int)$_SESSION['user_id']);
        if (!$user) {
            sendError('User tidak ditemukan.', 404);
        }
        jsonResponse(['ok' => true, 'user' => hidePassword($user)]);
        break;

    default:
        sendError('Aksi tidak dikenali.', 400);
        break;
}
