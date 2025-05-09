<?php
// fetch_contact_info.php
require_once '../php/connection.php';

header('Content-Type: application/json');

try {
    // Fetch contact info from database
    $stmt = $conn->prepare("SELECT ContactEmail, ContactTelephone FROM contact_info LIMIT 1");
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $data = $result->fetch_assoc();
        echo json_encode([
            'success' => true,
            'data' => [
                'email' => $data['ContactEmail'],
                'telephone' => $data['ContactTelephone']
            ]
        ]);
    } else {
        // Return empty values if no record exists
        echo json_encode([
            'success' => true,
            'data' => [
                'email' => '',
                'telephone' => ''
            ]
        ]);
    }
    
    $stmt->close();
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
} finally {
    $conn->close();
}
?>