<?php
include '../php/connection.php';

$search = $_GET['search'] ?? '';
$status = $_GET['status'] ?? 'all';

try {
    $query = "SELECT AdminID, AdminEmail, AdminFName, AdminLName, AdminUsername, Status FROM admin";
    $params = [];
    $types = "";
    
    $conditions = [];
    
    if (!empty($search)) {
        $conditions[] = "(AdminEmail LIKE ? OR AdminFName LIKE ? OR AdminLName LIKE ?)";
        $searchTerm = "%$search%";
        $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm]);
        $types .= "sss";
    }
    
    if ($status !== 'all') {
        $conditions[] = "Status = ?";
        $params[] = $status;
        $types .= "s";
    }
    
    if (!empty($conditions)) {
        $query .= " WHERE " . implode(" AND ", $conditions);
    }
    
    $stmt = $conn->prepare($query);
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
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