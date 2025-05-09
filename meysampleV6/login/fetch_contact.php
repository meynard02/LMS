<?php
header('Content-Type: application/json');

// Include your database connection file
require_once '../php/connection.php';

try {
    // Query to get contact info
    $stmt = $conn->prepare("SELECT ContactEmail, ContactTelephone FROM contact_info LIMIT 1");
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode([
            'success' => true,
            'email' => $row['ContactEmail'],
            'phone' => $row['ContactTelephone']
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'email' => null,
            'phone' => null
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
} finally {
    $conn->close();
}
?>