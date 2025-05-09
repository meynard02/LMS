<?php
session_start();
include '../php/connection.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

$email = $_SESSION['email'] ?? '';

// Fetch notifications for this user with proper joining
$stmt = $conn->prepare("
    SELECT n.ID as notif_id, n.DueDate, n.CustomMessage, n.is_read,
           nd.Notif_status, nd.Notif_title 
    FROM notification n
    JOIN notification_desc nd ON n.ID = nd.ID
    WHERE n.Email = ?
    ORDER BY n.DueDate DESC
");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

$notifications = [];
while ($row = $result->fetch_assoc()) {
    $notifications[] = [
        'id' => $row['notif_id'],
        'status' => $row['Notif_status'],
        'title' => $row['Notif_title'],
        'message' => $row['CustomMessage'],
        'date' => $row['DueDate'],
        'is_read' => (bool)$row['is_read']
    ];
}

echo json_encode(['success' => true, 'notifications' => $notifications]);
?>