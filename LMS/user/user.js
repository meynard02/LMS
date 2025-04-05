document.addEventListener("DOMContentLoaded", function() {
    // Initialize with home panel visible
    showPanel('home');
    
    // Initialize book data
    initializeBookData();
    
    // Setup profile panel interactions
    setupProfilePanel();
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
}

// Book data and functionality
function initializeBookData() {
    // Sample book data for each subject
    const bookData = {
        science: [
            { title: "Physics Fundamentals", author: "Dr. Marie Curie", cover: "physics.jpg" },
            { title: "Biology Today", author: "Charles Darwin", cover: "biology.jpg" }
        ],
        filipino: [
            { title: "Noli Me Tangere", author: "José Rizal", cover: "noli.jpg" },
            { title: "El Filibusterismo", author: "José Rizal", cover: "fili.jpg" }
        ],
        pe: [
            { title: "Sports Science", author: "John Doe", cover: "sports.jpg" }
        ],
        music: [
            { title: "Music Theory", author: "Beethoven", cover: "music-theory.jpg" }
        ],
        english: [
            { title: "Shakespeare's Works", author: "William Shakespeare", cover: "shakespeare.jpg" }
        ],
        ap: [
            { title: "World History", author: "Howard Zinn", cover: "history.jpg" }
        ],
        fiction: [
            { title: "Harry Potter", author: "J.K. Rowling", cover: "harry-potter.jpg" }
        ],
        more: [
            { title: "More Books Coming Soon", author: "", cover: "" }
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
        const books = bookData[category] || [
            { title: "No books available", author: "", cover: "" }
        ];
        
        // Add books to the grid
        books.forEach(book => {
            const bookCard = document.createElement("div");
            bookCard.className = "book-card";
            bookCard.innerHTML = `
                <div class="book-cover" style="background-image: url('books/${book.cover}')"></div>
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

    // Current profile data
    let currentProfile = {
        email: "xxxxxxx@spist.edu.ph",
        firstname: "Juan",
        lastname: "Dela Cruz"
    };

    // Update profile display
    function updateProfileDisplay() {
        document.getElementById('profile-email').textContent = currentProfile.email;
        document.getElementById('profile-firstname').textContent = currentProfile.firstname;
        document.getElementById('profile-lastname').textContent = currentProfile.lastname;
    }

    // Edit Profile Button Click
    editProfileBtn.addEventListener('click', function() {
        // Fill modal with current data
        document.getElementById('edit-email').value = currentProfile.email;
        document.getElementById('edit-firstname').value = currentProfile.firstname;
        document.getElementById('edit-lastname').value = currentProfile.lastname;
        
        // Show modal
        editProfileModal.style.display = 'block';
    });

    // Change Password Button Click
    changePasswordBtn.addEventListener('click', function() {
        // Clear password fields
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        
        // Show modal
        changePasswordModal.style.display = 'block';
    });

    // Close Modal Buttons
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            editProfileModal.style.display = 'none';
            changePasswordModal.style.display = 'none';
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
            alert('Please enter a valid email address!');
            return;
        }
        
        // Validate names
        if (!newFirstname || !newLastname) {
            alert('First name and last name cannot be empty!');
            return;
        }
        
        // Update profile
        currentProfile = {
            email: newEmail,
            firstname: newFirstname,
            lastname: newLastname
        };
        
        // Update display
        updateProfileDisplay();
        
        // Close modal
        editProfileModal.style.display = 'none';
        
        alert('Profile updated successfully!');
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
            alert('Please enter your current password!');
            return;
        }
        
        if (!newPassword || newPassword !== confirmPassword) {
            alert('New passwords do not match or are empty!');
            return;
        }
        
        // Here you would typically send the data to the server
        // For now, we'll just show a success message
        changePasswordModal.style.display = 'none';
        alert('Password changed successfully!');
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === editProfileModal) {
            editProfileModal.style.display = 'none';
        }
        if (event.target === changePasswordModal) {
            changePasswordModal.style.display = 'none';
        }
    });

    // Email validation helper
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

function confirmLogout() {
    if (confirm("Are you sure you want to logout?")) {
        window.location.href = "../login/index.php";
    }
    return false;
}