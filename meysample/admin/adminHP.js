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
    
    // Only show add button for admin management
    const addButton = userType === 'admins' ? 
        `<button class="btn btn-primary" onclick="showAddUserModal('${userType}')">
            <i class="fas fa-plus"></i> Add New ${userType === 'students' ? 'Student' : 'Admin'}
        </button>` : '';
    
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
                ${addButton}
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
async function loadUsers(userType) {
    try {
        const response = await fetch(`fetch_${userType}.php`);
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to load users');
        }
        
        const tableBody = document.getElementById("userTableBody");
        tableBody.innerHTML = '';
        
        data.data.forEach(user => {
            const row = document.createElement('tr');
            
            // Use the correct field names based on userType
            const email = userType === 'students' ? user.Email : user.AdminEmail;
            const firstName = userType === 'students' ? user.FirstName : user.AdminFName;
            const lastName = userType === 'students' ? user.LastName : user.AdminLName;
            const identifier = userType === 'students' ? user.Email : user.AdminID;
            
            row.innerHTML = `
                <td>${email}</td>
                <td>${firstName}</td>
                <td>${lastName}</td>
                <td><span class="badge ${user.Status === 'active' ? 'badge-success' : 'badge-danger'}">${user.Status}</span></td>
                <td>
                    <button class="btn-icon" onclick="${userType === 'students' ? `editUser('${identifier}', 'students')` : `editAdmin('${identifier}', 'admins')`}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="${userType === 'students' ? `toggleUserStatus('${identifier}', '${user.Status}', 'students')` : `toggleAdminStatus('${identifier}', '${user.Status}', 'admins')`}">
                        <i class="fas ${user.Status === 'active' ? 'fa-user-slash' : 'fa-user-check'}"></i>
                    </button>
                    <button class="btn-icon" onclick="${userType === 'students' ? `confirmDeleteUser('${identifier}', 'students')` : `confirmDeleteAdmin('${identifier}', 'admins')`}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading users:', error);
        Swal.fire({
            title: 'Error!',
            text: 'Failed to load users. Please try again.',
            icon: 'error',
            confirmButtonColor: '#036d2b'
        });
    }
}

// Updated editUser function
async function editUser(email, userType) {
    try {
        // First fetch current user data
        const response = await fetch(`fetch_${userType}.php?search=${encodeURIComponent(email)}`);
        const userData = await response.json();
        
        if (!userData.success || !userData.data[0]) {
            throw new Error('Failed to fetch user data');
        }
        
        const user = userData.data[0];
        
        const { value: formValues } = await Swal.fire({
            title: 'Edit User',
            html: `
                <div class="swal2-form">
                    <input type="email" id="editEmail" class="swal2-input" placeholder="Email" value="${user.Email}">
                    <input type="text" id="editFirstName" class="swal2-input" placeholder="First Name" value="${user.FirstName}">
                    <input type="text" id="editLastName" class="swal2-input" placeholder="Last Name" value="${user.LastName}">
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Save Changes',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                return {
                    email: document.getElementById('editEmail').value,
                    firstName: document.getElementById('editFirstName').value,
                    lastName: document.getElementById('editLastName').value
                };
            }
        });
        
        if (formValues) {
            const updateResponse = await fetch('student_operations.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'update',
                    userType: userType,
                    email: email,
                    newEmail: formValues.email,
                    firstName: formValues.firstName,
                    lastName: formValues.lastName
                })
            });
            
            const updateResult = await updateResponse.json();
            
            if (!updateResult.success) {
                throw new Error(updateResult.error || 'Update failed');
            }
            
            await Swal.fire({
                title: 'Success!',
                text: 'User information has been updated.',
                icon: 'success',
                confirmButtonColor: '#036d2b'
            });
            
            loadUsers(userType);
        }
    } catch (error) {
        console.error('Error editing user:', error);
        Swal.fire({
            title: 'Error!',
            text: error.message || 'Failed to update user.',
            icon: 'error',
            confirmButtonColor: '#036d2b'
        });
    }
}

// Updated toggleUserStatus function
async function toggleUserStatus(email, currentStatus, userType) {
    try {
        const result = await Swal.fire({
            title: `Confirm ${currentStatus === 'Active' ? 'Suspend' : 'Activate'}`,
            text: `Are you sure you want to ${currentStatus === 'Active' ? 'Suspend' : 'Activate'} this user?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#036d2b',
            cancelButtonColor: '#6c757d',
            confirmButtonText: `Yes, ${currentStatus === 'Active' ? 'Suspend' : 'Activate'}`,
            cancelButtonText: 'Cancel'
        });
        
        if (result.isConfirmed) {
            const response = await fetch('student_operations.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'toggleStatus',
                    userType: userType,
                    email: email,
                    currentStatus: currentStatus
                })
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Status update failed');
            }
            
            await Swal.fire({
                title: 'Success!',
                text: `User has been ${data.newStatus === 'Active' ? 'Activated' : 'Suspended'}.`,
                icon: 'success',
                confirmButtonColor: '#036d2b'
            });
            
            loadUsers(userType);
        }
    } catch (error) {
        console.error('Error toggling user status:', error);
        Swal.fire({
            title: 'Error!',
            text: error.message || 'Failed to update user status.',
            icon: 'error',
            confirmButtonColor: '#036d2b'
        });
    }
}

// Updated confirmDeleteUser function
async function confirmDeleteUser(email, userType) {
    try {
        const result = await Swal.fire({
            title: 'Delete User',
            text: 'Are you sure you want to permanently delete this user? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            dangerMode: true
        });
        
        if (result.isConfirmed) {
            const response = await fetch('student_operations.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'delete',
                    userType: userType,
                    email: email
                })
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Delete failed');
            }
            
            await Swal.fire({
                title: 'Deleted!',
                text: 'The user has been deleted.',
                icon: 'success',
                confirmButtonColor: '#036d2b'
            });
            
            loadUsers(userType);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        Swal.fire({
            title: 'Error!',
            text: error.message || 'Failed to delete user.',
            icon: 'error',
            confirmButtonColor: '#036d2b'
        });
    }
}

// Search students function
async function searchStudents(searchTerm) {
    try {
        const response = await fetch(`fetch_students.php?search=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Search failed');
        }
        
        const tableBody = document.getElementById("userTableBody");
        tableBody.innerHTML = '';
        
        data.data.forEach(user => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${user.Email}</td>
                <td>${user.FirstName}</td>
                <td>${user.LastName}</td>
                <td><span class="badge ${user.Status === 'active' ? 'badge-success' : 'badge-danger'}">${user.Status}</span></td>
                <td>
                    <button class="btn-icon" onclick="editUser('${user.Email}', 'students')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="toggleUserStatus('${user.Email}', '${user.Status}', 'students')">
                        <i class="fas ${user.Status === 'active' ? 'fa-user-slash' : 'fa-user-check'}"></i>
                    </button>
                    <button class="btn-icon" onclick="confirmDeleteUser('${user.Email}', 'students')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error searching students:', error);
    }
}

// Search admins function
async function searchAdmins(searchTerm) {
    try {
        const response = await fetch(`fetch_admins.php?search=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Search failed');
        }
        
        const tableBody = document.getElementById("userTableBody");
        tableBody.innerHTML = '';
        
        data.data.forEach(admin => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${admin.AdminEmail}</td>
                <td>${admin.AdminFName}</td>
                <td>${admin.AdminLName}</td>
                <td><span class="badge ${admin.Status === 'active' ? 'badge-success' : 'badge-danger'}">${admin.Status}</span></td>
                <td>
                    <button class="btn-icon" onclick="editAdmin('${admin.AdminID}', 'admins')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="toggleAdminStatus('${admin.AdminID}', '${admin.Status}', 'admins')">
                        <i class="fas ${admin.Status === 'active' ? 'fa-user-slash' : 'fa-user-check'}"></i>
                    </button>
                    <button class="btn-icon" onclick="confirmDeleteAdmin('${admin.AdminID}', 'admins')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error searching admins:', error);
    }
}

// Function to load admins from database
async function loadAdmins() {
    try {
        const response = await fetch('fetch_admins.php');
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to load admins');
        }
        
        const tableBody = document.getElementById("userTableBody");
        tableBody.innerHTML = '';
        
        data.data.forEach(admin => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${admin.AdminEmail}</td>
                <td>${admin.AdminFName}</td>
                <td>${admin.AdminLName}</td>
                <td><span class="badge ${admin.Status === 'active' ? 'badge-success' : 'badge-danger'}">${admin.Status}</span></td>
                <td>
                    <button class="btn-icon" onclick="editAdmin('${admin.AdminID}', 'admins')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="toggleAdminStatus('${admin.AdminID}', '${admin.Status}', 'admins')">
                        <i class="fas ${admin.Status === 'active' ? 'fa-user-slash' : 'fa-user-check'}"></i>
                    </button>
                    <button class="btn-icon" onclick="confirmDeleteAdmin('${admin.AdminID}', 'admins')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading admins:', error);
        Swal.fire({
            title: 'Error!',
            text: 'Failed to load admins. Please try again.',
            icon: 'error',
            confirmButtonColor: '#036d2b'
        });
    }
}

// Edit admin function
async function editAdmin(adminId, userType) {
    try {
        // First fetch current admin data
        const response = await fetch(`fetch_admins.php?search=${adminId}`);
        const adminData = await response.json();
        
        if (!adminData.success || !adminData.data[0]) {
            throw new Error('Failed to fetch admin data');
        }
        
        const admin = adminData.data[0];
        
        const { value: formValues } = await Swal.fire({
            title: 'Edit Admin',
            html: `
                <div class="swal2-form">
                    <input type="email" id="editEmail" class="swal2-input" placeholder="Email" value="${admin.AdminEmail}">
                    <input type="text" id="editFirstName" class="swal2-input" placeholder="First Name" value="${admin.AdminFName}">
                    <input type="text" id="editLastName" class="swal2-input" placeholder="Last Name" value="${admin.AdminLName}">
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Save Changes',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                return {
                    email: document.getElementById('editEmail').value,
                    firstName: document.getElementById('editFirstName').value,
                    lastName: document.getElementById('editLastName').value
                };
            }
        });
        
        if (formValues) {
            const updateResponse = await fetch('admin_operations.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'update',
                    adminId: adminId,
                    email: formValues.email,
                    firstName: formValues.firstName,
                    lastName: formValues.lastName
                })
            });
            
            const updateResult = await updateResponse.json();
            
            if (!updateResult.success) {
                throw new Error(updateResult.error || 'Update failed');
            }
            
            await Swal.fire({
                title: 'Success!',
                text: 'Admin information has been updated.',
                icon: 'success',
                confirmButtonColor: '#036d2b'
            });
            
            loadAdmins();
        }
    } catch (error) {
        console.error('Error editing admin:', error);
        Swal.fire({
            title: 'Error!',
            text: error.message || 'Failed to update admin.',
            icon: 'error',
            confirmButtonColor: '#036d2b'
        });
    }
}

// Toggle admin status function
async function toggleAdminStatus(adminId, currentStatus, userType) {
    try {
        const result = await Swal.fire({
            title: `Confirm ${currentStatus === 'Active' ? 'Deactivate' : 'Activate'}`,
            text: `Are you sure you want to ${currentStatus === 'Active' ? 'Deactivate' : 'Activate'} this admin?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#036d2b',
            cancelButtonColor: '#6c757d',
            confirmButtonText: `Yes, ${currentStatus === 'Active' ? 'Deactivate' : 'Activate'}`,
            cancelButtonText: 'Cancel'
        });
        
        if (result.isConfirmed) {
            const response = await fetch('admin_operations.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'toggleStatus',
                    adminId: adminId,
                    currentStatus: currentStatus
                })
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Status update failed');
            }
            
            await Swal.fire({
                title: 'Success!',
                text: `Admin has been ${data.newStatus === 'Active' ? 'Activated' : 'Deactivated'}.`,
                icon: 'success',
                confirmButtonColor: '#036d2b'
            });
            
            loadAdmins();
        }
    } catch (error) {
        console.error('Error toggling admin status:', error);
        Swal.fire({
            title: 'Error!',
            text: error.message || 'Failed to update admin status.',
            icon: 'error',
            confirmButtonColor: '#036d2b'
        });
    }
}

// Delete admin function
async function confirmDeleteAdmin(adminId, userType) {
    try {
        const result = await Swal.fire({
            title: 'Delete Admin',
            text: 'Are you sure you want to permanently delete this admin? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            dangerMode: true
        });
        
        if (result.isConfirmed) {
            const response = await fetch('admin_operations.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'delete',
                    adminId: adminId
                })
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Delete failed');
            }
            
            await Swal.fire({
                title: 'Deleted!',
                text: 'The admin has been deleted.',
                icon: 'success',
                confirmButtonColor: '#036d2b'
            });
            
            loadAdmins();
        }
    } catch (error) {
        console.error('Error deleting admin:', error);
        Swal.fire({
            title: 'Error!',
            text: error.message || 'Failed to delete admin.',
            icon: 'error',
            confirmButtonColor: '#036d2b'
        });
    }
}

// Add new admin function
async function showAddAdminModal() {
    try {
        const { value: formValues } = await Swal.fire({
            title: 'Add New Admin',
            html: `
                <div class="swal2-form">
                    <input type="email" id="newEmail" class="swal2-input" placeholder="Email">
                    <input type="text" id="newFirstName" class="swal2-input" placeholder="First Name">
                    <input type="text" id="newLastName" class="swal2-input" placeholder="Last Name">
                    <input type="text" id="newUsername" class="swal2-input" placeholder="Username">
                    <input type="password" id="newPassword" class="swal2-input" placeholder="Password">
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Add Admin',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                return {
                    email: document.getElementById('newEmail').value,
                    firstName: document.getElementById('newFirstName').value,
                    lastName: document.getElementById('newLastName').value,
                    username: document.getElementById('newUsername').value,
                    password: document.getElementById('newPassword').value
                };
            }
        });
        
        if (formValues) {
            const addResponse = await fetch('admin_operations.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'add',
                    email: formValues.email,
                    firstName: formValues.firstName,
                    lastName: formValues.lastName,
                    username: formValues.username,
                    password: formValues.password
                })
            });
            
            const addResult = await addResponse.json();
            
            if (!addResult.success) {
                throw new Error(addResult.error || 'Add admin failed');
            }
            
            await Swal.fire({
                title: 'Success!',
                text: 'New admin has been added.',
                icon: 'success',
                confirmButtonColor: '#036d2b'
            });
            
            loadAdmins();
        }
    } catch (error) {
        console.error('Error adding admin:', error);
        Swal.fire({
            title: 'Error!',
            text: error.message || 'Failed to add admin.',
            icon: 'error',
            confirmButtonColor: '#036d2b'
        });
    }
}

// Update the showUserManagement function to handle admin management
function showUserManagement(userType) {
    closeModal('userTypeModal');
    
    let content = '';
    const title = userType === 'students' ? 'Student Management' : 'Admin Management';
    
    // Only show add button for admin management
    const addButton = userType === 'admins' ? 
        `<button class="btn btn-primary" onclick="showAddAdminModal()">
            <i class="fas fa-plus"></i> Add New Admin
        </button>` : '';
    
    content = `
        <div class="content-section">
            <div class="section-header">
                <h2><span class="section-indicator">${title}</span></h2>
                <div class="section-divider"></div>
            </div>
            
            <div class="action-bar">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="${userType}Search" placeholder="Search ${userType}...">
                </div>
                ${addButton}
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
                        <!-- ${userType} will be loaded here from database -->
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
        
        // Add event listener for search input
        const searchInput = document.getElementById(`${userType}Search`);
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                if (userType === 'students') {
                    searchStudents(e.target.value);
                } else {
                    searchAdmins(e.target.value);
                }
            });
        }
        
        // Load users from database
        if (userType === 'students') {
            loadUsers(userType);
        } else {
            loadAdmins();
        }
    }, 300);
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

// Borrowing Management Functions
let currentBorrowings = [];
let currentBorrowingPage = 1;
const borrowingsPerPage = 10;

// Load borrowings from database (mock data for now)
async function loadBorrowings() {
    try {
        // In a real application, you would fetch from your backend API
        // const response = await fetch('/api/borrowings');
        // currentBorrowings = await response.json();
        
        // Mock data for demonstration
        currentBorrowings = [
            { 
                id: 1, 
                bookTitle: 'Introduction to Computer Science', 
                borrower: 'John Smith (jsmith@example.com)', 
                borrowDate: '2023-05-15', 
                dueDate: '2023-06-15', 
                returnDate: '', 
                status: 'Approved' 
            },
            { 
                id: 2, 
                bookTitle: 'Advanced JavaScript', 
                borrower: 'Sarah Johnson (sjohnson@example.com)', 
                borrowDate: '2023-05-20', 
                dueDate: '2023-06-20', 
                returnDate: '2023-06-18', 
                status: 'Returned' 
            },
            { 
                id: 3, 
                bookTitle: 'Database Systems', 
                borrower: 'Michael Brown (mbrown@example.com)', 
                borrowDate: '2023-06-01', 
                dueDate: '2023-07-01', 
                returnDate: '', 
                status: 'Overdue' 
            },
            { 
                id: 4, 
                bookTitle: 'Web Development', 
                borrower: 'Emily Davis (edavis@example.com)', 
                borrowDate: '2023-06-10', 
                dueDate: '', 
                returnDate: '', 
                status: 'Pending' 
            },
            { 
                id: 5, 
                bookTitle: 'Data Structures', 
                borrower: 'Robert Wilson (rwilson@example.com)', 
                borrowDate: '2023-06-05', 
                dueDate: '2023-07-05', 
                returnDate: '', 
                status: 'Approved' 
            }
        ];
        
        renderBorrowings();
    } catch (error) {
        console.error('Error loading borrowings:', error);
        Swal.fire({
            title: 'Error!',
            text: 'Failed to load borrowings. Please try again.',
            icon: 'error',
            confirmButtonColor: '#036d2b'
        });
    }
}

// Render borrowings to the table
function renderBorrowings() {
    const tableBody = document.getElementById('borrowingTableBody');
    tableBody.innerHTML = '';
    
    // Pagination
    const startIndex = (currentBorrowingPage - 1) * borrowingsPerPage;
    const paginatedBorrowings = currentBorrowings.slice(startIndex, startIndex + borrowingsPerPage);
    
    // Update current page display
    document.getElementById('currentBorrowingPage').textContent = currentBorrowingPage;
    
    // Populate table
    paginatedBorrowings.forEach(borrowing => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${borrowing.bookTitle}</td>
            <td>${borrowing.borrower}</td>
            <td>${borrowing.borrowDate}</td>
            <td>${borrowing.dueDate || '-'}</td>
            <td>${borrowing.returnDate || '-'}</td>
            <td><span class="badge ${getBorrowingStatusBadgeClass(borrowing.status)}">${borrowing.status}</span></td>
            <td>
                <button class="btn-icon" onclick="editBorrowing(${borrowing.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="confirmDeleteBorrowing(${borrowing.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Get badge class based on borrowing status
function getBorrowingStatusBadgeClass(status) {
    switch(status) {
        case 'Pending': return 'badge-warning';
        case 'Approved': return 'badge-success';
        case 'Returned': return 'badge-primary';
        case 'Overdue': return 'badge-danger';
        default: return 'badge-secondary';
    }
}

// Search borrowings
function searchBorrowings() {
    const searchTerm = document.getElementById('searchBorrowings').value.toLowerCase();
    
    if (searchTerm === '') {
        renderBorrowings();
        return;
    }
    
    const filteredBorrowings = currentBorrowings.filter(borrowing => 
        borrowing.bookTitle.toLowerCase().includes(searchTerm) ||
        borrowing.borrower.toLowerCase().includes(searchTerm) ||
        borrowing.status.toLowerCase().includes(searchTerm)
    );
    
    const tableBody = document.getElementById('borrowingTableBody');
    tableBody.innerHTML = '';
    
    filteredBorrowings.forEach(borrowing => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${borrowing.bookTitle}</td>
            <td>${borrowing.borrower}</td>
            <td>${borrowing.borrowDate}</td>
            <td>${borrowing.dueDate || '-'}</td>
            <td>${borrowing.returnDate || '-'}</td>
            <td><span class="badge ${getBorrowingStatusBadgeClass(borrowing.status)}">${borrowing.status}</span></td>
            <td>
                <button class="btn-icon" onclick="editBorrowing(${borrowing.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="confirmDeleteBorrowing(${borrowing.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Filter borrowings by status
function filterByStatus() {
    const status = document.getElementById('statusFilter').value;
    
    if (status === 'all') {
        renderBorrowings();
        return;
    }
    
    const filteredBorrowings = currentBorrowings.filter(borrowing => 
        borrowing.status === status
    );
    
    const tableBody = document.getElementById('borrowingTableBody');
    tableBody.innerHTML = '';
    
    filteredBorrowings.forEach(borrowing => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${borrowing.bookTitle}</td>
            <td>${borrowing.borrower}</td>
            <td>${borrowing.borrowDate}</td>
            <td>${borrowing.dueDate || '-'}</td>
            <td>${borrowing.returnDate || '-'}</td>
            <td><span class="badge ${getBorrowingStatusBadgeClass(borrowing.status)}">${borrowing.status}</span></td>
            <td>
                <button class="btn-icon" onclick="editBorrowing(${borrowing.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="confirmDeleteBorrowing(${borrowing.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Borrowing pagination
function nextBorrowingPage() {
    const totalPages = Math.ceil(currentBorrowings.length / borrowingsPerPage);
    if (currentBorrowingPage < totalPages) {
        currentBorrowingPage++;
        renderBorrowings();
    }
}

function prevBorrowingPage() {
    if (currentBorrowingPage > 1) {
        currentBorrowingPage--;
        renderBorrowings();
    }
}

// Edit borrowing
function editBorrowing(borrowingId) {
    const borrowing = currentBorrowings.find(b => b.id === borrowingId);
    if (!borrowing) return;
    
    document.getElementById('borrowingId').value = borrowing.id;
    document.getElementById('borrowingStatus').value = borrowing.status;
    document.getElementById('dueDate').value = borrowing.dueDate || '';
    document.getElementById('returnDate').value = borrowing.returnDate || '';
    
    document.getElementById('borrowingModal').style.display = 'block';
}

// Handle borrowing form submission
document.getElementById('updateBorrowingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const borrowingId = parseInt(document.getElementById('borrowingId').value);
    const updatedBorrowing = {
        status: document.getElementById('borrowingStatus').value,
        dueDate: document.getElementById('dueDate').value,
        returnDate: document.getElementById('returnDate').value
    };
    
    // In a real application, you would send this to your backend API
    // fetch(`/api/borrowings/${borrowingId}`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(updatedBorrowing)
    // })
    
    // For demo purposes, update locally
    const index = currentBorrowings.findIndex(b => b.id === borrowingId);
    if (index !== -1) {
        currentBorrowings[index] = { ...currentBorrowings[index], ...updatedBorrowing };
        renderBorrowings();
        closeModal('borrowingModal');
        
        Swal.fire({
            title: 'Success!',
            text: 'Borrowing record has been updated.',
            icon: 'success',
            confirmButtonColor: '#036d2b'
        });
    }
});

// Delete borrowing
function confirmDeleteBorrowing(borrowingId) {
    Swal.fire({
        title: 'Delete Borrowing Record',
        text: 'Are you sure you want to delete this borrowing record? This action cannot be undone.',
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
            // fetch(`/api/borrowings/${borrowingId}`, { method: 'DELETE' })
            
            // For demo purposes, delete locally
            currentBorrowings = currentBorrowings.filter(borrowing => borrowing.id !== borrowingId);
            renderBorrowings();
            
            Swal.fire({
                title: 'Deleted!',
                text: 'The borrowing record has been deleted.',
                icon: 'success',
                confirmButtonColor: '#036d2b'
            });
        }
    });
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
            
            <div class="action-bar">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchBorrowings" placeholder="Search borrowings..." onkeyup="searchBorrowings()">
                </div>
                <div class="filter-options">
                    <select id="statusFilter" onchange="filterByStatus()">
                        <option value="all">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Returned">Returned</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>
            </div>
            
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Book Title</th>
                            <th>Borrower</th>
                            <th>Borrow Date</th>
                            <th>Due Date</th>
                            <th>Return Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="borrowingTableBody">
                        <!-- Borrowings will be loaded here from database -->
                    </tbody>
                </table>
            </div>
            
            <div class="pagination">
                <button class="btn-pagination" onclick="prevBorrowingPage()"><i class="fas fa-chevron-left"></i></button>
                <span id="currentBorrowingPage">1</span>
                <button class="btn-pagination" onclick="nextBorrowingPage()"><i class="fas fa-chevron-right"></i></button>
            </div>
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
            } else if (sectionId === 'borrowing') {
                loadBorrowings();
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
