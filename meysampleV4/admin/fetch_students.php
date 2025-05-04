<?php
require_once '../php/connection.php';

header('Content-Type: application/json');

$search = $_GET['search'] ?? '';

try {
    // Only select the fields we need for display
    $query = "SELECT Email, FirstName, LastName, Status FROM user ";
    
    if (!empty($search)) {
        $query .= " WHERE (Email LIKE ? OR FirstName LIKE ? OR LastName LIKE ?)";
        $searchTerm = "%$search%";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sss", $searchTerm, $searchTerm, $searchTerm);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        $result = $conn->query($query);
    }
    
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