<?php
// contact_operations.php
require_once '../php/connection.php';

header('Content-Type: application/json');

$action = $_POST['action'] ?? '';

try {
    switch ($action) {
        case 'save':
            $email = $_POST['email'] ?? '';
            $telephone = $_POST['telephone'] ?? '';
            
            // Validate inputs
            if (empty($email) || empty($telephone)) {
                throw new Exception('All fields are required');
            }
            
            // Check if contact info already exists
            $checkStmt = $conn->prepare("SELECT COUNT(*) FROM contact_info");
            $checkStmt->execute();
            $checkStmt->bind_result($count);
            $checkStmt->fetch();
            $checkStmt->close();
            
            if ($count > 0) {
                // Update existing record
                $stmt = $conn->prepare("UPDATE contact_info SET ContactEmail = ?, ContactTelephone = ?");
                $stmt->bind_param("ss", $email, $telephone);
            } else {
                // Insert new record
                $stmt = $conn->prepare("INSERT INTO contact_info (ContactEmail, ContactTelephone) VALUES (?, ?)");
                $stmt->bind_param("ss", $email, $telephone);
            }
            
            $stmt->execute();
            $stmt->close();
            
            echo json_encode(['success' => true]);
            break;
            
        case 'fetch':
            $stmt = $conn->prepare("SELECT ContactEmail, ContactTelephone FROM contact_info LIMIT 1");
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $data = $result->fetch_assoc();
                echo json_encode([
                    'success' => true,
                    'data' => $data
                ]);
            } else {
                echo json_encode([
                    'success' => true,
                    'data' => [
                        'ContactEmail' => '',
                        'ContactTelephone' => ''
                    ]
                ]);
            }
            $stmt->close();
            break;
            
        default:
            echo json_encode([
                'success' => false,
                'error' => 'Invalid action'
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