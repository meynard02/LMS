<?php
session_start();
include '../php/connection.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

$userId = $_SESSION['user_id'];

try {
    // Get all transactions for this user
    $query = "
        SELECT 
            t.TransactionID,
            b.Title,
            b.Author,
            b.Photo,
            s.StatusDesc,
            t.BorrowedDate,
            t.DueDate,
            t.ReturnDate,
            b.AccessionNo
        FROM transaction t
        JOIN book b ON t.AccessionNo = b.AccessionNo
        JOIN status s ON t.StatusID = s.StatusID
        WHERE t.UserID = ?
        ORDER BY t.BorrowedDate DESC
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $transactions = [];
    while ($row = $result->fetch_assoc()) {
        $transactions[] = [
            'id' => $row['TransactionID'],
            'title' => $row['Title'],
            'author' => $row['Author'],
            'cover' => $row['Photo'],
            'status' => $row['StatusDesc'],
            'borrowedDate' => $row['BorrowedDate'],
            'dueDate' => $row['DueDate'],
            'returnDate' => $row['ReturnDate'],
            'accessionNo' => $row['AccessionNo'],
            'isOverdue' => $row['ReturnDate'] ? 
                (strtotime($row['ReturnDate']) > strtotime($row['DueDate'])) : 
                (strtotime(date('Y-m-d')) > strtotime($row['DueDate']))
        ];
    }
    
    echo json_encode(['success' => true, 'transactions' => $transactions]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>