<?php
// admin/admin_operations.php
require_once '../php/connection.php';

header('Content-Type: application/json');

$action = $_POST['action'] ?? '';

try {
    switch ($action) {
        case 'update':
            $adminId = $_POST['adminId'];
            $email = $_POST['email'];
            $firstName = $_POST['firstName'];
            $lastName = $_POST['lastName'];
            
            $stmt = $conn->prepare("UPDATE admin SET AdminEmail=?, AdminFName=?, AdminLName=? WHERE AdminID=?");
            $stmt->bind_param("sssi", $email, $firstName, $lastName, $adminId);
            $stmt->execute();
            
            echo json_encode(['success' => true]);
            break;
            
        case 'toggleStatus':
            $adminId = $_POST['adminId'];
            $currentStatus = $_POST['currentStatus'];
            $newStatus = $currentStatus === 'Active' ? 'Inactive' : 'Active';
            
            $stmt = $conn->prepare("UPDATE admin SET Status=? WHERE AdminID=?");
            $stmt->bind_param("si", $newStatus, $adminId);
            $stmt->execute();
            
            echo json_encode(['success' => true, 'newStatus' => $newStatus]);
            break;
            
        case 'delete':
            $adminId = $_POST['adminId'];
            
            $stmt = $conn->prepare("DELETE FROM admin WHERE AdminID=?");
            $stmt->bind_param("i", $adminId);
            $stmt->execute();
            
            echo json_encode(['success' => true]);
            break;
            
        case 'add':
            $email = $_POST['email'];
            $firstName = $_POST['firstName'];
            $lastName = $_POST['lastName'];
            $username = $_POST['username'];
            $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
            
            $stmt = $conn->prepare("INSERT INTO admin (AdminEmail, AdminFName, AdminLName, AdminUsername, AdminPassword, Status) VALUES (?, ?, ?, ?, ?, 'active')");
            $stmt->bind_param("sssss", $email, $firstName, $lastName, $username, $password);
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