<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

$host = '127.0.0.1';
$db   = 'bosnialine';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'msg' => 'Database connection failed.']);
    exit;
}

function jsonResponse($data) {
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function getJsonBody() {
    $body = file_get_contents('php://input');
    return $body ? json_decode($body, true) : [];
}

function sanitize($value) {
    return is_string($value) ? trim($value) : $value;
}

function sendError($msg, $code = 400) {
    http_response_code($code);
    jsonResponse(['ok' => false, 'msg' => $msg]);
}
