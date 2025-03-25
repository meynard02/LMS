        // Display current date and time
        const datetimeElement = document.getElementById("datetime");
        setInterval(() => {
            const now = new Date();
            datetimeElement.textContent = now.toLocaleString();
        }, 1000);

        // JavaScript to handle active state
        const navLinks = document.querySelectorAll(".nav-list a");
    
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                // Remove the active class from all links
                navLinks.forEach(nav => nav.classList.remove("active"));
                
                // Add the active class to the clicked link
                link.classList.add("active");
            });
        });