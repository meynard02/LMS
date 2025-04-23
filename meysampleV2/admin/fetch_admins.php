<?php
include '../php/connection.php';

$search = $_GET['search'] ?? '';

try {
    if (!empty($search)) {
        // Fetch single admin by ID
        $stmt = $conn->prepare("SELECT AdminID, AdminEmail, AdminFName, AdminLName, AdminUsername, Status FROM admin WHERE AdminID = ?");
        $stmt->bind_param("s", $search);
    } else {
        // Fetch all admins
        $stmt = $conn->prepare("SELECT AdminID, AdminEmail, AdminFName, AdminLName, AdminUsername, Status FROM admin");
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $admins = [];
    while ($row = $result->fetch_assoc()) {
        $admins[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $admins
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>