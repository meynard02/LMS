<?php
session_start();
include '../php/connection.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['transactionId']) || empty($data['accessionNo'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit();
}

try {
    $conn->begin_transaction();
    
    // 1. Update transaction status and return date
    $stmt = $conn->prepare("UPDATE transaction 
                          SET StatusID = 1, ReturnDate = CURDATE() 
                          WHERE TransactionID = ? AND UserID = ?");
    $stmt->bind_param("ii", $data['transactionId'], $_SESSION['user_id']);
    $stmt->execute();
    
    if ($stmt->affected_rows === 0) {
        throw new Exception("No transaction updated");
    }
    
    // 2. Update book availability
    $stmt = $conn->prepare("UPDATE book SET Availability = 'Available' WHERE AccessionNo = ?");
    $stmt->bind_param("s", $data['accessionNo']);
    $stmt->execute();
    
    // 3. Log the return
    $stmt = $conn->prepare("INSERT INTO transaction_log (TransactionID, UserID, StatusID, AccessionNo) 
                          VALUES (?, ?, 1, ?)");
    $stmt->bind_param("iis", $data['transactionId'], $_SESSION['user_id'], $data['accessionNo']);
    $stmt->execute();
    
    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Book returned successfully']);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Error returning book: ' . $e->getMessage()]);
}
?>