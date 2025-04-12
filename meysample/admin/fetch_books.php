<?php
require_once '../php/connection.php';

header('Content-Type: application/json');

$response = ['success' => false, 'data' => []];

try {
    $result = $conn->query("SELECT * FROM book");
    
    if ($result) {
        $response['success'] = true;
        while ($row = $result->fetch_assoc()) {
            $response['data'][] = $row;
        }
    } else {
        throw new Exception("Database error: " . $conn->error);
    }
} catch (Exception $e) {
    $response['error'] = $e->getMessage();
}

echo json_encode($response);
$conn->close();
?>