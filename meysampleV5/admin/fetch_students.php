<?php
require_once '../php/connection.php';

header('Content-Type: application/json');

$search = $_GET['search'] ?? '';
$status = $_GET['status'] ?? 'all';

try {
    // Only select the fields we need for display
    $query = "SELECT Email, FirstName, LastName, Status FROM user ";
    $params = [];
    $types = "";
    
    $conditions = [];
    
    if (!empty($search)) {
        $conditions[] = "(Email LIKE ? OR FirstName LIKE ? OR LastName LIKE ?)";
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
    
    $students = [];
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }
    
    echo json_encode(['success' => true, 'data' => $students]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
?>
