<?php
session_start();
include '../php/connection.php';

// Check if user is logged in, if not redirect to login
if (!isset($_SESSION['user_id'])) {
    header("Location: ../login/index.php");
    exit();
}

// Get user data from database
$stmt = $conn->prepare("SELECT Email, FirstName, LastName FROM user WHERE UserID = ?");
$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    // User not found in database
    session_destroy();
    header("Location: ../login/index.php");
    exit();
}

$email = $user['Email'];
$firstname = $user['FirstName'];
$lastname = $user['LastName'];

$_SESSION['email'] = $user['Email']; // Add this line
$email = $user['Email'];

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BookKeeper</title>
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../user/user.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <style>
        .search-categories.hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="main-content">
        <header class="header">
            <div class="logo-container">
                <i class="fas fa-book-open logo-icon"></i>
                <h1>BookKeeper</h1>
            </div>
            <nav class="nav-links" id="navLinks">
                <a href="#" class="active" onclick="showPanel('home')">
                    <i class="fas fa-home"></i>
                    <span class="nav-text">Home</span>
                </a>
                <a href="#" onclick="showPanel('profile')">
                    <i class="fas fa-user"></i>
                    <span class="nav-text">Profile</span>
                    <span class="borrows-badge hidden" id="borrows-badge">0</span>
                </a>
                <a href="#" onclick="showPanel('notification')" class="notification-link">
                    <i class="fas fa-bell"></i>
                    <span class="nav-text">Notifications</span>
                    <span class="notification-badge">3</span>
                </a>
                <a href="#" onclick="return confirmLogout()">
                    <i class="fas fa-sign-out-alt"></i>
                    <span class="nav-text">Logout</span>
                </a>
            </nav>
        </header>

        <div class="content-container">
            <div class="search-categories" id="searchCategories">
            <div class="search-group">
                <i class="fas fa-search search-icon"></i>
                <input type="text" placeholder="Search books by title, author, or category..." id="book-search">
                <i class="fas fa-times clear-search" id="clear-search" style="display: none;"></i>
            </div>
                
                <div class="category-tabs">
                    <div class="category-tab science" onclick="showBookPanel('science')">
                        <i class="fas fa-flask"></i> Science
                    </div>
                    <div class="category-tab filipino" onclick="showBookPanel('filipino')">
                        <i class="fas fa-flag"></i> Filipino
                    </div>
                    <div class="category-tab pe" onclick="showBookPanel('pe')">
                        <i class="fas fa-running"></i> PE
                    </div>
                    <div class="category-tab music" onclick="showBookPanel('music')">
                        <i class="fas fa-music"></i> Music
                    </div>
                    <div class="category-tab english" onclick="showBookPanel('english')">
                        <i class="fas fa-language"></i> English
                    </div>
                    <div class="category-tab ap" onclick="showBookPanel('ap')">
                        <i class="fas fa-globe-asia"></i> AP
                    </div>
                    <div class="category-tab fiction" onclick="showBookPanel('fiction')">
                        <i class="fas fa-book"></i> Fiction
                    </div>
                    <div class="category-tab more" onclick="showBookPanel('more')">
                        <i class="fas fa-ellipsis-h"></i> More
                    </div>
                </div>
            </div>
            
            <div id="home-panel" class="content-panel active">
                <div class="panel-content">
                    <div class="content-section">
                        

                        
                        
                        <!-- Add this section for all books -->
                        <div class="all-books-section">
                            <h3><i class="fas fa-book-open"></i> All Books</h3>
                            <div class="book-grid" id="all-books-grid">
                                <!-- Books will be inserted here by JavaScript -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        <div id="profile-panel" class="content-panel">
        <div class="panel-content">
            <div class="profile-tabs">
                <button class="profile-tab" onclick="showProfileSection('my-borrows')"><i class="fas fa-clock"></i> My Borrows <span class="borrows-badge hidden" id="profile-borrows-badge">0</span></button>
                <button class="profile-tab" onclick="showProfileSection('books-in-my-bag')"><i class="fas fa-shopping-bag"></i> Books In My Bag</button>
                <button class="profile-tab" onclick="showProfileSection('finished-reads')"><i class="fas fa-check-circle"></i> Finished Reads</button>
                <button class="profile-tab active" onclick="showProfileSection('personal-info')"><i class="fas fa-user-circle"></i> Personal Information</button>
            </div>
                    
            <div id="personal-info-section" class="profile-section active">
                        <div class="content-section-profile">
                            <div class="section-header">
                                <h2><i class="fas fa-user section-icon"></i> <span class="section-indicator">Profile Information</span></h2>
                                <button class="edit-profile-btn" id="edit-profile-btn">
                                    <i class="fas fa-edit"></i> Edit Profile
                                </button>
                                <div class="section-divider"></div>
                            </div>
                            
                            <div class="profile-info-container">
                                <div class="profile-info-row">
                                    <span class="profile-info-label"><i class="fas fa-envelope"></i> Email</span>
                                    <span class="profile-info-value" id="profile-email"><?php echo htmlspecialchars($email); ?></span>
                                </div>
                                
                                <div class="profile-info-row">
                                    <span class="profile-info-label"><i class="fas fa-signature"></i> First Name</span>
                                    <span class="profile-info-value" id="profile-firstname"><?php echo htmlspecialchars($firstname); ?></span>
                                </div>
                                
                                <div class="profile-info-row">
                                    <span class="profile-info-label"><i class="fas fa-signature"></i> Last Name</span>
                                    <span class="profile-info-value" id="profile-lastname"><?php echo htmlspecialchars($lastname); ?></span>
                                </div>
                                
                                <div class="profile-info-row">
                                    <span class="profile-info-label"><i class="fas fa-lock"></i> Password</span>
                                    <span class="profile-info-value">
                                        **********
                                        <button class="change-password-btn" id="change-password-btn">
                                            <i class="fas fa-key"></i> Change Password
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="my-borrows-section" class="profile-section">
                        <div class="content-section">
                            <div class="section-header">
                                <h2><i class="fas fa-clock section-icon"></i> <span class="section-indicator">My Borrows</span></h2>
                                <div class="section-divider"></div>
                            </div>
                            <div class="borrows-container" id="pending-borrows">
                                <div class="no-borrows" id="no-borrows-message">
                                    <i class="fas fa-book-open"></i>
                                    <p>You have no pending book borrows</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Finished Reads Section -->
<div id="finished-reads-section" class="profile-section">
                <div class="content-section">
                    <h2><i class="fas fa-check-circle section-icon"></i> Finished Reads</h2>
                    <div class="section-divider"></div>

                    <!-- Filter Options -->
                    <div class="filters">
                        <select id="finishedFilter" onchange="filterFinishedReads()">
                            <option value="all">All Time</option>
                            <option value="week">Last Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                            <option value="custom">Custom Date</option>
                        </select>
                        <input type="date" id="customDate" onchange="filterFinishedReads()" style="display:none;">
                    </div>

                    <!-- Sample Data Finished Reads -->
                    <div id="finished-reads-list" class="borrows-container">
                        <!-- JS will insert finished books -->
                    </div>
                </div>
            </div>
            
<!-- Books in My Bag Section -->
<div id="books-in-my-bag-section" class="profile-section">
                <div class="content-section">
                    <h2><i class="fas fa-shopping-bag section-icon"></i> Books In My Bag</h2>
                    <div class="section-divider"></div>

                    <div id="books-bag-list" class="borrows-container">
                        <!-- JS will insert current books -->
                    </div>
                </div>
            </div>
                </div>
            </div>
            
            
            <div id="notification-panel" class="content-panel">
                <div class="panel-content">
                    <div class="content-section">
                        <div class="section-header">
                            <h2><i class="fas fa-bell section-icon"></i> <span class="section-indicator">Notifications</span></h2>
                            <button class="clear-notifications-btn" id="clear-notifications-btn">
                                <i class="fa-solid fa-square-check"></i> Mark all as read
                            </button>
                            <div class="section-divider"></div>
                        </div>
                        <div class="notifications-list">
                            <!-- This will be populated by JavaScript -->
                            <div class="loading-notifications">
                                <i class="fas fa-spinner fa-spin"></i> Loading notifications...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="books-panel" class="content-panel">
                <div class="panel-content">
                    <div class="content-section">
                        <div class="section-header">
                            <h2><i class="fas fa-book-open section-icon"></i> <span class="section-indicator" id="books-panel-title">Books</span></h2>
                            <div class="section-divider"></div>
                        </div>
                        <div class="book-grid" id="bookGrid">
                            <!-- Books will be inserted here by JavaScript -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Profile Modal -->
    <div id="edit-profile-modal" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2><i class="fas fa-user-edit"></i> Edit Profile Information</h2>
            
            <div class="modal-form">
                <div class="form-group">
                    <label for="edit-email"><i class="fas fa-envelope"></i> Email</label>
                    <input type="email" id="edit-email" class="form-input" value="<?php echo htmlspecialchars($email); ?>">
                </div>
                
                <div class="form-group">
                    <label for="edit-firstname"><i class="fas fa-signature"></i> First Name</label>
                    <input type="text" id="edit-firstname" class="form-input" value="<?php echo htmlspecialchars($firstname); ?>">
                </div>
                
                <div class="form-group">
                    <label for="edit-lastname"><i class="fas fa-signature"></i> Last Name</label>
                    <input type="text" id="edit-lastname" class="form-input" value="<?php echo htmlspecialchars($lastname); ?>">
                </div>
                
                <div class="form-actions">
                    <button class="cancel-btn" id="cancel-edit-btn">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button class="save-btn" id="save-profile-btn">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Change Password Modal -->
    <div id="change-password-modal" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2><i class="fas fa-key"></i> Change Password</h2>
            
            <div class="modal-form">
                <div class="form-group">
                    <label for="current-password"><i class="fas fa-lock"></i> Current Password</label>
                    <input type="password" id="current-password" class="form-input">
                    <i class="fas fa-eye password-toggle" onclick="togglePassword('current-password')"></i>
                </div>
                
                <div class="form-group">
                    <label for="new-password"><i class="fas fa-lock"></i> New Password</label>
                    <input type="password" id="new-password" class="form-input">
                    <i class="fas fa-eye password-toggle" onclick="togglePassword('new-password')"></i>
                    <div class="password-strength-meter">
                        <div class="strength-bar"></div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="confirm-password"><i class="fas fa-lock"></i> Confirm New Password</label>
                    <input type="password" id="confirm-password" class="form-input">
                    <i class="fas fa-eye password-toggle" onclick="togglePassword('confirm-password')"></i>
                </div>
                
                <div class="form-actions">
                    <button class="cancel-btn" id="cancel-password-btn">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button class="save-btn" id="confirm-password-btn">
                        <i class="fas fa-save"></i> Update Password
                    </button>
                </div>
            </div>
        </div>
    </div>

<!-- Book Details Modal -->
<div id="book-details-modal" class="modal">
    <div class="modal-content book-modal">
        <span class="close-modal">&times;</span>
        <div class="book-modal-content">
            <div class="book-modal-left">
                <div class="book-modal-cover" id="modal-book-cover">
                    <i class="fas fa-book book-icon"></i>
                </div>
                <button class="borrow-btn" id="borrow-btn">
                    <i class="fas fa-bookmark"></i> Borrow Book
                </button>
            </div>
            <div class="book-modal-right">
                <h2 id="modal-book-title">Book Title</h2>
                <div class="book-meta">
                    <span class="book-author" id="modal-book-author"><i class="fas fa-user"></i> Author Name</span>
                    <span class="book-category" id="modal-book-category"><i class="fas fa-tag"></i> Category</span>
                </div>
                <div class="book-description">
                    <h3><i class="fas fa-align-left"></i> Description</h3>
                    <p id="modal-book-description">Book description goes here...</p>
                </div>
                <div class="book-details">
                    <h3><i class="fas fa-info-circle"></i> Details</h3>
                    <div class="details-grid">
                        <div class="detail-item">
                            <span class="detail-label"><i class="fas fa-calendar"></i> Published:</span>
                            <span class="detail-value" id="modal-book-year">2023</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label"><i class="fas fa-barcode"></i> Accession No.:</span>
                            <span class="detail-value" id="modal-book-accession">12345</span>
                        </div>
                    </div>
                </div>
                <div class="book-availability">
                    <span class="availability-status" id="modal-book-availability">Available</span>
                </div>
            </div>
        </div>
    </div>
</div>

        <!-- Borrow Book Modal -->
        <div id="borrow-modal" class="modal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2><i class="fas fa-book"></i> Borrow Book</h2>
                
                <div class="modal-form">
                    <div class="form-group">
                        <label><i class="fas fa-calendar"></i> Borrow Date</label>
                        <input type="date" id="borrow-date" class="form-input">
                        <small>Available from 5 days after today (no Sundays)</small>
                    </div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-calendar-check"></i> Due Date</label>
                        <input type="date" id="due-date" class="form-input" readonly>
                    </div>
                    
                    <div class="form-actions">
                        <button class="cancel-btn" id="cancel-borrow-btn">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button class="save-btn" id="confirm-borrow-btn">
                            <i class="fas fa-check"></i> Confirm Borrow
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
    <!-- Toast Notification Container -->
    <div id="toast-container"></div>

    <script src="../user/user.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        // Initialize user data in JavaScript
        const currentUser = {
            id: <?php echo $_SESSION['user_id']; ?>,
            email: "<?php echo $email; ?>",
            firstname: "<?php echo $firstname; ?>",
            lastname: "<?php echo $lastname; ?>"
        };
    </script>
    <script src="../js/autoLogout.js"></script>
</body>
</html>