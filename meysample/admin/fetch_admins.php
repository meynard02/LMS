<?php
// admin/fetch_admins.php
require_once '../php/connection.php';

header('Content-Type: application/json');

$search = $_GET['search'] ?? '';

try {
    // Select only the fields we need for display
    $query = "SELECT AdminID, AdminEmail, AdminFName, AdminLName, Status FROM admin";
    
    if (!empty($search)) {
        $query .= " WHERE (AdminEmail LIKE ? OR AdminFName LIKE ? OR AdminLName LIKE ?)";
        $searchTerm = "%$search%";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sss", $searchTerm, $searchTerm, $searchTerm);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        $result = $conn->query($query);
    }
    
    $admins = [];
    while ($row = $result->fetch_assoc()) {
        $admins[] = $row;
    }
    
    echo json_encode(['success' => true, 'data' => $admins]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
?>