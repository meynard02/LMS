<?php
require_once '../php/connection.php';

header('Content-Type: application/json');

$search = isset($_GET['search']) ? $_GET['search'] : '';
$status = isset($_GET['status']) ? $_GET['status'] : 'all';

try {
    // Only select the fields we need for display
    $query = "SELECT Email, FirstName, LastName, Status FROM user WHERE 1=1";
    $params = [];
    $types = "";
    
    if (!empty($search)) {
        $query .= " AND (Email LIKE ? OR FirstName LIKE ? OR LastName LIKE ?)";
        $searchTerm = "%$search%";
        $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm]);
        $types .= "sss";
    }
    
    if ($status !== 'all') {
        $query .= " AND Status = ?";
        $params[] = $status;
        $types .= "s";
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