<?php
require_once '../php/connection.php';

header('Content-Type: application/json');

$status = isset($_GET['status']) ? $_GET['status'] : null;
$transactionId = isset($_GET['transactionId']) ? $_GET['transactionId'] : null;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;

try {
    $conn->begin_transaction();

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
        // Build the base query
        $query = "
            SELECT t.*, s.StatusDesc, u.FirstName, u.LastName, u.Email, b.Title 
            FROM transaction t
            JOIN status s ON t.statusID = s.statusID
            JOIN user u ON t.userID = u.userID
            JOIN book b ON t.accessionNo = b.accessionNo
            WHERE t.deleteStatus = 1
        ";

        // Add status filter if provided
        if ($status) {
            if ($status === 'Overdue') {
                $query .= " AND s.StatusDesc = 'Approved' AND t.DueDate < CURDATE()";
            } else {
                $query .= " AND s.StatusDesc = ?";
            }
        }

        $query .= " ORDER BY t.BorrowedDate DESC";

        // Add limit if provided
        if ($limit) {
            $query .= " LIMIT ?";
        }

        $stmt = $conn->prepare($query);

        // Bind parameters based on what's provided
        if ($status && $status !== 'Overdue') {
            if ($limit) {
                $stmt->bind_param("si", $status, $limit);
            } else {
                $stmt->bind_param("s", $status);
            }
        } else if ($limit) {
            $stmt->bind_param("i", $limit);
        }
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $transactions = $result->fetch_all(MYSQLI_ASSOC);

    // For overdue books, we need to update their status if they're not already marked as overdue
    if ($status === 'Overdue') {
        $updateStmt = $conn->prepare("
            UPDATE transaction t
            JOIN status s ON s.StatusDesc = 'Overdue'
            SET t.statusID = s.statusID
            WHERE t.DueDate < CURDATE() 
            AND t.statusID != s.statusID
            AND t.deleteStatus = 1
        ");
        $updateStmt->execute();
        $updateStmt->close();
    }

    $conn->commit();

    echo json_encode([
        'success' => true,
        'data' => $transactions
    ]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$stmt->close();
$conn->close();
?>