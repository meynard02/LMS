document.addEventListener("DOMContentLoaded", function() {
    // Initialize with home panel visible
    showPanel('home');
    
    // Initialize book data
    initializeBookData();
    
    // Setup profile panel interactions
    setupProfilePanel();
    
    // Setup notification bell animation
    setupNotificationBell();
    
    // Setup password strength meter
    setupPasswordStrengthMeter();
    
    // Setup clear notifications button
    setupClearNotifications();
    
    // Setup book borrowing functionality
    setupBookBorrowing();
    
    setupFinishedReads();
    setupBooksInBag(); 
    
    // Setup search functionality
    setupSearch();
});

// Panel switching functionality
function showPanel(panelName) {
    const searchCategories = document.getElementById('searchCategories');
    
    // Hide all panels first
    document.querySelectorAll('.content-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-links a').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show or hide search and categories based on panel
    if (panelName === 'home' || panelName === 'books') {
        searchCategories.classList.remove('hidden');
    } else {
        searchCategories.classList.add('hidden');
    }
    
    // Show the requested panel
    const activePanel = document.getElementById(`${panelName}-panel`);
    if (activePanel) {
        activePanel.classList.add('active');
    }
    
    // Mark the corresponding nav item as active
    const activeTab = document.querySelector(`.nav-links a[onclick*="${panelName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // If showing profile panel, default to personal info section
    if (panelName === 'profile') {
        showProfileSection('my-borrows');
    }
}

// Profile section switching functionality
function showProfileSection(sectionId) {
    // Hide all profile sections
    document.querySelectorAll('.profile-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Deactivate all tabs
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show the selected section
    document.getElementById(`${sectionId}-section`).classList.add('active');
    
    // Activate the clicked tab
    event.currentTarget.classList.add('active');
    
    // If showing borrows, update the display
    if (sectionId === 'my-borrows') {
        updatePendingBorrowsDisplay();
    }
}

function setupFinishedReads() {
    const finishedReads = [
        { title: "Harry Potter", author: "J.K. Rowling", borrowed: "2025-04-01", returnedOverdue: false, cover: "harry-potter.jpg" },
        { title: "Physics Fundamentals", author: "Marie Curie", borrowed: "2025-03-15", returnedOverdue: true, cover: "physics.jpg" }
    ];

    const list = document.getElementById('finished-reads-list');
    finishedReads.forEach(book => {
        const item = document.createElement('div');
        item.className = 'borrow-item';

        item.innerHTML = `
            <div class="borrow-cover" style="background-image:url('../books/${book.cover}')"></div>
            <div class="borrow-info">
                <div class="borrow-title">${book.title}</div>
                <div class="borrow-author">${book.author}</div>
                <div class="borrow-meta">
                    <span class="borrow-date"><i class="fas fa-calendar-alt"></i> Borrowed: ${book.borrowed}</span>
                    ${book.returnedOverdue ? `<span class="borrow-status overdue"><i class="fas fa-exclamation-triangle"></i> Returned Overdue</span>` : `<span class="borrow-status"><i class="fas fa-check-circle"></i> Returned On Time</span>`}
                </div>
            </div>
        `;
        list.appendChild(item);
    });

    // Filter Handler
    window.filterFinishedReads = function() {
        const filter = document.getElementById('finishedFilter').value;
        const customDate = document.getElementById('customDate');
        if (filter === 'custom') {
            customDate.style.display = 'inline-block';
        } else {
            customDate.style.display = 'none';
        }
    }
}

// ========== Books In My Bag ==========
function setupBooksInBag() {
    const myBag = [
        { title: "World History", author: "Howard Zinn", borrowed: "2025-04-20", due: "2025-05-04", overdue: false, cover: "history.jpg" },
        { title: "Music Theory", author: "Beethoven", borrowed: "2025-04-05", due: "2025-04-20", overdue: true, cover: "music-theory.jpg" }
    ];

    const list = document.getElementById('books-bag-list');
    myBag.forEach(book => {
        const item = document.createElement('div');
        item.className = 'borrow-item';
        if (book.overdue) {
            document.querySelector(`button[onclick*="books-in-my-bag"] .fa-shopping-bag`).style.color = '#e74c3c'; 
        }

        item.innerHTML = `
            <div class="borrow-cover" style="background-image:url('../books/${book.cover}')"></div>
            <div class="borrow-info">
                <div class="borrow-title">${book.title}</div>
                <div class="borrow-author">${book.author}</div>
                <div class="borrow-meta">
                    <span class="borrow-date"><i class="fas fa-calendar-alt"></i> Borrowed: ${book.borrowed}</span>
                    <span class="borrow-date ${book.overdue ? 'overdue' : ''}">
                        <i class="fas fa-calendar-check"></i> Due: ${book.due}
                    </span>
                </div>
            </div>
        `;
        list.appendChild(item);
    });
}

// Book data and functionality
function initializeBookData() {
    // Sample book data for each subject with more details
    const detailedBookData = {
        science: [
            { 
                title: "Physics Fundamentals", 
                author: "Dr. Marie Curie", 
                cover: "physics.jpg",
                genre: "Science, Physics",
                description: "A comprehensive introduction to the fundamental principles of physics.",
                year: "2021",
                pages: "450",
                language: "English",
                isbn: "978-0123456789"
            },
            { 
                title: "Biology Today", 
                author: "Charles Darwin", 
                cover: "biology.jpg",
                genre: "Science, Biology",
                description: "Explore the fascinating world of living organisms.",
                year: "2020",
                pages: "380",
                language: "English",
                isbn: "978-0987654321"
            }
        ],
        filipino: [
            { 
                title: "Noli Me Tangere", 
                author: "José Rizal", 
                cover: "noli.jpg",
                genre: "Literature, Historical",
                description: "A novel exposing the abuses of the Spanish colonial government.",
                year: "1887",
                pages: "480",
                language: "Filipino",
                isbn: "978-1234567890"
            }
        ],
        pe: [
            { 
                title: "Sports Science", 
                author: "John Doe", 
                cover: "sports.jpg",
                genre: "Physical Education",
                description: "Understanding scientific principles behind athletic performance.",
                year: "2020",
                pages: "280",
                language: "English",
                isbn: "978-4567890123"
            }
        ],
        music: [
            { 
                title: "Music Theory", 
                author: "Beethoven", 
                cover: "music-theory.jpg",
                genre: "Music, Education",
                description: "Fundamental concepts of music theory.",
                year: "2018",
                pages: "240",
                language: "English",
                isbn: "978-6789012345"
            }
        ],
        english: [
            { 
                title: "Shakespeare's Works", 
                author: "William Shakespeare", 
                cover: "shakespeare.jpg",
                genre: "Literature, Drama",
                description: "Complete collection of plays and sonnets.",
                year: "2020",
                pages: "1200",
                language: "English",
                isbn: "978-8901234567"
            }
        ],
        ap: [
            { 
                title: "World History", 
                author: "Howard Zinn", 
                cover: "history.jpg",
                genre: "History, Education",
                description: "A people's history of the world.",
                year: "2015",
                pages: "720",
                language: "English",
                isbn: "978-0123456789"
            }
        ],
        fiction: [
            { 
                title: "Harry Potter", 
                author: "J.K. Rowling", 
                cover: "harry-potter.jpg",
                genre: "Fiction, Fantasy",
                description: "The story of a young wizard's adventures.",
                year: "1997",
                pages: "320",
                language: "English",
                isbn: "978-2345678901"
            }
        ],
        more: [
            { 
                title: "More Books Coming Soon", 
                author: "", 
                cover: "",
                genre: "Various",
                description: "Check back soon for more options!",
                year: "",
                pages: "",
                language: "",
                isbn: ""
            }
        ]
    };

    // Function to show book panel with specific category
    window.showBookPanel = function(category) {
        // Update panel title
        document.getElementById('books-panel-title').textContent = 
            `${category.charAt(0).toUpperCase() + category.slice(1)} Books`;
        
        // Clear existing books
        const bookGrid = document.getElementById('bookGrid');
        bookGrid.innerHTML = "";
        
        // Get books for this category or show empty message
        const books = detailedBookData[category] || [
            { 
                title: "No books available", 
                author: "", 
                cover: "",
                genre: "",
                description: "",
                year: "",
                pages: "",
                language: "",
                isbn: ""
            }
        ];
        
        // Add books to the grid
        books.forEach(book => {
            const bookCard = document.createElement("div");
            bookCard.className = "book-card";
            
            // Use icon if no cover image
            const coverContent = book.cover 
                ? `<div class="book-cover" style="background-image: url('../books/${book.cover}')"></div>`
                : `<div class="book-cover"><i class="fas fa-book book-icon"></i></div>`;
            
            bookCard.innerHTML = `
                ${coverContent}
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
            `;
            bookGrid.appendChild(bookCard);
        });
        
        // Show the books panel
        showPanel('books');
        
        // Highlight the active category tab
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active-tab');
        });
        document.querySelector(`.category-tab.${category}`).classList.add('active-tab');
    };
}

// Book Borrowing Functionality
function setupBookBorrowing() {
    // Store pending borrows in localStorage
    let pendingBorrows = JSON.parse(localStorage.getItem('pendingBorrows')) || [];
    
    // Open book details modal when a book is clicked
    document.addEventListener('click', function(e) {
        const bookCard = e.target.closest('.book-card');
        if (bookCard) {
            const bookTitle = bookCard.querySelector('.book-title').textContent;
            const category = document.querySelector('.category-tab.active-tab').className.replace('category-tab ', '').replace(' active-tab', '');
            
            // Find the book in our detailed data
            const book = initializeBookData.detailedBookData[category].find(b => b.title === bookTitle) || {
                title: bookTitle,
                author: bookCard.querySelector('.book-author').textContent,
                cover: '',
                genre: 'Unknown',
                description: 'No description available for this book.',
                year: 'Unknown',
                pages: 'Unknown',
                language: 'Unknown',
                isbn: 'Unknown'
            };
            
            showBookDetails(book);
        }
    });
    
    // Function to show book details in modal
    function showBookDetails(book) {
        document.getElementById('modal-book-title').textContent = book.title;
        document.getElementById('modal-book-author').textContent = book.author;
        document.getElementById('modal-book-genre').textContent = book.genre;
        document.getElementById('modal-book-description').textContent = book.description;
        document.getElementById('modal-book-year').textContent = book.year;
        document.getElementById('modal-book-pages').textContent = book.pages;
        document.getElementById('modal-book-language').textContent = book.language;
        document.getElementById('modal-book-isbn').textContent = book.isbn;
        
        // Set book cover
        const coverElement = document.getElementById('modal-book-cover');
        if (book.cover) {
            coverElement.style.backgroundImage = `url('../books/${book.cover}')`;
            coverElement.innerHTML = '';
        } else {
            coverElement.style.backgroundImage = '';
            coverElement.innerHTML = '<i class="fas fa-book book-icon"></i>';
        }
        
        // Set up borrow button
        const borrowBtn = document.getElementById('borrow-btn');
        const isAlreadyBorrowed = pendingBorrows.some(b => b.title === book.title);
        
        if (isAlreadyBorrowed) {
            borrowBtn.disabled = true;
            borrowBtn.innerHTML = '<i class="fas fa-check-circle"></i> Already Requested';
        } else {
            borrowBtn.disabled = false;
            borrowBtn.innerHTML = '<i class="fas fa-bookmark"></i> Borrow Book';
            borrowBtn.onclick = function() {
                borrowBook(book);
            };
        }
        
        // Show modal
        document.getElementById('book-details-modal').style.display = 'block';
    }
    
    // Function to handle book borrowing
    function borrowBook(book) {
        const borrowDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(borrowDate.getDate() + 14); // 2 weeks from now
        
        const newBorrow = {
            title: book.title,
            author: book.author,
            cover: book.cover,
            borrowDate: borrowDate.toISOString(),
            dueDate: dueDate.toISOString(),
            status: "Pending Approval"
        };
        
        pendingBorrows.push(newBorrow);
        localStorage.setItem('pendingBorrows', JSON.stringify(pendingBorrows));
        
        // Update UI
        document.getElementById('borrow-btn').disabled = true;
        document.getElementById('borrow-btn').innerHTML = '<i class="fas fa-check-circle"></i> Request Sent';
        
        // Update borrows badge
        updateBorrowsBadge();
        
        // Show success message
        showToast(`Borrow request for "${book.title}" submitted!`, 'success');
        
        // Update pending borrows display if on that panel
        if (document.getElementById('my-borrows-section').classList.contains('active')) {
            updatePendingBorrowsDisplay();
        }
    }
    
    // Function to update pending borrows display
    window.updatePendingBorrowsDisplay = function() {
        const container = document.getElementById('pending-borrows');
        const noBorrowsMessage = document.getElementById('no-borrows-message');
        
        // Clear existing borrows
        const existingBorrows = container.querySelectorAll('.borrow-item');
        existingBorrows.forEach(borrow => borrow.remove());
        
        // Show message if no borrows
        if (pendingBorrows.length === 0) {
            noBorrowsMessage.style.display = 'block';
            return;
        }
        
        noBorrowsMessage.style.display = 'none';
        
        // Add each pending borrow
        pendingBorrows.forEach((borrow, index) => {
            const borrowElement = document.createElement('div');
            borrowElement.className = 'borrow-item';
            
            // Format dates
            const borrowDate = new Date(borrow.borrowDate).toLocaleDateString();
            const dueDate = new Date(borrow.dueDate).toLocaleDateString();
            
            borrowElement.innerHTML = `
                <div class="borrow-cover" style="${borrow.cover ? `background-image: url('../books/${borrow.cover}')` : ''}">
                    ${!borrow.cover ? '<i class="fas fa-book book-icon"></i>' : ''}
                </div>
                <div class="borrow-info">
                    <div class="borrow-title">${borrow.title}</div>
                    <div class="borrow-author">${borrow.author}</div>
                    <div class="borrow-meta">
                        <span class="borrow-date"><i class="far fa-calendar-alt"></i> Borrowed: ${borrowDate}</span>
                        <span class="borrow-date"><i class="far fa-calendar-check"></i> Due: ${dueDate}</span>
                        <span class="borrow-status"><i class="fas fa-hourglass-half"></i> ${borrow.status}</span>
                    </div>
                </div>
                <button class="cancel-borrow" data-index="${index}">
                    <i class="fas fa-times"></i> Cancel
                </button>
            `;
            
            container.appendChild(borrowElement);
        });
        
        // Add event listeners to cancel buttons
        document.querySelectorAll('.cancel-borrow').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cancelBorrow(index);
            });
        });
    }
    
    // Function to cancel a borrow request
    function cancelBorrow(index) {
        const bookTitle = pendingBorrows[index].title;
        pendingBorrows.splice(index, 1);
        localStorage.setItem('pendingBorrows', JSON.stringify(pendingBorrows));
        
        // Update borrows badge
        updateBorrowsBadge();
        
        showToast(`Borrow request for "${bookTitle}" cancelled`, 'info');
        updatePendingBorrowsDisplay();
    }
    
    // Function to update borrows badge count
    function updateBorrowsBadge() {
        const navBadge = document.getElementById('borrows-badge');
        const profileBadge = document.getElementById('profile-borrows-badge');
        const pendingBorrows = JSON.parse(localStorage.getItem('pendingBorrows')) || [];
        
        if (pendingBorrows.length > 0) {
            navBadge.textContent = pendingBorrows.length;
            profileBadge.textContent = pendingBorrows.length;
            navBadge.classList.remove('hidden');
            profileBadge.classList.remove('hidden');
        } else {
            navBadge.classList.add('hidden');
            profileBadge.classList.add('hidden');
        }
    }
    
    // Initialize borrows badge
    updateBorrowsBadge();
}

// Profile Panel Functionality
function setupProfilePanel() {
    // Get DOM elements
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const editProfileModal = document.getElementById('edit-profile-modal');
    const changePasswordModal = document.getElementById('change-password-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const cancelPasswordBtn = document.getElementById('cancel-password-btn');
    const confirmPasswordBtn = document.getElementById('confirm-password-btn');

    // Edit Profile Button Click
    editProfileBtn.addEventListener('click', function() {
        // Fill modal with current data
        document.getElementById('edit-email').value = currentUser.email;
        document.getElementById('edit-firstname').value = currentUser.firstname;
        document.getElementById('edit-lastname').value = currentUser.lastname;
        
        // Show modal
        editProfileModal.style.display = 'block';
    });

    // Change Password Button Click
    changePasswordBtn.addEventListener('click', function() {
        // Clear password fields
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        
        // Reset strength meter
        document.querySelector('.strength-bar').style.width = '0';
        document.querySelector('.strength-bar').style.backgroundColor = '#e74c3c';
        
        // Show modal
        changePasswordModal.style.display = 'block';
    });

    // Close Modal Buttons
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            editProfileModal.style.display = 'none';
            changePasswordModal.style.display = 'none';
            document.getElementById('book-details-modal').style.display = 'none';
        });
    });

    // Cancel Edit Button
    cancelEditBtn.addEventListener('click', function() {
        editProfileModal.style.display = 'none';
    });

    // Save Profile Button
    saveProfileBtn.addEventListener('click', function() {
        const newEmail = document.getElementById('edit-email').value.trim();
        const newFirstname = document.getElementById('edit-firstname').value.trim();
        const newLastname = document.getElementById('edit-lastname').value.trim();
        
        // Validate email
        if (!validateEmail(newEmail)) {
            showToast('Please enter a valid email address!', 'error');
            return;
        }
        
        // Validate names
        if (!newFirstname || !newLastname) {
            showToast('First name and last name cannot be empty!', 'error');
            return;
        }
        
        // Send data to server
        fetch('update_profile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: newEmail,
                firstname: newFirstname,
                lastname: newLastname
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update profile display
                document.getElementById('profile-email').textContent = newEmail;
                document.getElementById('profile-firstname').textContent = newFirstname;
                document.getElementById('profile-lastname').textContent = newLastname;
                
                // Update currentUser object
                currentUser.email = newEmail;
                currentUser.firstname = newFirstname;
                currentUser.lastname = newLastname;
                
                // Close modal
                editProfileModal.style.display = 'none';
                
                // Show success message
                showToast('Profile updated successfully!', 'success');
            } else {
                showToast(data.message || 'Error updating profile', 'error');
            }
        })
        .catch(error => {
            showToast('Error updating profile', 'error');
            console.error('Error:', error);
        });
    });

    // Cancel Password Button
    cancelPasswordBtn.addEventListener('click', function() {
        changePasswordModal.style.display = 'none';
    });

    // Confirm Password Button
    confirmPasswordBtn.addEventListener('click', function() {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validate passwords
        if (!currentPassword) {
            showToast('Please enter your current password!', 'error');
            return;
        }
        
        if (!newPassword || newPassword.length < 8) {
            showToast('Password must be at least 8 characters!', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showToast('New passwords do not match!', 'error');
            return;
        }
        
        // Send data to server
        fetch('change_password.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currentPassword: currentPassword,
                newPassword: newPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                changePasswordModal.style.display = 'none';
                showToast('Password changed successfully!', 'success');
            } else {
                showToast(data.message || 'Error changing password', 'error');
            }
        })
        .catch(error => {
            showToast('Error changing password', 'error');
            console.error('Error:', error);
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === editProfileModal) {
            editProfileModal.style.display = 'none';
        }
        if (event.target === changePasswordModal) {
            changePasswordModal.style.display = 'none';
        }
        if (event.target === document.getElementById('book-details-modal')) {
            document.getElementById('book-details-modal').style.display = 'none';
        }
    });

    // Email validation helper
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// Notification bell animation
function setupNotificationBell() {
    const notificationBell = document.querySelector('.notification-link i');
    
    notificationBell.addEventListener('click', function(e) {
        // Prevent triggering both the click and the panel change
        e.stopPropagation();
        
        // Add temporary animation class
        this.classList.add('ringing');
        
        // Remove animation class after it completes
        setTimeout(() => {
            this.classList.remove('ringing');
        }, 1500);
        
        // Mark notifications as read
        document.querySelectorAll('.notification-item.unread').forEach(item => {
            item.classList.remove('unread');
        });
        
        // Update badge count
        document.querySelector('.notification-badge').textContent = '0';
    });
}

// Password strength meter
function setupPasswordStrengthMeter() {
    const newPasswordInput = document.getElementById('new-password');
    const strengthBar = document.querySelector('.strength-bar');
    
    newPasswordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        
        // Complexity checks
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        // Update strength bar
        const width = (strength / 5) * 100;
        strengthBar.style.width = `${width}%`;
        
        // Update color based on strength
        if (strength <= 2) {
            strengthBar.style.backgroundColor = '#e74c3c'; // Red
        } else if (strength <= 4) {
            strengthBar.style.backgroundColor = '#f39c12'; // Orange
        } else {
            strengthBar.style.backgroundColor = '#2ecc71'; // Green
        }
    });
}

// Clear notifications
function setupClearNotifications() {
    const clearBtn = document.getElementById('clear-notifications-btn');
    
    clearBtn.addEventListener('click', function() {
        const notificationsList = document.querySelector('.notifications-list');
        notificationsList.innerHTML = '<p class="no-notifications">No notifications available</p>';
        document.querySelector('.notification-badge').textContent = '0';
        showToast('All notifications cleared', 'success');
    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('book-search');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const bookCards = document.querySelectorAll('.book-card');
        
        bookCards.forEach(card => {
            const title = card.querySelector('.book-title').textContent.toLowerCase();
            const author = card.querySelector('.book-author').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || author.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Toggle password visibility
window.togglePassword = function(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Show toast notification
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;
    document.getElementById('toast-container').appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Confirm logout
function confirmLogout() {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
        // Show loading state
        document.body.style.opacity = '0.5';
        document.querySelector('.main-content').innerHTML = '<div class="logout-loading"><i class="fas fa-spinner fa-spin"></i> Logging out...</div>';
        
        // Simulate logout process
        setTimeout(() => {
            window.location.href = "../login/index.php";
        }, 1000);
    }
    return false;
}

// Make the detailedBookData available globally
initializeBookData.detailedBookData = {
    science: [
        { 
            title: "Physics Fundamentals", 
            author: "Dr. Marie Curie", 
            cover: "physics.jpg",
            genre: "Science, Physics",
            description: "A comprehensive introduction to the fundamental principles of physics.",
            year: "2021",
            pages: "450",
            language: "English",
            isbn: "978-0123456789"
        },
        { 
            title: "Biology Today", 
            author: "Charles Darwin", 
            cover: "biology.jpg",
            genre: "Science, Biology",
            description: "Explore the fascinating world of living organisms.",
            year: "2020",
            pages: "380",
            language: "English",
            isbn: "978-0987654321"
        }
    ],
    filipino: [
        { 
            title: "Noli Me Tangere", 
            author: "José Rizal", 
            cover: "noli.jpg",
            genre: "Literature, Historical",
            description: "A novel exposing the abuses of the Spanish colonial government.",
            year: "1887",
            pages: "480",
            language: "Filipino",
            isbn: "978-1234567890"
        }
    ],
    pe: [
        { 
            title: "Sports Science", 
            author: "John Doe", 
            cover: "sports.jpg",
            genre: "Physical Education",
            description: "Understanding scientific principles behind athletic performance.",
            year: "2020",
            pages: "280",
            language: "English",
            isbn: "978-4567890123"
        }
    ],
    music: [
        { 
            title: "Music Theory", 
            author: "Beethoven", 
            cover: "music-theory.jpg",
            genre: "Music, Education",
            description: "Fundamental concepts of music theory.",
            year: "2018",
            pages: "240",
            language: "English",
            isbn: "978-6789012345"
        }
    ],
    english: [
        { 
            title: "Shakespeare's Works", 
            author: "William Shakespeare", 
            cover: "shakespeare.jpg",
            genre: "Literature, Drama",
            description: "Complete collection of plays and sonnets.",
            year: "2020",
            pages: "1200",
            language: "English",
            isbn: "978-8901234567"
        }
    ],
    ap: [
        { 
            title: "World History", 
            author: "Howard Zinn", 
            cover: "history.jpg",
            genre: "History, Education",
            description: "A people's history of the world.",
            year: "2015",
            pages: "720",
            language: "English",
            isbn: "978-0123456789"
        }
    ],
    fiction: [
        { 
            title: "Harry Potter", 
            author: "J.K. Rowling", 
            cover: "harry-potter.jpg",
            genre: "Fiction, Fantasy",
            description: "The story of a young wizard's adventures.",
            year: "1997",
            pages: "320",
            language: "English",
            isbn: "978-2345678901"
        }
    ],
    more: [
        { 
            title: "More Books Coming Soon", 
            author: "", 
            cover: "",
            genre: "Various",
            description: "Check back soon for more options!",
            year: "",
            pages: "",
            language: "",
            isbn: ""
        }
    ]
};
