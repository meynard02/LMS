<?php
require_once '../php/connection.php';

header('Content-Type: application/json');
ob_start();

$response = ['success' => false, 'error' => null];

try {
    // Verify request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Invalid request method");
    }

    $action = $_POST['action'] ?? '';
    
    if ($action === 'add') {
        // Validate required fields
        if (empty($_POST['categoryName'])) {
            throw new Exception("Category name is required");
        }

        $categoryName = $conn->real_escape_string($_POST['categoryName']);
        
        // Check if category already exists
        $check = $conn->prepare("SELECT Book_CategoryID FROM book_categories WHERE Book_Category=?");
        $check->bind_param("s", $categoryName);
        $check->execute();
        $check->store_result();
        
        if ($check->num_rows > 0) {
            throw new Exception("Category '$categoryName' already exists");
        }
        $check->close();

        // Insert new category with created_at timestamp
        $stmt = $conn->prepare("INSERT INTO book_categories (Book_Category, created_at) VALUES (?, NOW())");
        $stmt->bind_param("s", $categoryName);
        
        if (!$stmt->execute()) {
            throw new Exception("Database error: ".$stmt->error);
        }
        
        $response['success'] = true;
        $response['categoryId'] = $conn->insert_id;
        $stmt->close();
    } else {
        throw new Exception("Invalid action");
    }
} catch (Exception $e) {
    $response['error'] = $e->getMessage();
    error_log("Category operation error: ".$e->getMessage());
}

ob_end_clean();
echo json_encode($response);
$conn->close();
?>