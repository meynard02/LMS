<?php
session_start();
include '../php/connection.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

// Mark all notifications as read for this user
$stmt = $conn->prepare("UPDATE notification SET is_read = 1 WHERE Email = ?");
$stmt->bind_param("s", $_SESSION['email']);
$stmt->execute();

echo json_encode(['success' => true, 'count' => $stmt->affected_rows]);
?>