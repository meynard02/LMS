<?php
session_start();
header('Content-Type: application/json');
include '../php/connection.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

// Get input data
$data = json_decode(file_get_contents('php://input'), true);
$accessionNo = $data['accessionNo'] ?? null;
$dueDate = $data['dueDate'] ?? null;

if (!$accessionNo || !$dueDate) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit();
}

try {
    // Start transaction
    $conn->begin_transaction();
    
    // 1. Check if book is available
    $checkStmt = $conn->prepare("SELECT Availability FROM book WHERE AccessionNo = ? FOR UPDATE");
    $checkStmt->bind_param("i", $accessionNo);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Book not found']);
        exit();
    }
    
    $book = $result->fetch_assoc();
    if ($book['Availability'] !== 'Available') {
        echo json_encode(['success' => false, 'message' => 'Book is not available']);
        exit();
    }
    
    // 2. Create transaction log (status 3 = Pending based on your DB)
    $transStmt = $conn->prepare("INSERT INTO transaction_log 
        (UserID, AccessionNo, StatusID, DueDate) 
        VALUES (?, ?, 3, ?)");
    $transStmt->bind_param("iis", $_SESSION['user_id'], $accessionNo, $dueDate);
    $transStmt->execute();
    
    // 3. Update book availability
    $updateStmt = $conn->prepare("UPDATE book SET Availability = 'Borrowed' WHERE AccessionNo = ?");
    $updateStmt->bind_param("i", $accessionNo);
    $updateStmt->execute();
    
    // Commit transaction
    $conn->commit();
    
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Database error']);
}