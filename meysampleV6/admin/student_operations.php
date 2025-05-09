<?php
require_once '../php/connection.php';

header('Content-Type: application/json');

$action = $_POST['action'] ?? '';
$userType = $_POST['userType'] ?? '';

try {
    switch ($action) {
        case 'update':
            $email = $_POST['email'];
            $newEmail = $_POST['newEmail'];
            $firstName = $_POST['firstName'];
            $lastName = $_POST['lastName'];
            
            $stmt = $conn->prepare("UPDATE user SET Email=?, FirstName=?, LastName=? WHERE Email=?");
            $stmt->bind_param("ssss", $newEmail, $firstName, $lastName, $email);
            $stmt->execute();
            
            echo json_encode(['success' => true]);
            break;
            
        case 'toggleStatus':
            $email = $_POST['email'];
            $currentStatus = $_POST['currentStatus'];
            $newStatus = $currentStatus === 'Active' ? 'Suspended' : 'Active';
            
            $stmt = $conn->prepare("UPDATE user SET Status=? WHERE Email=?");
            $stmt->bind_param("ss", $newStatus, $email);
            $stmt->execute();
            
            echo json_encode(['success' => true, 'newStatus' => $newStatus]);
            break;
            
        case 'delete':
            $email = $_POST['email'];
            
            $stmt = $conn->prepare("DELETE FROM user WHERE Email=?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            
            echo json_encode(['success' => true]);
            break;
            
        default:
            echo json_encode(['success' => false, 'error' => 'Invalid action']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
?>