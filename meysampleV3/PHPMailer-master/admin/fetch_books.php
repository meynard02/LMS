<?php
require_once '../php/connection.php';

header('Content-Type: application/json');

$response = ['success' => false, 'data' => [], 'categories' => []];

try {
    // Fetch books with category information
    $result = $conn->query("
        SELECT b.*, bc.Book_Category 
        FROM book b
        LEFT JOIN book_categories bc ON b.Book_CategoryID = bc.Book_CategoryID
    ");
    
    if ($result) {
        $response['success'] = true;
        while ($row = $result->fetch_assoc()) {
            $response['data'][] = $row;
        }
    } else {
        throw new Exception("Database error fetching books: " . $conn->error);
    }
    
    // Fetch all categories
    $catResult = $conn->query("SELECT * FROM book_categories");
    if ($catResult) {
        while ($row = $catResult->fetch_assoc()) {
            $response['categories'][] = $row;
        }
    } else {
        throw new Exception("Database error fetching categories: " . $conn->error);
    }
} catch (Exception $e) {
    $response['error'] = $e->getMessage();
}

echo json_encode($response);
$conn->close();
?>