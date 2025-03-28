// Display current date and time
const datetimeElement = document.getElementById("datetime");
if (datetimeElement) {
    setInterval(() => {
        const now = new Date();
        datetimeElement.textContent = now.toLocaleString();
    }, 1000);
}

// Navigation and Content Panel
const navLinks = document.querySelectorAll(".nav-list a");
const panelContent = document.getElementById("panelContent");

const contentTemplates = {
    'homepage': `
        <div class="content-section">
            <div class="section-header">
                <h2><span class="section-indicator">Homepage</span> Dashboard</h2>
                <div class="section-divider"></div>
            </div>
            <p>Welcome to the library management system dashboard. Here you can view system overview and quick access to important features.</p>
        </div>
    `,
    'user-management': `
        <div class="content-section">
            <div class="section-header">
                <h2><span class="section-indicator">User Management</span> Panel</h2>
                <div class="section-divider"></div>
            </div>
            <p>Manage all library users, staff accounts, and permissions in this section.</p>
        </div>
    `,
    'inventory': `
        <div class="content-section">
            <div class="section-header">
                <h2><span class="section-indicator">Inventory</span> Management</h2>
                <div class="section-divider"></div>
            </div>
            <p>View and manage your library's complete book inventory, including adding new books and updating existing records.</p>
        </div>
    `,
    'borrowing': `
        <div class="content-section">
            <div class="section-header">
                <h2><span class="section-indicator">Borrowing</span> Management</h2>
                <div class="section-divider"></div>
            </div>
            <p>Process book loans, returns, and manage due dates in this section.</p>
        </div>
    `,
    'settings': `
        <div class="content-section">
            <div class="section-header">
                <h2><span class="section-indicator">System</span> Settings</h2>
                <div class="section-divider"></div>
            </div>
            <p>Configure system preferences, library policies, and administrative settings.</p>
        </div>
    `
};

function showContent(sectionId) {
    // Update navigation active state
    navLinks.forEach(nav => nav.classList.remove("active"));
    event.target.classList.add("active");
    
    // Update content with fade animation
    panelContent.style.opacity = 0;
    setTimeout(() => {
        panelContent.innerHTML = contentTemplates[sectionId] || `
            <div class="welcome-message">
                <h2>Welcome to Library Management System</h2>
                <p>Select a menu item from the navigation to begin</p>
            </div>
        `;
        panelContent.style.opacity = 1;
    }, 300);
}

function confirmLogout() {
    let confirmation = confirm("Are you sure you want to logout?");
    if (confirmation) {
        window.location.href = "home.html";
    }
}
