<?php
session_start();
include '../php/connection.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$notificationId = $data['id'] ?? 0;

// Update the notification as read
$stmt = $conn->prepare("UPDATE notification SET is_read = 1 WHERE ID = ? AND Email = ?");
$stmt->bind_param("is", $notificationId, $_SESSION['email']);
$stmt->execute();

echo json_encode(['success' => $stmt->affected_rows > 0]);
?>