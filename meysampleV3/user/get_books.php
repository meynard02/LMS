<?php
require_once '../php/connection.php';

header('Content-Type: application/json');

$response = [
    'categories' => [],
    'books' => []
];

// Get all categories from book_categories table sorted by ID
$categories = $conn->query("SELECT * FROM book_categories ORDER BY Book_CategoryID ASC")->fetch_all(MYSQLI_ASSOC);

foreach ($categories as $category) {
    $response['categories'][$category['Book_CategoryID']] = $category['Book_Category'];
    
    // Get books for this category
    $stmt = $conn->prepare("SELECT AccessionNo, Title, Author, Photo, Description, Availability FROM book WHERE Book_CategoryID = ?");
    $stmt->bind_param("i", $category['Book_CategoryID']);
    $stmt->execute();
    $result = $stmt->get_result();
    $books = $result->fetch_all(MYSQLI_ASSOC);
    
    // Format book data
    $formattedBooks = [];
    foreach ($books as $book) {
        $formattedBooks[] = [
            'accessionNo' => $book['AccessionNo'],
            'title' => $book['Title'],
            'author' => $book['Author'],
            'photo' => $book['Photo'],
            'description' => $book['Description'],
            'availability' => $book['Availability']
        ];
    }
    
    $response['books'][$category['Book_CategoryID']] = $formattedBooks;
}

echo json_encode($response);
?>