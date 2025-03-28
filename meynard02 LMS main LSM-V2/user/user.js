document.addEventListener("DOMContentLoaded", function() {
    // Initialize with home panel visible
    showPanel('home');
    
    // Initialize book modal functionality
    initializeBookModal();
});

// Panel switching functionality
function showPanel(panelName) {
    // Hide all panels first
    document.querySelectorAll('.content-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-links a').forEach(tab => {
        tab.classList.remove('active');
    });
    
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

// Book Modal Functionality
function initializeBookModal() {
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
        ]
    };

    // Get modal elements
    const modal = document.getElementById("bookModal");
    const modalTitle = document.getElementById("modalTitle");
    const bookGrid = document.getElementById("bookGrid");
    const closeBtn = document.querySelector(".close");

    // Function to open modal with books
    function openBookModal(subject) {
        modalTitle.textContent = `${subject.charAt(0).toUpperCase() + subject.slice(1)} Books`;
        bookGrid.innerHTML = "";
        
        const books = bookData[subject] || [
            { title: "No books available", author: "", cover: "" }
        ];
        
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
        
        modal.style.display = "block";
    }

    // Close modal when clicking X
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Make category tabs clickable
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.category-tab').forEach(t => {
                t.classList.remove('active-tab');
            });
            
            // Add active class to clicked tab
            this.classList.add('active-tab');
            
            const subject = this.className.split(' ')[1]; // Get the subject class
            openBookModal(subject);
        });
    });
}