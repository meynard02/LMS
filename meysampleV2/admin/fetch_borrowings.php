<?php
require_once '../php/connection.php';

header('Content-Type: application/json');

$transactionId = isset($_GET['transactionId']) ? $_GET['transactionId'] : null;

if ($transactionId) {
    // Fetch single transaction
    $stmt = $conn->prepare("
        SELECT t.*, s.StatusDesc, u.FirstName, u.LastName, u.Email, b.Title 
        FROM transaction t
        JOIN status s ON t.statusID = s.statusID
        JOIN user u ON t.userID = u.userID
        JOIN book b ON t.accessionNo = b.accessionNo
        WHERE t.transactionID = ?
    ");
    $stmt->bind_param("i", $transactionId);
} else {
    // Fetch all transactions
    $stmt = $conn->prepare("
        SELECT t.*, s.StatusDesc, u.FirstName, u.LastName, u.Email, b.Title 
        FROM transaction t
        JOIN status s ON t.statusID = s.statusID
        JOIN user u ON t.userID = u.userID
        JOIN book b ON t.accessionNo = b.accessionNo
        WHERE t.deleteStatus = 1
        ORDER BY t.BorrowedDate DESC
    ");
}

$stmt->execute();
$result = $stmt->get_result();
$transactions = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode([
    'success' => true,
    'data' => $transactions
]);

$stmt->close();
$conn->close();
?>
