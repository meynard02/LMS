<?php
// dashboard_stats.php
require_once '../php/connection.php';

header('Content-Type: application/json');

$response = [
    'success' => false,
    'activeUsers' => 0,
    'totalBooks' => 0,
    'overdueBooks' => 0
];

try {
    // Get active users count
    $userQuery = "SELECT COUNT(*) as count FROM user WHERE Status = 'Active'";
    $userResult = $conn->query($userQuery);
    if ($userResult) {
        $response['activeUsers'] = $userResult->fetch_assoc()['count'];
    } else {
        throw new Exception("Failed to fetch active users: " . $conn->error);
    }

    // Get total books count
    $bookQuery = "SELECT COUNT(*) as count FROM book";
    $bookResult = $conn->query($bookQuery);
    if ($bookResult) {
        $response['totalBooks'] = $bookResult->fetch_assoc()['count'];
    } else {
        throw new Exception("Failed to fetch total books: " . $conn->error);
    }

    // Get overdue books count
    $currentDate = date('Y-m-d');
    $overdueQuery = "SELECT COUNT(*) as count FROM transaction 
                    WHERE statusID = (SELECT statusID FROM status WHERE StatusDesc = 'Overdue') 
                    AND DueDate < ?";
    $stmt = $conn->prepare($overdueQuery);
    $stmt->bind_param("s", $currentDate);
    $stmt->execute();
    $overdueResult = $stmt->get_result();
    $response['overdueBooks'] = $overdueResult->fetch_assoc()['count'];

    $response['success'] = true;
} catch (Exception $e) {
    $response['error'] = $e->getMessage();
}

echo json_encode($response);
$conn->close();
?>