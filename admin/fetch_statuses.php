<?php
require_once '../php/connection.php';

header('Content-Type: application/json');

try {
    $stmt = $conn->prepare("SELECT * FROM status ORDER BY statusID");
    $stmt->execute();
    $result = $stmt->get_result();
    $statuses = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $statuses
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>