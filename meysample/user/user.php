<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BookKeeper</title>
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
            <h1>BookKeeper</h1>
            <nav class="nav-links" id="navLinks">
                <a href="#" class="active" onclick="showPanel('home')">Home</a>
                <a href="#" onclick="showPanel('profile')">Profile</a>
                <a href="#" onclick="showPanel('notification')">Notification</a>
                <a href="#" onclick="return confirmLogout()">Logout</a>
            </nav>
        </header>

        <div class="content-container">
            <div class="search-categories" id="searchCategories">
                <div class="search-group">
                    <input type="text" placeholder="Search">
                </div>
                
                <div class="category-tabs">
                    <div class="category-tab science" onclick="showBookPanel('science')">Science</div>
                    <div class="category-tab filipino" onclick="showBookPanel('filipino')">Filipino</div>
                    <div class="category-tab pe" onclick="showBookPanel('pe')">PE</div>
                    <div class="category-tab music" onclick="showBookPanel('music')">Music</div>
                    <div class="category-tab english" onclick="showBookPanel('english')">English</div>
                    <div class="category-tab ap" onclick="showBookPanel('ap')">AP</div>
                    <div class="category-tab fiction" onclick="showBookPanel('fiction')">Fiction</div>
                    <div class="category-tab more" onclick="showBookPanel('more')">More...</div>
                </div>
            </div>
            
            <div id="home-panel" class="content-panel active">
                <div class="panel-content">
                    <div class="content-section">
                        <div class="section-header">
                            <h2><span class="section-indicator">Homepage</span></h2>
                            <div class="section-divider"></div>
                        </div>
                        <p>Welcome to the library homepage.</p>
                    </div>
                </div>
            </div>
            
            <div id="profile-panel" class="content-panel">
                <div class="panel-content">
                    <div class="content-section">
                        <div class="section-header">
                            <h2><span class="section-indicator">Profile Information</span></h2>
                            <button class="edit-profile-btn" id="edit-profile-btn">Edit Profile</button>
                            <div class="section-divider"></div>
                        </div>
                        
                        <div class="profile-info-container">
                            <div class="profile-info-row">
                                <span class="profile-info-label">Email</span>
                                <span class="profile-info-value" id="profile-email">xxxxxxx@spist.edu.ph</span>
                            </div>
                            
                            <div class="profile-info-row">
                                <span class="profile-info-label">First Name</span>
                                <span class="profile-info-value" id="profile-firstname">Juan</span>
                            </div>
                            
                            <div class="profile-info-row">
                                <span class="profile-info-label">Last Name</span>
                                <span class="profile-info-value" id="profile-lastname">Dela Cruz</span>
                            </div>
                            
                            <div class="profile-info-row">
                                <span class="profile-info-label">Password</span>
                                <span class="profile-info-value">
                                    **********
                                    <button class="change-password-btn" id="change-password-btn">Change Password</button>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="notification-panel" class="content-panel">
                <div class="panel-content">
                    <div class="content-section">
                        <div class="section-header">
                            <h2><span class="section-indicator">Notification</span></h2>
                            <div class="section-divider"></div>
                        </div>
                        <p>View and manage your notification.</p>
                    </div>
                </div>
            </div>
            
            <div id="books-panel" class="content-panel">
                <div class="panel-content">
                    <div class="content-section">
                        <div class="section-header">
                            <h2><span class="section-indicator" id="books-panel-title">Books</span></h2>
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
            <h2 id="modalTitle">Edit Profile Information</h2>
            
            <div class="modal-form">
                <div class="form-group">
                    <label for="edit-email">Email</label>
                    <input type="email" id="edit-email" class="form-input">
                </div>
                
                <div class="form-group">
                    <label for="edit-firstname">First Name</label>
                    <input type="text" id="edit-firstname" class="form-input">
                </div>
                
                <div class="form-group">
                    <label for="edit-lastname">Last Name</label>
                    <input type="text" id="edit-lastname" class="form-input">
                </div>
                
                <div class="form-actions">
                    <button class="cancel-btn" id="cancel-edit-btn">Cancel</button>
                    <button class="save-btn" id="save-profile-btn">Save Changes</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Change Password Modal -->
    <div id="change-password-modal" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2 id="modalTitle">Change Password</h2>
            
            <div class="modal-form">
                <div class="form-group">
                    <label for="current-password">Current Password</label>
                    <input type="password" id="current-password" class="form-input">
                </div>
                
                <div class="form-group">
                    <label for="new-password">New Password</label>
                    <input type="password" id="new-password" class="form-input">
                </div>
                
                <div class="form-group">
                    <label for="confirm-password">Confirm New Password</label>
                    <input type="password" id="confirm-password" class="form-input">
                </div>
                
                <div class="form-actions">
                    <button class="cancel-btn" id="cancel-password-btn">Cancel</button>
                    <button class="save-btn" id="confirm-password-btn">Update Password</button>
                </div>
            </div>
        </div>
    </div>

    <script src="../user/user.js"></script>
</body>
</html>