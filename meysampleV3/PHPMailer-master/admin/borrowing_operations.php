<?php
require_once '../php/connection.php';

header('Content-Type: application/json');

$action = $_POST['action'] ?? '';

try {
    switch ($action) {
        case 'update':
            $transactionId = $_POST['transactionId'];
            $statusId = $_POST['statusId'];
            $returnDate = $_POST['returnDate'] ?: null;

            $stmt = $conn->prepare("
                UPDATE transaction 
                SET statusID = ?, ReturnDate = ?
                WHERE transactionID = ?
            ");
            $stmt->bind_param("isi", $statusId, $returnDate, $transactionId);
            $stmt->execute();
            
            // Update book availability if marked as returned
            if ($returnDate && in_array($statusId, [2, 5])) { // 2=Returned, 5=Overdue/Returned
                $stmt = $conn->prepare("
                    UPDATE book b
                    JOIN transaction t ON b.accessionNo = t.accessionNo
                    SET b.Availability = 'Available'
                    WHERE t.transactionID = ?
                ");
                $stmt->bind_param("i", $transactionId);
                $stmt->execute();
            }
            
            echo json_encode(['success' => true]);
            break;

        case 'return':
            $transactionId = $_POST['transactionId'];
            $condition = $_POST['condition'];
            $notes = $_POST['notes'];
            $returnDate = date('Y-m-d H:i:s');

            // Update transaction
            $stmt = $conn->prepare("
                UPDATE transaction 
                SET ReturnDate = ?, 
                    statusID = (SELECT statusID FROM status WHERE StatusDesc = 'Returned' LIMIT 1)
                WHERE transactionID = ?
            ");
            $stmt->bind_param("si", $returnDate, $transactionId);
            $stmt->execute();
            $stmt->close();

            // Update book
            $stmt = $conn->prepare("
                UPDATE book b
                JOIN transaction t ON b.accessionNo = t.accessionNo
                SET b.Availability = 'Available'
                WHERE t.transactionID = ?
            ");
            $stmt->bind_param("i", $transactionId);
            $stmt->execute();
            $stmt->close();

            // Insert into log
            $stmt = $conn->prepare("
                INSERT INTO transaction_log (transactionID, action, `condition`, notes, actionDate)
                VALUES (?, 'return', ?, ?, NOW())
            ");
            $stmt->bind_param("iss", $transactionId, $condition, $notes);
            $stmt->execute();
            $stmt->close();

            echo json_encode(['success' => true]);
            break;

        case 'delete':
            $transactionId = $_POST['transactionId'];

            $stmt = $conn->prepare("
                UPDATE transaction 
                SET deleteStatus = 0 
                WHERE transactionID = ?
            ");
            $stmt->bind_param("i", $transactionId);
            $stmt->execute();
            $stmt->close();

            echo json_encode(['success' => true]);
            break;

        default:
            echo json_encode([
                'success' => false,
                'error' => 'Invalid action'
            ]);
    }

    $conn->close();

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
