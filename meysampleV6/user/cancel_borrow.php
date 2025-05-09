<?php
session_start();
include '../php/connection.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['accessionNo'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit();
}

try {
    $conn->begin_transaction();
    
    // 1. Find the pending transaction
    $stmt = $conn->prepare("SELECT TransactionID FROM transaction 
                          WHERE UserID = ? AND AccessionNo = ? AND StatusID = 3");
    $stmt->bind_param("is", $_SESSION['user_id'], $data['accessionNo']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception("No pending borrow request found");
    }
    
    $transaction = $result->fetch_assoc();
    $transactionId = $transaction['TransactionID'];
    
    // 2. Delete the transaction
    $stmt = $conn->prepare("DELETE FROM transaction 
                          WHERE TransactionID = ?");
    $stmt->bind_param("i", $transactionId);
    $stmt->execute();
    
    // 3. Update book availability
    $stmt = $conn->prepare("UPDATE book SET Availability = 'Available' 
                          WHERE AccessionNo = ?");
    $stmt->bind_param("s", $data['accessionNo']);
    $stmt->execute();
    
    // 4. Log the cancellation (status 4 = Cancelled)
    $stmt = $conn->prepare("INSERT INTO transaction_log (TransactionID, UserID, StatusID, AccessionNo) 
                          VALUES (?, ?, 4, ?)");
    $stmt->bind_param("iis", $transactionId, $_SESSION['user_id'], $data['accessionNo']);
    $stmt->execute();
    
    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Borrow request cancelled']);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Error cancelling request: ' . $e->getMessage()]);
}
?>