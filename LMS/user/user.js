document.addEventListener("DOMContentLoaded", function() {
    // Initialize with home panel visible
    showPanel('home');
    
    // Initialize book data
    initializeBookData();
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

function confirmLogout() {
    if (confirm("Are you sure you want to logout?")) {
        // Redirect to login page
        window.location.href = "../login/index.php";
    }
    return false; // Prevent default anchor behavior
}