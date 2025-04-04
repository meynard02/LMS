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
            <!-- Wrapped search and categories in a single container -->
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
            
            <!-- Home Panel (default visible) -->
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
            
            <!-- Profile Panel (hidden by default) -->
            <div id="profile-panel" class="content-panel">
                <div class="panel-content">
                    <div class="content-section">
                        <div class="section-header">
                            <h2><span class="section-indicator">Profile</span></h2>
                            <div class="section-divider"></div>
                        </div>
                        <p>View and manage your library's complete profile.</p>
                    </div>
                </div>
            </div>
            
            <!-- Notification Panel (hidden by default) -->
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
            
            <!-- Books Panel (hidden by default) -->
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

    <script src="../user/user.js"></script>
</body>
</html>