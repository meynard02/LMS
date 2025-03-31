<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Library Management</title>
    <link rel="stylesheet" href="../admin/adminHP.css">
</head>

<body>
    <div class="sidebar">
        <div class="logo">
            <img src="../photos/logo.jpg" alt="Logo">
            <span>The BookKeeper</span>
        </div>
        <div class="menu">

            
            <ul class="nav-list">
                <li><a href="#" onclick="showContent('homepage')">Homepage</a></li>
                <li><a href="#" onclick="showContent('user-management')">User Management</a></li>
                <li><a href="#" onclick="showContent('inventory')">Book & Inventory Management</a></li>
                <li><a href="#" onclick="showContent('borrowing')">Book Borrowing & Returning</a></li>
                <li><a href="#" onclick="showContent('settings')">System Settings</a></li>
            </ul>

            <div class="logout">
                <a href="#" onclick="confirmLogout">Logout</a>
            </div>
        </div>
    </div>

    <div class="main-content">
        <div class="header">
            <div>
                <h1>Library Management System</h1>
                <p class="institution">Southern Philippines Institute of Science & Technology</p>
            </div>
            <div class="datetime">
                <p id="datetime"></p>
            </div>
        </div>

        <!-- Content Panel -->
        <div class="content-panel" id="contentPanel">
            <div class="panel-content" id="panelContent">
                <div class="welcome-message">
                    <h2>Welcome to Library Management System</h2>
                    <p>Select a menu item from the navigation to begin</p>
                </div>
            </div>
        </div>
    </div>
    <script src="../admin/adminHP.js"></script>
</body>
</html>
