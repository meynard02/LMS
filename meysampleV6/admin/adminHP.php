<?php
    session_start();
    if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'admin') {
        header("Location: ../login/index.php");
        exit();
    }
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Library Management - Admin Dashboard</title>
        <link rel="stylesheet" href="../admin/adminHP.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>


    </head>

    <body>
        <div class="sidebar">
            <div class="logo">
                <img src="../photos/logo.jpg" alt="Library Logo">
                <div class="logo-text">
                    <span class="logo-title">The BookKeeper</span>
                    <span class="logo-subtitle">Admin Panel</span>
                </div>
            </div>
            
            <div class="menu">
                <div class="user-profile">
                    <div class="user-info">
                <span class="user-name"><?php 
                    echo isset($_SESSION['admin_fname']) && isset($_SESSION['admin_lname']) 
                    ? htmlspecialchars($_SESSION['admin_fname'].' '.$_SESSION['admin_lname']) 
                    : 'Admin User';
                ?></span>
                <span class="user-role">Administrator</span>
                </div>
            </div>
                
                <ul class="nav-list">
                    <li>
                        <a href="#" onclick="showContent('homepage')">
                            <i class="fas fa-home"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onclick="showPasswordModal()">
                            <i class="fas fa-users-cog"></i>
                            <span>User Management</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onclick="showContent('inventory')">
                            <i class="fas fa-book"></i>
                            <span>Book Accession</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onclick="showContent('borrowing')">
                            <i class="fas fa-exchange-alt"></i>
                            <span>Borrowing/Returns</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onclick="showContent('settings')">
                            <i class="fas fa-cog"></i>
                            <span>Library Settings</span>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="logout">
                <a href="#" onclick="confirmLogout()">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </a>
            </div>
        </div>

        <div class="main-content">
            <div class="header">
                <div class="header-left">
                    <h1>Library Management System</h1>
                    <p class="institution">Southern Philippines Institute of Science & Technology</p>
                </div>
                <div class="header-right">
                    <div class="datetime">
                        <i class="far fa-calendar-alt"></i>
                        <span id="datetime"></span>
                    </div>
                </div>
            </div>

            <div class="content-panel" id="contentPanel">
                <div class="panel-content" id="panelContent">
                    <div class="welcome-message">
                        <div class="welcome-icon">
                            <i class="fas fa-book-open"></i>
                        </div>
                        <h2>Welcome to Library Management System</h2>
                        <p>Select a menu item from the navigation to begin managing your library</p>
                        <div class="quick-stats">
                            <div class="stat-card">
                                <i class="fas fa-users"></i>
                                <h3>1,245</h3>
                                <p>Active Users</p>
                            </div>
                            <div class="stat-card">
                                <i class="fas fa-book"></i>
                                <h3>8,752</h3>
                                <p>Books in Collection</p>
                            </div>
                            <div class="stat-card">
                                <i class="fas fa-clock"></i>
                                <h3>127</h3>
                                <p>Overdue Books</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Password Modal -->
        <div id="passwordModal" class="modal">
            <div class="modal-content">
                <span class="close-modal" onclick="closeModal('passwordModal')">&times;</span>
                <h2>Enter Admin Password</h2>
                <p>Please enter the admin password to access user management:</p>
                <input type="password" id="adminPassword" placeholder="Enter password">
                <div class="modal-buttons">
                    <button class="btn btn-secondary" onclick="closeModal('passwordModal')">Cancel</button>
                    <button class="btn btn-primary" onclick="verifyPassword()">Submit</button>
                </div>
            </div>
        </div>

        <!-- User Type Selection Modal -->
        <div id="userTypeModal" class="modal">
            <div class="modal-content">
                <span class="close-modal" onclick="closeModal('userTypeModal')">&times;</span>
                <h2>Select User Type to Manage</h2>
                <div class="user-type-options">
                    <button class="user-type-btn" onclick="showUserManagement('students')">
                        <i class="fas fa-user-graduate"></i>
                        <span>Student Management</span>
                    </button>
                    <button class="user-type-btn" onclick="showUserManagement('admins')">
                        <i class="fas fa-user-shield"></i>
                        <span>Admin Management</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Inventory Management Modal -->
    <!-- Inventory Management Modal (Add Only) -->
    <div id="inventoryModal" class="modal">
        <div class="modal-content">
            <span class="close-modal" onclick="closeModal('inventoryModal')">&times;</span>
            <h2>Add New Book</h2>
            <form id="addBookForm" enctype="multipart/form-data">
                <div class="modal-scroll-container">
                    <div class="form-group">
                        <label for="addAccessionNo">Accession No.</label>
                        <input type="text" id="addAccessionNo" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="addTitle">Book Title</label>
                        <input type="text" id="addTitle" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="addAuthor">Author</label>
                        <input type="text" id="addAuthor" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="addCategory">Category</label>
                        <select id="addCategory" class="form-control" required>
                            <option value="">Select a category</option>
                            <!-- Options will be populated by JavaScript -->
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="addDescription">Book Description</label>
                        <textarea id="addDescription" class="form-control" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="addPhoto">Book Photo</label>
                        <input type="file" id="addPhoto" class="form-control" accept="image/*">
                        <small class="text-muted">Upload a cover image for the book</small>
                        <div id="addPhotoPreview" style="margin-top: 10px;"></div>
                    </div>
                    <div class="form-group">
                        <label for="addAvailability">Availability</label>
                        <select id="addAvailability" class="form-control" required>
                            <option value="Available">Available</option>
                            <option value="Checked Out">Checked Out</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Lost">Lost</option>
                        </select>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('inventoryModal')">Cancel</button>
                    <button type="submit" class="btn btn-primary">Add Book</button>
                </div>
            </form>
        </div>
    </div>

            <!-- Edit Book Modal -->
    <div id="editBookModal" class="modal">
        <div class="modal-content">
            <span class="close-modal" onclick="closeModal('editBookModal')">&times;</span>
            <h2>Edit Book Information</h2>
            <form id="editBookForm" enctype="multipart/form-data">
                <input type="hidden" id="editBookId">
                <div class="modal-scroll-container">
                    <div class="form-group">
                        <label for="editAccessionNo">Accession No.</label>
                        <input type="text" id="editAccessionNo" class="form-control" readonly>
                    </div>
                    <div class="form-group">
                        <label for="editTitle">Book Title</label>
                        <input type="text" id="editTitle" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="editAuthor">Author</label>
                        <input type="text" id="editAuthor" class="form-control" required>
                    </div>
                    
                    <!-- And in the edit form: -->
                    <div class="form-group">
                        <label for="editCategory">Category</label>
                        <select id="editCategory" class="form-control" required>
                            <option value="">Select a category</option>
                            <!-- Options will be populated by JavaScript -->
                        </select>
                    </>
                    
                    <div class="form-group">
                        <label for="editDescription">Book Description</label>
                        <textarea id="editDescription" class="form-control" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="editPhoto">Book Photo</label>
                        <input type="file" id="editPhoto" class="form-control" accept="image/*">
                        <small class="text-muted">Upload a cover image for the book</small>
                        <div id="editPhotoPreview" style="margin-top: 10px;"></div>
                    </div>
                    <div class="form-group">
                        <label for="editAvailability">Availability</label>
                        <select id="editAvailability" class="form-control" required>
                            <option value="Available">Available</option>
                            <option value="Checked Out">Checked Out</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Lost">Lost</option>
                        </select>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('editBookModal')">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </div>
            </form>
        </div>
    </div>


        <!-- Borrowing Management Modal -->
        <div id="borrowingModal" class="modal">
            <div class="modal-content">
                <span class="close-modal" onclick="closeModal('borrowingModal')">&times;</span>
                <h2>Update Borrowing Status</h2>
                <form id="updateBorrowingForm">
                    <input type="hidden" id="borrowingId">
                    <div class="form-group">
                        <label for="borrowingStatus">Status</label>
                        <select id="borrowingStatus" class="form-control" required>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>  
                            <option value="Returned">Returned</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="dueDate">Due Date</label>
                        <input type="date" id="dueDate" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="returnDate">Return Date</label>
                        <input type="date" id="returnDate" class="form-control">
                    </div>
                    <div class="modal-buttons">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('borrowingModal')">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Status</button>
                    </div>
                </form>
            </div>
        </div>
        
        
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <script src="../admin/adminHP.js"></script>
        <script src="../js/autoLogout.js"></script>
    </body>
    </html>