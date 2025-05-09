<?php
require_once '../php/connection.php';

header('Content-Type: application/json');

$response = ['success' => false];

try {
    // Fetch active users count
    $activeUsersQuery = "SELECT COUNT(*) as count FROM user WHERE Status = 'Active'";
    $activeUsersResult = $conn->query($activeUsersQuery);
    $activeUsers = $activeUsersResult->fetch_assoc()['count'];
    
    // Fetch total books count
    $booksQuery = "SELECT COUNT(*) as count FROM book";
    $booksResult = $conn->query($booksQuery);
    $books = $booksResult->fetch_assoc()['count'];
    
    // Fetch overdue books count
    $overdueQuery = "SELECT COUNT(*) as count FROM transaction t 
                     JOIN status s ON t.statusID = s.statusID 
                     WHERE s.StatusDesc = 'Overdue' AND t.deleteStatus = 1";
    $overdueResult = $conn->query($overdueQuery);
    $overdue = $overdueResult->fetch_assoc()['count'];
    
    $response = [
        'success' => true,
        'data' => [
            'activeUsers' => $activeUsers,
            'books' => $books,
            'overdue' => $overdue
        ]
    ];
    
} catch (Exception $e) {
    $response['error'] = $e->getMessage();
}

echo json_encode($response);
$conn->close();
?>