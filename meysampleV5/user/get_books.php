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
    $stmt = $conn->prepare("SELECT 
        b.AccessionNo, 
        b.Title, 
        b.Author, 
        b.Photo, 
        b.Description, 
        b.PublishedYear,
        b.Availability,
        bc.Book_Category
    FROM book b
    JOIN book_categories bc ON b.Book_CategoryID = bc.Book_CategoryID
    WHERE b.Book_CategoryID = ?");
    
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
            'publishedYear' => $book['PublishedYear'],
            'availability' => $book['Availability'],
            'category' => $book['Book_Category']
        ];
    }
    
    $response['books'][$category['Book_CategoryID']] = $formattedBooks;
}

echo json_encode($response);
?>