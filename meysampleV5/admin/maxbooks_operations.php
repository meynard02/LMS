<?php
// maxbooks_operations.php
require_once '../php/connection.php';

header('Content-Type: application/json');

$action = $_POST['action'] ?? '';

try {
    switch ($action) {
        case 'save':
            $maxBooks = $_POST['maxBooks'] ?? '';
            
            // Validate input
            if (!is_numeric($maxBooks)) {
                throw new Exception('Please enter a valid number');
            }
            
            $maxBooks = (int)$maxBooks;
            if ($maxBooks < 1 || $maxBooks > 10) {
                throw new Exception('Maximum books must be between 1-10');
            }
            
            // Check if record already exists
            $checkStmt = $conn->prepare("SELECT COUNT(*) FROM max_books");
            $checkStmt->execute();
            $checkStmt->bind_result($count);
            $checkStmt->fetch();
            $checkStmt->close();
            
            if ($count > 0) {
                // Update existing record
                $stmt = $conn->prepare("UPDATE max_books SET MaxNumber = ? WHERE MaxID = 1");
            } else {
                // Insert new record
                $stmt = $conn->prepare("INSERT INTO max_books (MaxNumber) VALUES (?)");
            }
            
            $stmt->bind_param("i", $maxBooks);
            $stmt->execute();
            $stmt->close();
            
            echo json_encode(['success' => true]);
            break;
            
        case 'fetch':
            $stmt = $conn->prepare("SELECT MaxNumber FROM max_books LIMIT 1");
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $data = $result->fetch_assoc();
                echo json_encode([
                    'success' => true,
                    'maxBooks' => $data['MaxNumber']
                ]);
            } else {
                // Return default value if no record exists
                echo json_encode([
                    'success' => true,
                    'maxBooks' => 5 // Default value
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