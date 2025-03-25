// script.js

// Display current date and time
const datetimeElement = document.getElementById("datetime");
if (datetimeElement) {  // Only run if datetime element exists
    setInterval(() => {
        const now = new Date();
        datetimeElement.textContent = now.toLocaleString();
    }, 1000);
}

// Navigation active state handling
const navLinks = document.querySelectorAll(".nav-list a");
navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default link behavior
        
        // Remove active class from all links
        navLinks.forEach(nav => nav.classList.remove("active"));
        
        // Add active class to clicked link
        link.classList.add("active");
    });
});
