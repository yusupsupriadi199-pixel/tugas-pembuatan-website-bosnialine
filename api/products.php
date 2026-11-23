<?php
require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? 'list';
$cat = $_GET['cat'] ?? null;
$q = $_GET['q'] ?? null;

function decodeImages(array $row) {
    if (isset($row['images']) && is_string($row['images'])) {
        $row['images'] = json_decode($row['images'], true) ?: [];
    }
    return $row;
}

switch ($action) {
    case 'detail':
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'msg' => 'ID produk tidak valid']);
            exit;
        }
        $stmt = $pdo->prepare('SELECT * FROM products WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $product = $stmt->fetch();
        if (!$product) {
            http_response_code(404);
            echo json_encode(['ok' => false, 'msg' => 'Produk tidak ditemukan']);
            exit;
        }
        echo json_encode(['ok' => true, 'product' => decodeImages($product)], JSON_UNESCAPED_UNICODE);
        break;

    case 'list':
    default:
        $sql = 'SELECT * FROM products';
        $conditions = [];
        $params = [];
        if ($cat && $cat !== 'semua') {
            $conditions[] = 'category = ?';
            $params[] = $cat;
        }
        if ($q) {
            $conditions[] = '(name LIKE ? OR category LIKE ? OR specs LIKE ? OR description LIKE ?)';
            $search = '%' . $q . '%';
            array_push($params, $search, $search, $search, $search);
        }
        if ($conditions) {
            $sql .= ' WHERE ' . implode(' AND ', $conditions);
        }
        $sql .= ' ORDER BY sold DESC, id ASC';

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $products = array_map('decodeImages', $stmt->fetchAll());
        echo json_encode(['ok' => true, 'products' => $products], JSON_UNESCAPED_UNICODE);
        break;
}
