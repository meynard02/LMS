// Display current date and time with better formatting
function updateDateTime() {
    const datetimeElement = document.getElementById("datetime");
    if (datetimeElement) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        datetimeElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Initialize and update every second
updateDateTime();
setInterval(updateDateTime, 1000);

// Modal functions
function showPasswordModal() {
    document.getElementById('passwordModal').style.display = 'block';
}

function showUserTypeModal() {
    document.getElementById('userTypeModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Verify admin password
function verifyPassword() {
    const password = document.getElementById('adminPassword').value;
    const correctPassword = "admin123"; // Default password
    
    if (password === correctPassword) {
        closeModal('passwordModal');
        showUserTypeModal();
        document.getElementById('adminPassword').value = ''; // Clear the password field
    } else {
        Swal.fire({
            title: 'Incorrect Password',
            text: 'The password you entered is incorrect. Please try again.',
            icon: 'error',
            confirmButtonColor: '#036d2b'
        });
    }
}

// Show user management section based on type
function showUserManagement(userType) {
    closeModal('userTypeModal');
    
    let content = '';
    const title = userType === 'students' ? 'Student Management' : 'Admin Management';
    
    content = `
        <div class="content-section">
            <div class="section-header">
                <h2><span class="section-indicator">${title}</span></h2>
                <div class="section-divider"></div>
            </div>
            
            <div class="action-bar">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchUsers" placeholder="Search ${userType}...">
                </div>
                <button class="btn btn-primary" onclick="showAddUserModal('${userType}')">
                    <i class="fas fa-plus"></i> Add New ${userType === 'students' ? 'Student' : 'Admin'}
                </button>
            </div>
            
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="userTableBody">
                        <!-- Users will be loaded here from database -->
                    </tbody>
                </table>
            </div>
            
            <div class="pagination">
                <button class="btn-pagination"><i class="fas fa-chevron-left"></i></button>
                <span class="page-active">1</span>
                <span>2</span>
                <span>3</span>
                <button class="btn-pagination"><i class="fas fa-chevron-right"></i></button>
            </div>
        </div>
    `;
    
    // Update content with fade animation
    const panelContent = document.getElementById("panelContent");
    panelContent.style.opacity = 0;
    setTimeout(() => {
        panelContent.innerHTML = content;
        panelContent.style.opacity = 1;
        
        // Load users from database (placeholder for your actual implementation)
        loadUsers(userType);
    }, 300);
}

// Function to load users from database (placeholder - connect to your backend)
function loadUsers(userType) {
    // This is where you would connect to your database via AJAX/fetch
    // For now, we'll use sample data
    
    const sampleData = {
        students: [
            { email: "student1@example.com", firstName: "John", lastName: "Doe", status: "active" },
            { email: "student2@example.com", firstName: "Jane", lastName: "Smith", status: "active" },
            { email: "student3@example.com", firstName: "Michael", lastName: "Johnson", status: "suspended" }
        ],
        admins: [
            { email: "admin1@example.com", firstName: "Sarah", lastName: "Williams", status: "active" },
            { email: "admin2@example.com", firstName: "David", lastName: "Brown", status: "active" }
        ]
    };
    
    const tableBody = document.getElementById("userTableBody");
    tableBody.innerHTML = '';
    
    sampleData[userType].forEach(user => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${user.email}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td><span class="badge ${user.status === 'active' ? 'badge-success' : 'badge-danger'}">${user.status}</span></td>
            <td>
                <button class="btn-icon" onclick="editUser('${user.email}', '${userType}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="toggleUserStatus('${user.email}', '${user.status}', '${userType}')">
                    <i class="fas ${user.status === 'active' ? 'fa-user-slash' : 'fa-user-check'}"></i>
                </button>
                <button class="btn-icon" onclick="confirmDeleteUser('${user.email}', '${userType}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// User management functions
function editUser(email, userType) {
    Swal.fire({
        title: 'Edit User',
        html: `
            <div class="swal2-form">
                <input type="email" id="editEmail" class="swal2-input" placeholder="Email" value="${email}">
                <input type="text" id="editFirstName" class="swal2-input" placeholder="First Name">
                <input type="text" id="editLastName" class="swal2-input" placeholder="Last Name">
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Save Changes',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
            // Here you would send the updated data to your backend
            return {
                email: document.getElementById('editEmail').value,
                firstName: document.getElementById('editFirstName').value,
                lastName: document.getElementById('editLastName').value
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // In a real app, you would send this data to your server
            Swal.fire({
                title: 'Success!',
                text: 'User information has been updated.',
                icon: 'success',
                confirmButtonColor: '#036d2b'
            }).then(() => {
                loadUsers(userType); // Refresh the user list
            });
        }
    });
}

function toggleUserStatus(email, currentStatus, userType) {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const action = currentStatus === 'active' ? 'suspend' : 'activate';
    
    Swal.fire({
        title: `Confirm ${action}`,
        text: `Are you sure you want to ${action} this user?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#036d2b',
        cancelButtonColor: '#6c757d',
        confirmButtonText: `Yes, ${action}`,
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // In a real app, you would send this update to your server
            Swal.fire({
                title: 'Success!',
                text: `User has been ${action}ed.`,
                icon: 'success',
                confirmButtonColor: '#036d2b'
            }).then(() => {
                loadUsers(userType); // Refresh the user list
            });
        }
    });
}

function confirmDeleteUser(email, userType) {
    Swal.fire({
        title: 'Delete User',
        text: `Are you sure you want to permanently delete ${email}? This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        dangerMode: true
    }).then((result) => {
        if (result.isConfirmed) {
            // In a real app, you would send this delete request to your server
            Swal.fire({
                title: 'Deleted!',
                text: 'The user has been deleted.',
                icon: 'success',
                confirmButtonColor: '#036d2b'
            }).then(() => {
                loadUsers(userType); // Refresh the user list
            });
        }
    });
}

function showAddUserModal(userType) {
    Swal.fire({
        title: `Add New ${userType === 'students' ? 'Student' : 'Admin'}`,
        html: `
            <div class="swal2-form">
                <input type="email" id="newEmail" class="swal2-input" placeholder="Email">
                <input type="text" id="newFirstName" class="swal2-input" placeholder="First Name">
                <input type="text" id="newLastName" class="swal2-input" placeholder="Last Name">
                <input type="password" id="newPassword" class="swal2-input" placeholder="Password">
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Add User',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
            return {
                email: document.getElementById('newEmail').value,
                firstName: document.getElementById('newFirstName').value,
                lastName: document.getElementById('newLastName').value,
                password: document.getElementById('newPassword').value
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // In a real app, you would send this data to your server
            Swal.fire({
                title: 'Success!',
                text: 'New user has been added.',
                icon: 'success',
                confirmButtonColor: '#036d2b'
            }).then(() => {
                loadUsers(userType); // Refresh the user list
            });
        }
    });
}

// Inventory Management Functions
let currentBooks = [];
let currentSortField = 'accessionNo';
let currentSortOrder = 'asc';
let currentPage = 1;
const booksPerPage = 10;

// Load books from database
async function loadBooks() {
    try {
        // In a real application, you would fetch from your backend API
        // const response = await fetch('/api/books');
        // currentBooks = await response.json();
        
        // Mock data for demonstration
        currentBooks = [
            { id: 1, accessionNo: 'LIB-2023-001', title: 'Introduction to Computer Science', author: 'John Doe', availability: 'Available' },
            { id: 2, accessionNo: 'LIB-2023-002', title: 'Advanced JavaScript', author: 'Jane Smith', availability: 'Checked Out' },
            { id: 3, accessionNo: 'LIB-2023-003', title: 'Database Systems', author: 'Michael Johnson', availability: 'Available' },
            { id: 4, accessionNo: 'LIB-2023-004', title: 'Web Development', author: 'Sarah Williams', availability: 'On Hold' },
            { id: 5, accessionNo: 'LIB-2023-005', title: 'Data Structures', author: 'David Brown', availability: 'Available' },
            { id: 6, accessionNo: 'LIB-2023-006', title: 'Algorithms', author: 'Robert Taylor', availability: 'Lost' },
            { id: 7, accessionNo: 'LIB-2023-007', title: 'Machine Learning', author: 'Emily Davis', availability: 'Available' },
            { id: 8, accessionNo: 'LIB-2023-008', title: 'Artificial Intelligence', author: 'James Wilson', availability: 'Checked Out' },
            { id: 9, accessionNo: 'LIB-2023-009', title: 'Computer Networks', author: 'Patricia Moore', availability: 'Available' },
            { id: 10, accessionNo: 'LIB-2023-010', title: 'Operating Systems', author: 'Richard Anderson', availability: 'Available' },
            { id: 11, accessionNo: 'LIB-2023-011', title: 'Software Engineering', author: 'Jennifer Thomas', availability: 'On Hold' },
            { id: 12, accessionNo: 'LIB-2023-012', title: 'Computer Architecture', author: 'Charles Jackson', availability: 'Available' }
        ];
        
        renderBooks();
    } catch (error) {
        console.error('Error loading books:', error);
        Swal.fire({
            title: 'Error!',
            text: 'Failed to load books. Please try again.',
            icon: 'error',
            confirmButtonColor: '#036d2b'
        });
    }
}

// Render books to the table
function renderBooks() {
    const tableBody = document.getElementById('inventoryTableBody');
    tableBody.innerHTML = '';
    
    // Sort books
    const sortedBooks = [...currentBooks].sort((a, b) => {
        if (a[currentSortField] < b[currentSortField]) {
            return currentSortOrder === 'asc' ? -1 : 1;
        }
        if (a[currentSortField] > b[currentSortField]) {
            return currentSortOrder === 'asc' ? 1 : -1;
        }
        return 0;
    });
    
    // Pagination
    const startIndex = (currentPage - 1) * booksPerPage;
    const paginatedBooks = sortedBooks.slice(startIndex, startIndex + booksPerPage);
    
    // Update current page display
    document.getElementById('currentPage').textContent = currentPage;
    
    // Populate table
    paginatedBooks.forEach(book => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${book.accessionNo}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td><span class="badge ${getAvailabilityBadgeClass(book.availability)}">${book.availability}</span></td>
            <td>
                <button class="btn-icon" onclick="editBook(${book.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="confirmDeleteBook(${book.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Get badge class based on availability status
function getAvailabilityBadgeClass(status) {
    switch(status) {
        case 'Available': return 'badge-available';
        case 'Checked Out': return 'badge-checkedout';
        case 'On Hold': return 'badge-onhold';
        case 'Lost': return 'badge-lost';
        default: return 'badge-available';
    }
}

// Sort books
function sortBooks(field, order) {
    currentSortField = field;
    currentSortOrder = order;
    renderBooks();
    
    // Update active sort button
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

// Search books
function searchBooks() {
    const searchTerm = document.getElementById('searchBooks').value.toLowerCase();
    
    if (searchTerm === '') {
        renderBooks();
        return;
    }
    
    const filteredBooks = currentBooks.filter(book => 
        book.accessionNo.toLowerCase().includes(searchTerm) ||
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.availability.toLowerCase().includes(searchTerm)
    );
    
    const tableBody = document.getElementById('inventoryTableBody');
    tableBody.innerHTML = '';
    
    filteredBooks.forEach(book => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${book.accessionNo}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td><span class="badge ${getAvailabilityBadgeClass(book.availability)}">${book.availability}</span></td>
            <td>
                <button class="btn-icon" onclick="editBook(${book.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="confirmDeleteBook(${book.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Pagination
function nextPage() {
    const totalPages = Math.ceil(currentBooks.length / booksPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderBooks();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderBooks();
    }
}

// Edit book
function editBook(bookId) {
    const book = currentBooks.find(b => b.id === bookId);
    if (!book) return;
    
    document.getElementById('editBookId').value = book.id;
    document.getElementById('editAccessionNo').value = book.accessionNo;
    document.getElementById('editTitle').value = book.title;
    document.getElementById('editAuthor').value = book.author;
    document.getElementById('editAvailability').value = book.availability;
    
    document.getElementById('inventoryModal').style.display = 'block';
}

// Handle form submission
document.getElementById('editBookForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const bookId = parseInt(document.getElementById('editBookId').value);
    const updatedBook = {
        accessionNo: document.getElementById('editAccessionNo').value,
        title: document.getElementById('editTitle').value,
        author: document.getElementById('editAuthor').value,
        availability: document.getElementById('editAvailability').value
    };
    
    // In a real application, you would send this to your backend API
    // fetch(`/api/books/${bookId}`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(updatedBook)
    // })
    
    // For demo purposes, update locally
    const index = currentBooks.findIndex(b => b.id === bookId);
    if (index !== -1) {
        currentBooks[index] = { ...currentBooks[index], ...updatedBook };
        renderBooks();
        closeModal('inventoryModal');
        
        Swal.fire({
            title: 'Success!',
            text: 'Book information has been updated.',
            icon: 'success',
            confirmButtonColor: '#036d2b'
        });
    }
});

// Delete book
function confirmDeleteBook(bookId) {
    Swal.fire({
        title: 'Delete Book',
        text: 'Are you sure you want to delete this book? This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        dangerMode: true
    }).then((result) => {
        if (result.isConfirmed) {
            // In a real application, you would send a DELETE request to your API
            // fetch(`/api/books/${bookId}`, { method: 'DELETE' })
            
            // For demo purposes, delete locally
            currentBooks = currentBooks.filter(book => book.id !== bookId);
            renderBooks();
            
            Swal.fire({
                title: 'Deleted!',
                text: 'The book has been deleted.',
                icon: 'success',
                confirmButtonColor: '#036d2b'
            });
        }
    });
}

// Add new book
function showAddBookModal() {
    // Reset form
    document.getElementById('editBookForm').reset();
    document.getElementById('editBookId').value = '';
    
    // Change modal title
    document.querySelector('#inventoryModal h2').textContent = 'Add New Book';
    
    document.getElementById('inventoryModal').style.display = 'block';
}

// Navigation and Content Panel
const navLinks = document.querySelectorAll(".nav-list a");
const panelContent = document.getElementById("panelContent");

// Content templates
const contentTemplates = {
    'homepage': `
        <div class="content-section">
            <div class="section-header">
                <h2><span class="section-indicator">Dashboard</span> Overview</h2>
                <div class="section-divider"></div>
            </div>
            <p>Welcome to the library management system dashboard.</p>
        </div>
    `,
    'inventory': `
        <div class="content-section">
            <div class="section-header">
                <h2><span class="section-indicator">Inventory</span> Management</h2>
                <div class="section-divider"></div>
            </div>
            
            <div class="action-bar">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchBooks" placeholder="Search books..." onkeyup="searchBooks()">
                </div>
                <button class="btn btn-primary" onclick="showAddBookModal()">
                    <i class="fas fa-plus"></i> Add New Book
                </button>
            </div>
            
            <div class="sort-options">
                <button class="sort-btn" onclick="sortBooks('accessionNo', 'asc')">
                    <i class="fas fa-sort-amount-up"></i> Accession No.
                </button>
                <button class="sort-btn" onclick="sortBooks('title', 'asc')">
                    <i class="fas fa-sort-alpha-down"></i> Title
                </button>
                <button class="sort-btn" onclick="sortBooks('author', 'asc')">
                    <i class="fas fa-sort-alpha-down"></i> Author
                </button>
            </div>
            
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Accession No.</th>
                            <th>Book Title</th>
                            <th>Author</th>
                            <th>Availability</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="inventoryTableBody">
                        <!-- Books will be loaded here from database -->
                    </tbody>
                </table>
            </div>
            
            <div class="pagination">
                <button class="btn-pagination" onclick="prevPage()"><i class="fas fa-chevron-left"></i></button>
                <span id="currentPage">1</span>
                <button class="btn-pagination" onclick="nextPage()"><i class="fas fa-chevron-right"></i></button>
            </div>
        </div>
    `,
    'borrowing': `
        <div class="content-section">
            <div class="section-header">
                <h2><span class="section-indicator">Borrowing</span> Management</h2>
                <div class="section-divider"></div>
            </div>
            <p>Manage book loans and returns here.</p>
        </div>
    `,
    'settings': `
        <div class="content-section">
            <div class="section-header">
                <h2><span class="section-indicator">System</span> Settings</h2>
                <div class="section-divider"></div>
            </div>
            <p>Configure system preferences and settings here.</p>
        </div>
    `
};

function showContent(sectionId) {
    // Update navigation active state
    navLinks.forEach(nav => nav.classList.remove("active"));
    event.currentTarget.classList.add("active");
    
    // Show loading state
    panelContent.innerHTML = `
        <div class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading content...</p>
        </div>
    `;
    
    setTimeout(() => {
        panelContent.style.opacity = 0;
        setTimeout(() => {
            panelContent.innerHTML = contentTemplates[sectionId] || `
                <div class="welcome-message">
                    <div class="welcome-icon">
                        <i class="fas fa-book-open"></i>
                    </div>
                    <h2>Welcome to Library Management System</h2>
                    <p>Select a menu item from the navigation to begin</p>
                </div>
            `;
            panelContent.style.opacity = 1;
            
            // Initialize specific section content
            if (sectionId === 'inventory') {
                loadBooks();
            }
        }, 300);
    }, 500);
}

// Enhanced logout function
function confirmLogout() {
    Swal.fire({
        title: 'Logout Confirmation',
        text: 'Are you sure you want to logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#036d2b',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // Show loading state
            Swal.fire({
                title: 'Logging out...',
                timer: 1000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                }
            }).then(() => {
                // Redirect to login page
                window.location.href = "../login/index.php";
            });
        }
    });
}

// Add event listener to logout link
document.querySelector('.logout a').addEventListener('click', function(e) {
    e.preventDefault();
    confirmLogout();
});

// Initialize tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', showTooltip);
        el.addEventListener('mouseleave', hideTooltip);
    });
}

// Document ready
document.addEventListener('DOMContentLoaded', function() {
    initTooltips();
});