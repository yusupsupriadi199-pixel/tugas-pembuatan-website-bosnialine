<?php
require_once __DIR__ . '/config.php';

$action = $_REQUEST['action'] ?? '';

function createOrder(PDO $pdo, array $payload) {
    $customer = $payload['customer'] ?? [];
    $shipping = $payload['shipping'] ?? [];
    $items = $payload['items'] ?? [];
    $payment = $payload['payment'] ?? null;
    $total = $payload['total'] ?? 0;
    $subtotal = $payload['subtotal'] ?? 0;
    $totalWeight = $payload['totalWeight'] ?? 0;
    $userId = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;

    if (!$customer['name'] || !$customer['phone'] || !$customer['email'] || !$customer['address'] || !$shipping['method'] || !$payment || !$items) {
        return ['ok' => false, 'msg' => 'Data pesanan tidak lengkap.'];
    }

    $orderId = 'BL-' . time() . '-' . rand(1000, 9999);
    $invoice = $payload['invoice'] ?? ('INV-' . date('Ymd') . '-' . rand(1000, 9999));
    $status = $payment === 'cod' ? 'processing' : 'pending';

    try {
        $pdo->beginTransaction();
        $stmt = $pdo->prepare('INSERT INTO orders (order_id, invoice_number, user_id, customer_name, customer_email, customer_phone, address, city, province, zip, note, shipping_method, shipping_label, shipping_eta, shipping_cost, payment_method, subtotal, total_amount, total_weight, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())');
        $stmt->execute([
            $orderId,
            $invoice,
            $userId,
            $customer['name'],
            $customer['email'],
            $customer['phone'],
            $customer['address'],
            $customer['city'],
            $customer['province'],
            $customer['zip'],
            $customer['note'] ?? '',
            $shipping['method'],
            $shipping['label'] ?? '',
            $shipping['eta'] ?? '',
            $shipping['cost'] ?? 0,
            $payment,
            $subtotal,
            $total,
            $totalWeight,
            $status
        ]);

        $orderDbId = $pdo->lastInsertId();
        $itemStmt = $pdo->prepare('INSERT INTO order_items (order_id, product_id, product_name, qty, price, weight) VALUES (?, ?, ?, ?, ?, ?)');
        foreach ($items as $item) {
            $itemStmt->execute([
                $orderId,
                $item['id'] ?? null,
                $item['name'] ?? '',
                $item['qty'] ?? 1,
                $item['price'] ?? 0,
                $item['weight'] ?? 0
            ]);
        }

        $pdo->commit();
        return ['ok' => true, 'order' => ['id' => $orderId, 'invoice' => $invoice, 'status' => $status, 'createdAt' => date('Y-m-d H:i:s')]];
    } catch (Exception $e) {
        $pdo->rollBack();
        return ['ok' => false, 'msg' => 'Gagal menyimpan pesanan: ' . $e->getMessage()];
    }
}

function sendOrderList(PDO $pdo) {
    if (empty($_SESSION['user_id'])) {
        return ['ok' => false, 'msg' => 'Belum login'];
    }
    $userId = (int)$_SESSION['user_id'];
    $stmt = $pdo->prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC');
    $stmt->execute([$userId]);
    $orders = $stmt->fetchAll();

    $itemStmt = $pdo->prepare('SELECT * FROM order_items WHERE order_id = ?');
    foreach ($orders as &$order) {
        $order['items'] = [];
        $itemStmt->execute([$order['order_id']]);
        $order['items'] = $itemStmt->fetchAll();
    }
    return ['ok' => true, 'orders' => $orders];
}

switch ($action) {
    case 'create':
        $body = getJsonBody();
        $result = createOrder($pdo, $body);
        jsonResponse($result);
        break;

    case 'list':
        $result = sendOrderList($pdo);
        jsonResponse($result);
        break;

    default:
        sendError('Aksi tidak dikenali pada orders.php');
}
