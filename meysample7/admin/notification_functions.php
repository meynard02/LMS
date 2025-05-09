<?php
// notification_functions.php
require_once '../php/connection.php';

function sendNotification($email, $type, $title, $author = '') {
    global $conn;
    
    // Get the notification template based on type
    $stmt = $conn->prepare("
        SELECT ID, Notif_title, Notif_desc 
        FROM notification_desc 
        WHERE Notif_status = ? 
        LIMIT 1
    ");
    
    $status = '';
    switch($type) {
        case 'approved': $status = 'Approved'; break;
        case 'rejected': $status = 'Rejected'; break;
        case 'due': $status = 'Due Date'; break;
        case 'overdue': $status = 'Overdue'; break;
    }
    
    $stmt->bind_param("s", $status);
    $stmt->execute();
    $result = $stmt->get_result();
    $template = $result->fetch_assoc();
    $stmt->close();
    
    if (!$template) return false;
    
    // Customize the message with book title and author
    $customMessage = sprintf($template['Notif_desc'], $title, $author);
    
    // Insert the notification
    $stmt = $conn->prepare("
        INSERT INTO notification (Email, ID, DueDate, CustomMessage)
        VALUES (?, ?, NOW(), ?)
    ");
    $stmt->bind_param("sis", $email, $template['ID'], $customMessage);
    $result = $stmt->execute();
    $stmt->close();
    
    return $result;
}

function checkDueDates() {
    global $conn;
    
    // Check for due dates in 3 days
    $threeDaysLater = date('Y-m-d', strtotime('+3 days'));
    
    $stmt = $conn->prepare("
        SELECT t.transactionID, u.Email, b.Title, b.Author, t.DueDate
        FROM transaction t
        JOIN user u ON t.userID = u.UserID
        JOIN book b ON t.accessionNo = b.AccessionNo
        JOIN status s ON t.statusID = s.statusID
        WHERE DATE(t.DueDate) = ?
        AND s.StatusDesc = 'Approved'
        AND t.ReturnDate IS NULL
        AND t.deleteStatus = 1
    ");
    $stmt->bind_param("s", $threeDaysLater);
    $stmt->execute();
    $result = $stmt->get_result();
    
    while ($transaction = $result->fetch_assoc()) {
        sendNotification(
            $transaction['Email'], 
            'due', 
            $transaction['Title'],
            $transaction['Author']
        );
    }
    $stmt->close();
    
    // Check for overdue books
    $today = date('Y-m-d');
    
    $stmt = $conn->prepare("
        SELECT t.transactionID, u.Email, b.Title, b.Author, t.DueDate
        FROM transaction t
        JOIN user u ON t.userID = u.UserID
        JOIN book b ON t.accessionNo = b.AccessionNo
        JOIN status s ON t.statusID = s.statusID
        WHERE DATE(t.DueDate) < ?
        AND s.StatusDesc = 'Approved'
        AND t.ReturnDate IS NULL
        AND t.deleteStatus = 1
    ");
    $stmt->bind_param("s", $today);
    $stmt->execute();
    $result = $stmt->get_result();
    
    while ($transaction = $result->fetch_assoc()) {
        sendNotification(
            $transaction['Email'], 
            'overdue', 
            $transaction['Title'],
            $transaction['Author']
        );
    }
    $stmt->close();
}
?>