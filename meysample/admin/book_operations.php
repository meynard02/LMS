<?php
require_once '../php/connection.php';

header('Content-Type: application/json');
ob_start();

$response = ['success' => false, 'error' => null];

try {
    // Verify request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Invalid request method");
    }

    $action = $_POST['action'] ?? 'add'; // Default to 'add' if not specified
    $accessionNo = (int)$_POST['accessionNo'];
    
    if ($action === 'update' || $action === 'add') {
        // Validate required fields
        if (empty($accessionNo) || empty($_POST['title']) || empty($_POST['author'])) {
            throw new Exception("Accession No., Title and Author are required");
        }

        $title = $conn->real_escape_string($_POST['title']);
        $author = $conn->real_escape_string($_POST['author']);
        $category = $conn->real_escape_string($_POST['category'] ?? '');
        $description = $conn->real_escape_string($_POST['description'] ?? '');
        $availability = $conn->real_escape_string($_POST['availability'] ?? 'Available');
        
        // Handle file upload
        $photo = null;
        if (!empty($_FILES['photo']['name']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
            $targetDir = "../uploads/";
            
            if (!file_exists($targetDir)) {
                mkdir($targetDir, 0755, true);
            }

            $fileExt = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
            $fileName = uniqid().'.'.$fileExt;
            $targetFile = $targetDir.$fileName;
            
            $check = getimagesize($_FILES['photo']['tmp_name']);
            if ($check === false) {
                throw new Exception("File is not an image");
            }
            
            if ($_FILES['photo']['size'] > 5000000) {
                throw new Exception("File is too large (max 5MB)");
            }
            
            $allowedTypes = ['jpg','jpeg','png','gif'];
            if (!in_array(strtolower($fileExt), $allowedTypes)) {
                throw new Exception("Only JPG, PNG, GIF images allowed");
            }
            
            if (!move_uploaded_file($_FILES['photo']['tmp_name'], $targetFile)) {
                throw new Exception("Failed to save uploaded file");
            }
            $photo = $fileName;
        }

        // For ADD operation - check if AccessionNo doesn't already exist
        if ($action === 'add') {
            $check = $conn->prepare("SELECT AccessionNo FROM book WHERE AccessionNo=?");
            $check->bind_param("i", $accessionNo);
            $check->execute();
            $check->store_result();
            
            if ($check->num_rows > 0) {
                throw new Exception("Accession Number $accessionNo already exists");
            }
            $check->close();

            $stmt = $conn->prepare("INSERT INTO book (AccessionNo, Title, Author, Category, Photo, Description, Availability) 
                                  VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("issssss", $accessionNo, $title, $author, $category, $photo, $description, $availability);
        } 
        // For UPDATE operation - check if AccessionNo exists
        else {
            $check = $conn->prepare("SELECT AccessionNo FROM book WHERE AccessionNo=?");
            $check->bind_param("i", $accessionNo);
            $check->execute();
            $check->store_result();
            
            if ($check->num_rows === 0) {
                throw new Exception("Book with AccessionNo $accessionNo not found");
            }
            $check->close();

            if ($photo) {
                $stmt = $conn->prepare("UPDATE book SET Title=?, Author=?, Category=?, Photo=?, Description=?, Availability=? 
                                      WHERE AccessionNo=?");
                $stmt->bind_param("ssssssi", $title, $author, $category, $photo, $description, $availability, $accessionNo);
            } else {
                $stmt = $conn->prepare("UPDATE book SET Title=?, Author=?, Category=?, Description=?, Availability=? 
                                      WHERE AccessionNo=?");
                $stmt->bind_param("sssssi", $title, $author, $category, $description, $availability, $accessionNo);
            }
        }

        if (!$stmt->execute()) {
            throw new Exception("Database error: ".$stmt->error);
        }
        
        $response['success'] = true;
        $response['accessionNo'] = $accessionNo;
        $stmt->close();
    }
    elseif ($action === 'delete') {
        // Delete operation code here
    }
} catch (Exception $e) {
    $response['error'] = $e->getMessage();
    error_log("Book operation error: ".$e->getMessage());
}

ob_end_clean();
echo json_encode($response);
$conn->close();
?>