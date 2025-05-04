<?php
session_start();
include '../php/connection.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (empty($data['accessionNo']) || empty($data['userId']) || empty($data['borrowDate']) || empty($data['dueDate'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data']);
    exit();
}

try {
    // Start transaction
    $conn->begin_transaction();
    
    // 1. Check if book exists and is available
    $stmt = $conn->prepare("SELECT Availability FROM book WHERE AccessionNo = ?");
    $stmt->bind_param("s", $data['accessionNo']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Book not found']);
        exit();
    }
    
    $book = $result->fetch_assoc();
    if ($book['Availability'] !== 'Available') {
        echo json_encode(['success' => false, 'message' => 'Book is not available for borrowing']);
        exit();
    }
    
    // 2. Insert into transaction table
    $stmt = $conn->prepare("INSERT INTO transaction (UserID, AccessionNo, StatusID, BorrowedDate, DueDate) 
                          VALUES (?, ?, 3, ?, ?)");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    $stmt->bind_param("isss", $data['userId'], $data['accessionNo'], $data['borrowDate'], $data['dueDate']);
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    $transactionId = $conn->insert_id;
    
    // 3. Update book availability
    $stmt = $conn->prepare("UPDATE book SET Availability = 'Checked Out' WHERE AccessionNo = ?");
    $stmt->bind_param("s", $data['accessionNo']);
    if (!$stmt->execute()) {
        throw new Exception("Update book failed: " . $stmt->error);
    }
    
    // 4. Insert into transaction log
    $stmt = $conn->prepare("INSERT INTO transaction_log (TransactionID, UserID, StatusID, AccessionNo) 
                          VALUES (?, ?, 3, ?)");
    $stmt->bind_param("iis", $transactionId, $data['userId'], $data['accessionNo']);
    if (!$stmt->execute()) {
        throw new Exception("Log insert failed: " . $stmt->error);
    }
    
    // Commit transaction
    $conn->commit();
    
    echo json_encode(['success' => true, 'message' => 'Book borrowed successfully']);
} catch (Exception $e) {
    // Rollback on error
    $conn->rollback();
    error_log("Borrow Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>