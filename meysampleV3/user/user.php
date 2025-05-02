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
                    <input type="text" placeholder="Search books..." id="book-search">
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
                        <div class="section-header">
                            <h2><i class="fas fa-home section-icon"></i> <span class="section-indicator">Homepage</span></h2>
                            <div class="section-divider"></div>
                        </div>
                        <div class="welcome-message">
                            <i class="fas fa-book-reader welcome-icon"></i>
                            <h3>Welcome to BookKeeper!</h3>
                            <p>Your personal library management system. Browse books, manage your profile, and stay updated with notifications.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="profile-panel" class="content-panel">
                <div class="panel-content">
                    <div class="profile-tabs">
                        <button class="profile-tab active" onclick="showProfileSection('personal-info')">
                            <i class="fas fa-user-circle"></i> Personal Information
                        </button>
                        <button class="profile-tab" onclick="showProfileSection('my-borrows')">
                            <i class="fas fa-clock"></i> My Borrows
                            <span class="borrows-badge hidden" id="profile-borrows-badge">0</span>
                        </button>
                    </div>
                    
                    <div id="personal-info-section" class="profile-section active">
                        <div class="content-section">
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
                </div>
            </div>
            
            
            
            <div id="notification-panel" class="content-panel">
                <div class="panel-content">
                    <div class="content-section">
                        <div class="section-header">
                            <h2><i class="fas fa-bell section-icon"></i> <span class="section-indicator">Notifications</span></h2>
                            <button class="clear-notifications-btn" id="clear-notifications-btn">
                                <i class="fas fa-trash-alt"></i> Clear All
                            </button>
                            <div class="section-divider"></div>
                        </div>
                        <div class="notifications-list">
                            <div class="notification-item unread">
                                <i class="fas fa-book notification-icon"></i>
                                <div class="notification-content">
                                    <h4>New Science Books Added</h4>
                                    <p>5 new science books have been added to the library</p>
                                    <span class="notification-time">2 hours ago</span>
                                </div>
                            </div>
                            <div class="notification-item">
                                <i class="fas fa-calendar-check notification-icon"></i>
                                <div class="notification-content">
                                    <h4>Due Date Reminder</h4>
                                    <p>"Physics Fundamentals" is due in 3 days</p>
                                    <span class="notification-time">1 day ago</span>
                                </div>
                            </div>
                            <div class="notification-item">
                                <i class="fas fa-tools notification-icon"></i>
                                <div class="notification-content">
                                    <h4>System Update</h4>
                                    <p>BookKeeper will undergo maintenance tomorrow from 2-3 AM</p>
                                    <span class="notification-time">2 days ago</span>
                                </div>
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
                    <span class="book-accession" id="modal-book-accession"><i class="fas fa-barcode"></i> Accession No: </span>
                </div>
                <div class="book-description">
                    <h3><i class="fas fa-align-left"></i> Description</h3>
                    <p id="modal-book-description">Book description goes here...</p>
                </div>
                <div class="book-availability">
                    <span class="availability-status" id="modal-book-availability"></span>
                </div>
            </div>
        </div>
    </div>
</div>

    <!-- Toast Notification Container -->
    <div id="toast-container"></div>

    <script src="../user/user.js"></script>
    <script>
        // Initialize user data in JavaScript
        const currentUser = {
            id: <?php echo $_SESSION['user_id']; ?>,
            email: "<?php echo $email; ?>",
            firstname: "<?php echo $firstname; ?>",
            lastname: "<?php echo $lastname; ?>"
        };
    </script>
</body>
</html>