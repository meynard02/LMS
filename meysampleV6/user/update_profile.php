<?php
session_start();
header('Content-Type: application/json');
include '../php/connection.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

// Get input data
$data = json_decode(file_get_contents('php://input'), true);
$email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$firstname = htmlspecialchars($data['firstname'] ?? '');
$lastname = htmlspecialchars($data['lastname'] ?? '');

// Validate inputs
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || empty($firstname) || empty($lastname)) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit();
}

// Validate SPIST domain
if (!str_ends_with($email, '@spist.edu.ph')) {
    echo json_encode(['success' => false, 'message' => 'Email must end with @spist.edu.ph']);
    exit();
}

try {
    // Check if email is already taken by another user
    $checkStmt = $conn->prepare("SELECT UserID FROM user WHERE Email = ? AND UserID != ?");
    $checkStmt->bind_param("si", $email, $_SESSION['user_id']);
    $checkStmt->execute();
    
    if ($checkStmt->get_result()->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already in use by another account']);
        exit();
    }

    // Update user profile
    $stmt = $conn->prepare("UPDATE user SET Email = ?, FirstName = ?, LastName = ? WHERE UserID = ?");
    $stmt->bind_param("sssi", $email, $firstname, $lastname, $_SESSION['user_id']);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No changes made']);
    }
} catch (mysqli_sql_exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}