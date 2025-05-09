<?php
// borrowing_operations.php
require_once '../php/connection.php';
require_once '../admin/notification_functions.php';

header('Content-Type: application/json');

$action = $_POST['action'] ?? '';

try {
    switch ($action) {
        case 'update':
            $transactionId = $_POST['transactionId'];
            $statusId = $_POST['statusId'];
            $returnDate = $_POST['returnDate'] ?: null;
            $newStatus = $_POST['newStatus'] ?? '';

            // First get the email, book title, and author
            $stmt = $conn->prepare("
                SELECT u.Email, b.Title, b.Author 
                FROM transaction t
                JOIN user u ON t.userID = u.UserID
                JOIN book b ON t.accessionNo = b.AccessionNo
                WHERE t.transactionID = ?
                AND t.deleteStatus = 1
            ");
            $stmt->bind_param("i", $transactionId);
            $stmt->execute();
            $result = $stmt->get_result();
            $data = $result->fetch_assoc();
            $stmt->close();

            // Update transaction record
            $stmt = $conn->prepare("
                UPDATE transaction 
                SET statusID = ?, ReturnDate = ?
                WHERE transactionID = ?
                AND deleteStatus = 1
            ");
            $stmt->bind_param("isi", $statusId, $returnDate, $transactionId);
            $stmt->execute();
            
            // Update book availability based on new status
            if ($newStatus) {
                $newAvailability = '';
                
                if ($newStatus === 'Rejected') {
                    $newAvailability = 'On Hold';
                    // Send rejection notification with author
                    sendNotification(
                        $data['Email'], 
                        'rejected', 
                        $data['Title'],
                        $data['Author']
                    );
                } elseif ($newStatus === 'Approved') {
                    // Send approval notification with author
                    sendNotification(
                        $data['Email'], 
                        'approved', 
                        $data['Title'],
                        $data['Author']
                    );
                } elseif (in_array($newStatus, ['Returned', 'Returned Overdue'])) {
                    $newAvailability = 'Available';
                }
                
                if ($newAvailability) {
                    $stmt = $conn->prepare("
                        UPDATE book b
                        JOIN transaction t ON b.AccessionNo = t.accessionNo
                        SET b.Availability = ?
                        WHERE t.transactionID = ?
                        AND t.deleteStatus = 1
                    ");
                    $stmt->bind_param("si", $newAvailability, $transactionId);
                    $stmt->execute();
                }
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
                AND deleteStatus = 1
            ");
            $stmt->bind_param("si", $returnDate, $transactionId);
            $stmt->execute();
            $stmt->close();

            // Update book
            $stmt = $conn->prepare("
                UPDATE book b
                JOIN transaction t ON b.AccessionNo = t.accessionNo
                SET b.Availability = 'Available'
                WHERE t.transactionID = ?
                AND t.deleteStatus = 1
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

        case 'check_due_dates':
            checkDueDates();
            echo json_encode(['success' => true]);
            break;

        default:
            echo json_encode([
                'success' => false,
                'error' => 'Invalid action'
            ]);
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
} finally {
    $conn->close();
}
?>