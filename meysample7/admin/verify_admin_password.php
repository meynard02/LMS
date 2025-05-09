<?php
header('Content-Type: application/json');
require_once '../php/connection.php';

$password = $_POST['password'] ?? '';

// Get the first admin's password hash
$query = "SELECT AdminPassword FROM admin ORDER BY AdminID ASC LIMIT 1";
$result = $conn->query($query);
if ($row = $result->fetch_assoc()) {
    $hash = $row['AdminPassword'];
    if (password_verify($password, $hash)) {
        echo json_encode(['success' => true]);
        exit;
    }
}
echo json_encode(['success' => false]); 