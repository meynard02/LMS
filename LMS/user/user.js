document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".menu-icon");
    const navLinks = document.querySelector(".nav-links");

    menuIcon.addEventListener("click", function () {
        navLinks.classList.toggle("active");  // ✅ Toggles "active" class
    });
});
function myFunction(x) {
    x.classList.toggle("change");
  }

// Hamburger menu functionality
document.querySelector('.hamburger-menu').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
    
    // Add animation to hamburger menu
    const bars = document.querySelectorAll('.hamburger-menu .bar');
    if (navLinks.classList.contains('active')) {
        bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
}

// Make category tabs clickable with visual feedback
document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove active class from all tabs
        document.querySelectorAll('.category-tab').forEach(t => {
            t.classList.remove('active-tab');
        });
        
        // Add active class to clicked tab
        this.classList.add('active-tab');
        
        // You can add your tab functionality here
        console.log(`Selected: ${this.textContent}`);
    });
});
// Sample book data for each subject
const bookData = {
    science: [
        { title: "Physics Fundamentals", author: "Dr. Marie Curie", cover: "physics.jpg" },
        { title: "Biology Today", author: "Charles Darwin", cover: "biology.jpg" },
        { title: "Chemistry Essentials", author: "Marie Curie", cover: "chemistry.jpg" },
        { title: "Astronomy Guide", author: "Neil deGrasse Tyson", cover: "astronomy.jpg" }
    ],
    filipino: [
        { title: "Noli Me Tangere", author: "José Rizal", cover: "noli.jpg" },
        { title: "El Filibusterismo", author: "José Rizal", cover: "fili.jpg" },
        { title: "Florante at Laura", author: "Francisco Balagtas", cover: "florante.jpg" }
    ],
    pe: [
        { title: "Sports Science", author: "John Doe", cover: "sports.jpg" },
        { title: "Healthy Living", author: "Jane Smith", cover: "health.jpg" }
    ],
    music: [
        { title: "Music Theory", author: "Beethoven", cover: "music-theory.jpg" },
        { title: "Guitar Basics", author: "Jimmy Page", cover: "guitar.jpg" }
    ],
    english: [
        { title: "Shakespeare's Works", author: "William Shakespeare", cover: "shakespeare.jpg" },
        { title: "Modern Literature", author: "J.K. Rowling", cover: "literature.jpg" }
    ],
    ap: [
        { title: "World History", author: "Howard Zinn", cover: "history.jpg" },
        { title: "Philippine History", author: "Renato Constantino", cover: "ph-history.jpg" }
    ],
    fiction: [
        { title: "Harry Potter", author: "J.K. Rowling", cover: "harry-potter.jpg" },
        { title: "Lord of the Rings", author: "J.R.R. Tolkien", cover: "lotr.jpg" }
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
        const subject = this.className.split(' ')[1]; // Get the subject class
        openBookModal(subject);
    });
});

// Keep your existing toggleMenu function
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
    
    const bars = document.querySelectorAll('.hamburger-menu .bar');
    if (navLinks.classList.contains('active')) {
        bars[0].style.transform = 'translate(0, 11px) rotate(-45deg)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'translate(0, -11px) rotate(45deg)';
    } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
}