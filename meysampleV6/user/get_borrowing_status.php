<?php
session_start();
include '../php/connection.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

try {
    // 1. Get the maximum allowed books per student
    $maxBooks = 5; // Default value
    $stmt = $conn->prepare("SELECT MaxNumber FROM max_books LIMIT 1");
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $maxBooks = $row['MaxNumber'];
    }
    
    // 2. Check how many books the user currently has borrowed (pending + approved)
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM transaction 
                          WHERE UserID = ? AND (StatusID = 3 OR StatusID = 1)");
    $stmt->bind_param("i", $_SESSION['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $currentBorrows = $row['count'];
    
    // 3. Get pending borrows count
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM transaction 
                          WHERE UserID = ? AND StatusID = 3");
    $stmt->bind_param("i", $_SESSION['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $pendingBorrows = $row['count'];
    
    echo json_encode([
        'success' => true,
        'maxBooks' => $maxBooks,
        'currentBorrows' => $currentBorrows,
        'pendingBorrows' => $pendingBorrows,
        'remainingBooks' => $maxBooks - $currentBorrows
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>