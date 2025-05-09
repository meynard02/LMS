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
        
        // Update navigation active state
        const navLinks = document.querySelectorAll(".nav-list a");
        navLinks.forEach(nav => {
            nav.classList.remove("active");
            // Add active class to User Management nav item
            if (nav.querySelector('i.fa-users-cog')) {
                nav.classList.add("active");
            }
        });
        
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
                    <div class="filter-options">
                        <select id="${userType}StatusFilter" onchange="filterByUserStatus('${userType}')">
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="${userType === 'students' ? 'Suspended' : 'Inactive'}">${userType === 'students' ? 'Suspended' : 'Inactive'}</option>
                        </select>
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
                    <td><span class="badge ${user.Status === 'Active' ? 'badge-success' : 'badge-danger'}">${user.Status}</span></td>
                    <td>
                        <button class="btn-icon" onclick="${userType === 'students' ? `editUser('${identifier}', 'students')` : `editAdmin('${identifier}', 'admins')`}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="${userType === 'students' ? `toggleUserStatus('${identifier}', '${user.Status}', 'students')` : `toggleAdminStatus('${identifier}', '${user.Status}', 'admins')`}">
                            <i class="fas ${user.Status === 'Active' ? 'fa-user-slash' : 'fa-user-check'}"></i>
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
                title: `Confirm ${currentStatus === 'Active' ? (userType === 'students' ? 'Suspend' : 'Deactivate') : 'Activate'}`,
                text: `Are you sure you want to ${currentStatus === 'Active' ? (userType === 'students' ? 'Suspend' : 'Deactivate') : 'Activate'} this ${userType === 'students' ? 'student' : 'admin'}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#036d2b',
                cancelButtonColor: '#6c757d',
                confirmButtonText: `Yes, ${currentStatus === 'Active' ? (userType === 'students' ? 'Suspend' : 'Deactivate') : 'Activate'}`,
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
                    text: `${userType === 'students' ? 'Student' : 'Admin'} has been ${data.newStatus === 'Active' ? 'Activated' : (userType === 'students' ? 'Suspended' : 'Deactivated')}.`,
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
                    <td><span class="badge ${user.Status === 'Active' ? 'badge-success' : 'badge-danger'}">${user.Status}</span></td>
                    <td>
                        <button class="btn-icon" onclick="editUser('${user.Email}', 'students')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="toggleUserStatus('${user.Email}', '${user.Status}', 'students')">
                            <i class="fas ${user.Status === 'Active' ? 'fa-user-slash' : 'fa-user-check'}"></i>
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
                    <td><span class="badge ${admin.Status === 'Active' ? 'badge-success' : 'badge-danger'}">${admin.Status}</span></td>
                    <td>
                        <button class="btn-icon" onclick="editAdmin('${admin.AdminID}', 'admins')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="toggleAdminStatus('${admin.AdminID}', '${admin.Status}', 'admins')">
                            <i class="fas ${admin.Status === 'Active' ? 'fa-user-slash' : 'fa-user-check'}"></i>
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
                    <td><span class="badge ${admin.Status === 'Active' ? 'badge-success' : 'badge-danger'}">${admin.Status}</span></td>
                    <td>
                        <button class="btn-icon" onclick="editAdmin('${admin.AdminID}', 'admins')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="toggleAdminStatus('${admin.AdminID}', '${admin.Status}', 'admins')">
                            <i class="fas ${admin.Status === 'Active' ? 'fa-user-slash' : 'fa-user-check'}"></i>
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
                        <input type="email" id="editEmail" class="swal2-input" placeholder="Email" value="${admin.AdminEmail}" required>
                        <input type="text" id="editFirstName" class="swal2-input" placeholder="First Name" value="${admin.AdminFName}" required>
                        <input type="text" id="editLastName" class="swal2-input" placeholder="Last Name" value="${admin.AdminLName}" required>
                        <input type="text" id="editUsername" class="swal2-input" placeholder="Username" value="${admin.AdminUsername}" required>
                        <input type="password" id="editPassword" class="swal2-input" placeholder="New Password (leave blank to keep current)">
                        <div id="passwordRequirements" style="text-align: left; font-size: 12px; margin-top: -15px; margin-bottom: 15px;">
                            Password must contain:
                            <ul style="margin: 5px 0 0 15px; padding: 0;">
                                <li>At least 8 characters</li>
                                <li>One uppercase letter</li>
                                <li>One lowercase letter</li>
                                <li>One number</li>
                                <li>One special character</li>
                            </ul>
                        </div>
                    </div>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Save Changes',
                cancelButtonText: 'Cancel',
                preConfirm: () => {
                    const password = document.getElementById('editPassword').value;
                    
                    // Only validate if password is being changed
                    if (password) {
                        const validation = validatePassword(password);
                        
                        if (!validation.isValid) {
                            Swal.showValidationMessage(
                                `Password requirements not met. Missing: ${validation.errors.join(', ')}`
                            );
                            return false;
                        }
                    }
                    
                    return {
                        email: document.getElementById('editEmail').value,
                        firstName: document.getElementById('editFirstName').value,
                        lastName: document.getElementById('editLastName').value,
                        username: document.getElementById('editUsername').value,
                        password: password
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
                        lastName: formValues.lastName,
                        username: formValues.username,
                        password: formValues.password
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
                    text: `${userType === 'students' ? 'Student' : 'Admin'} has been ${data.newStatus === 'Active' ? 'Activated' : (userType === 'students' ? 'Suspended' : 'Deactivated')}.`,
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

    function validatePassword(password) {
        const errors = [];
        
        if (password.length < 8) {
            errors.push("at least 8 characters");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("one uppercase letter");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("one lowercase letter");
        }
        if (!/[0-9]/.test(password)) {
            errors.push("one number");
        }
        if (!/[\W_]/.test(password)) {
            errors.push("one special character");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Update the showAddAdminModal function
    async function showAddAdminModal() {
        try {
            const { value: formValues } = await Swal.fire({
                title: 'Add New Admin',
                html: `
                    <div class="swal2-form">
                        <input type="email" id="newEmail" class="swal2-input" placeholder="Email" required>
                        <input type="text" id="newFirstName" class="swal2-input" placeholder="First Name" required>
                        <input type="text" id="newLastName" class="swal2-input" placeholder="Last Name" required>
                        <input type="text" id="newUsername" class="swal2-input" placeholder="Username" required>
                        <input type="password" id="newPassword" class="swal2-input" placeholder="Password" required>
                        <div id="passwordRequirements" style="text-align: left; font-size: 12px; margin-top: -15px; margin-bottom: 15px;">
                            Password must contain:
                            <ul style="margin: 5px 0 0 15px; padding: 0;">
                                <li>At least 8 characters</li>
                                <li>One uppercase letter</li>
                                <li>One lowercase letter</li>
                                <li>One number</li>
                                <li>One special character</li>
                            </ul>
                        </div>
                    </div>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Add Admin',
                cancelButtonText: 'Cancel',
                preConfirm: () => {
                    const password = document.getElementById('newPassword').value;
                    const validation = validatePassword(password);
                    
                    if (!validation.isValid) {
                        Swal.showValidationMessage(
                            `Password requirements not met. Missing: ${validation.errors.join(', ')}`
                        );
                        return false;
                    }
                    
                    return {
                        email: document.getElementById('newEmail').value,
                        firstName: document.getElementById('newFirstName').value,
                        lastName: document.getElementById('newLastName').value,
                        username: document.getElementById('newUsername').value,
                        password: password
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

    // Add new function to filter users by status
    async function filterByUserStatus(userType) {
        const statusFilter = document.getElementById(`${userType}StatusFilter`).value;
        const searchTerm = document.getElementById(`${userType}Search`).value;
        
        try {
            let response;
            if (userType === 'students') {
                response = await fetch(`fetch_students.php?status=${statusFilter}&search=${encodeURIComponent(searchTerm)}`);
            } else {
                response = await fetch(`fetch_admins.php?status=${statusFilter}&search=${encodeURIComponent(searchTerm)}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to filter users');
            }
            
            const tableBody = document.getElementById("userTableBody");
            tableBody.innerHTML = '';
            
            data.data.forEach(user => {
                const row = document.createElement('tr');
                
                if (userType === 'students') {
                    row.innerHTML = `
                        <td>${user.Email}</td>
                        <td>${user.FirstName}</td>
                        <td>${user.LastName}</td>
                        <td><span class="badge ${user.Status === 'Active' ? 'badge-success' : 'badge-danger'}">${user.Status}</span></td>
                        <td>
                            <button class="btn-icon" onclick="editUser('${user.Email}', 'students')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon" onclick="toggleUserStatus('${user.Email}', '${user.Status}', 'students')">
                                <i class="fas ${user.Status === 'Active' ? 'fa-user-slash' : 'fa-user-check'}"></i>
                            </button>
                        </td>
                    `;
                } else {
                    row.innerHTML = `
                        <td>${user.AdminEmail}</td>
                        <td>${user.AdminFName}</td>
                        <td>${user.AdminLName}</td>
                        <td><span class="badge ${user.Status === 'Active' ? 'badge-success' : 'badge-danger'}">${user.Status}</span></td>
                        <td>
                            <button class="btn-icon" onclick="editAdmin('${user.AdminID}', 'admins')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon" onclick="toggleAdminStatus('${user.AdminID}', '${user.Status}', 'admins')">
                                <i class="fas ${user.Status === 'Active' ? 'fa-user-slash' : 'fa-user-check'}"></i>
                            </button>
                        </td>
                    `;
                }
                
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error filtering users:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to filter users. Please try again.',
                icon: 'error',
                confirmButtonColor: '#036d2b'
            });
        }
    }

    // Inventory Management Functions
    let currentBooks = [];
    let currentSortField = 'AccessionNo';
    let currentSortOrder = 'asc';
    let currentPage = 1;
    const booksPerPage = 10;

    // Load books from database
    // Load books from database
    // Load books from database
    // In your loadBooks function, modify it to also handle categories:
    async function loadBooks() {
        try {
            showLoading(true);
            const response = await fetch('fetch_books.php');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error("Response is not JSON");
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to load books from server');
            }
            
            if (!Array.isArray(data.data)) {
                throw new Error('Invalid data format received from server');
            }
            
            currentBooks = data.data;
            
            // Store categories globally
            window.bookCategories = data.categories || [];
            
            renderBooks();
            populateCategoryDropdowns();
        } catch (error) {
            console.error('Error loading books:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to load books. Please try again.',
                icon: 'error',
                confirmButtonColor: '#036d2b'
            });
        } finally {
            showLoading(false);
        }
    }

    // Function to populate category dropdowns
    function populateCategoryDropdowns() {
        return new Promise((resolve) => {
            const categoryDropdowns = [
                document.getElementById('addCategory'),
                document.getElementById('editCategory')
            ];
            
            categoryDropdowns.forEach(dropdown => {
                if (dropdown) {
                    // Store the current value if it's the edit dropdown
                    const isEditDropdown = dropdown.id === 'editCategory';
                    const currentValue = isEditDropdown ? dropdown.value : '';
                    
                    // Clear existing options except the first one (which is the placeholder)
                    while (dropdown.options.length > 1) {
                        dropdown.remove(1);
                    }
                    
                    // Add categories from the database
                    window.bookCategories.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category.Book_CategoryID;
                        option.textContent = category.Book_Category;
                        dropdown.appendChild(option);
                    });
                    
                    // Add "Add New Category" option at the end
                    const addNewOption = document.createElement('option');
                    addNewOption.value = 'add_new';
                    addNewOption.textContent = '+ Add New Category';
                    dropdown.appendChild(addNewOption);
                    
                    // Restore the current value for edit dropdown
                    if (isEditDropdown && currentValue) {
                        dropdown.value = currentValue;
                    }
                }
            });
            
            resolve();
        });
    }

    // Add event listener for category dropdown change
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('addCategory')?.addEventListener('change', function(e) {
            if (e.target.value === 'add_new') {
                showAddCategoryModal('add');
            }
        });
        
        document.getElementById('editCategory')?.addEventListener('change', function(e) {
            if (e.target.value === 'add_new') {
                showAddCategoryModal('edit');
            }
        });
    });

    // Function to show modal for adding new category
    async function showAddCategoryModal(context) {
        const { value: categoryName } = await Swal.fire({
            title: 'Add New Category',
            input: 'text',
            inputLabel: 'Category Name',
            inputPlaceholder: 'Enter new category name',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to enter a category name!';
                }
            }
        });
        
        if (categoryName) {
            try {
                const response = await fetch('book_category_operations.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        action: 'add',
                        categoryName: categoryName
                    })
                });
                
                const result = await response.json();
                
                if (!result.success) {
                    throw new Error(result.error || 'Failed to add category');
                }
                
                // Reload books to get updated categories
                await loadBooks();
                
                // Set the newly added category as selected
                const newCategoryId = result.categoryId;
                const dropdownId = context === 'add' ? 'addCategory' : 'editCategory';
                const dropdown = document.getElementById(dropdownId);
                
                if (dropdown) {
                    dropdown.value = newCategoryId;
                }
                
                Swal.fire({
                    title: 'Success!',
                    text: 'New category added successfully',
                    icon: 'success',
                    confirmButtonColor: '#036d2b'
                });
            } catch (error) {
                console.error('Error adding category:', error);
                Swal.fire({
                    title: 'Error!',
                    text: error.message || 'Failed to add category',
                    icon: 'error',
                    confirmButtonColor: '#036d2b'
                });
                
                // Reset to previous value if error occurs
                const dropdownId = context === 'add' ? 'addCategory' : 'editCategory';
                const dropdown = document.getElementById(dropdownId);
                
                if (dropdown) {
                    dropdown.value = '';
                }
            }
        } else {
            // Reset to previous value if cancelled
            const dropdownId = context === 'add' ? 'addCategory' : 'editCategory';
            const dropdown = document.getElementById(dropdownId);
            
            if (dropdown) {
                dropdown.value = '';
            }
        }
    }

    // Save book (add or update)
    async function saveBook(formData) {
        try {
            showLoading(true);
            const response = await fetch('book_operation.php', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Operation failed');
            }
            
            await loadBooks(); // Refresh the book list
            showSuccess('Book saved successfully');
            return data;
        } catch (error) {
            console.error('Error saving book:', error);
            showError('Failed to save book', error.message);
            throw error;
        } finally {
            showLoading(false);
        }
    }

    // Delete book
    async function deleteBook(accessionNo) {
        try {
            showLoading(true);
            const formData = new FormData();
            formData.append('action', 'delete');
            formData.append('accessionNo', accessionNo);
            
            const response = await fetch('book_operation.php', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Delete failed');
            }
            
            await loadBooks(); // Refresh the book list
            showSuccess('Book deleted successfully');
            return data;
        } catch (error) {
            console.error('Error deleting book:', error);
            showError('Failed to delete book', error.message);
            throw error;
        } finally {
            showLoading(false);
        }
    }

    function showLoading(show) {
        const loader = document.getElementById('loadingOverlay');
        if (loader) {
            loader.style.display = show ? 'flex' : 'none';
        }
    }

    function showError(message) {
        Swal.fire({
            title: 'Error!',
            text: message,
            icon: 'error',
            confirmButtonColor: '#036d2b'
        });
    }

    function showSuccess(message) {
        Swal.fire({
            title: 'Success!',
            text: message,
            icon: 'success',
            confirmButtonColor: '#036d2b'
        });
    }

    function showError(title, message) {
        Swal.fire({
            title: title || 'Error!',
            text: message || 'An unexpected error occurred',
            icon: 'error',
            confirmButtonColor: '#036d2b'
        });
    }


    // Render books to the table (without Category and Description)
    function renderBooks() {
        const tableBody = document.getElementById('inventoryTableBody');
        if (!tableBody) {
            console.error('Inventory table body not found');
            return;
        }
        
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
        const currentPageElement = document.getElementById('currentPage');
        if (currentPageElement) {
            currentPageElement.textContent = currentPage;
        }
        
        // Populate table
        paginatedBooks.forEach(book => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${book.AccessionNo}</td>
                <td>${book.Title}</td>
                <td>${book.Author}</td>
                <td><span class="badge ${getAvailabilityBadgeClass(book.Availability)}">${book.Availability}</span></td>
                <td>
                    <button class="btn-icon" onclick="editBook(${book.AccessionNo})"><i class="fas fa-edit"></i></button>
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

    // Search books (only searches visible columns)
    function searchBooks() {
        const searchTerm = document.getElementById('searchBooks').value.toLowerCase();
        
        if (searchTerm === '') {
            renderBooks();
            return;
        }
        
        const filteredBooks = currentBooks.filter(book => 
            book.AccessionNo.toLowerCase().includes(searchTerm) ||
            book.Title.toLowerCase().includes(searchTerm) ||
            book.Author.toLowerCase().includes(searchTerm) ||
            book.Availability.toLowerCase().includes(searchTerm)
        );
        
        const tableBody = document.getElementById('inventoryTableBody');
        tableBody.innerHTML = '';
        
        filteredBooks.forEach(book => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${book.AccessionNo}</td>
                <td>${book.Title}</td>
                <td>${book.Author}</td>
                <td><span class="badge ${getAvailabilityBadgeClass(book.Availability)}">${book.Availability}</span></td>
                <td>
                    <button class="btn-icon" onclick="editBook('${book.AccessionNo}')"><i class="fas fa-edit"></i></button>
                    
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
    function editBook(accessionNo) {
        const book = currentBooks.find(b => b.AccessionNo == accessionNo);
        if (!book) {
            console.error('Book not found with AccessionNo:', accessionNo);
            return;
        }
        
        // Store the current category ID before populating dropdowns
        const currentCategoryId = book.Book_CategoryID;
        
        document.getElementById('editBookId').value = book.AccessionNo;
        document.getElementById('editAccessionNo').value = book.AccessionNo;
        document.getElementById('editTitle').value = book.Title;
        document.getElementById('editAuthor').value = book.Author;
        document.getElementById('editDescription').value = book.Description || '';
        document.getElementById('editAvailability').value = book.Availability || 'Available';
        
        // Show photo preview if exists
        const photoPreview = document.getElementById('editPhotoPreview');
        if (book.Photo) {
            photoPreview.innerHTML = `<img src="../uploads/${book.Photo}" style="max-width: 100px; max-height: 100px;">`;
        } else {
            photoPreview.innerHTML = '';
        }
        
        // Populate categories dropdown and set the current category
        populateCategoryDropdowns().then(() => {
            if (currentCategoryId) {
                document.getElementById('editCategory').value = currentCategoryId;
            }
        });
        
        document.getElementById('editBookModal').style.display = 'block';
    }
    // Handle edit book form submission
    document.getElementById('editBookForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('action', 'update');
        formData.append('id', document.getElementById('editBookId').value);
        formData.append('accessionNo', document.getElementById('editAccessionNo').value);
        formData.append('title', document.getElementById('editTitle').value);
        formData.append('author', document.getElementById('editAuthor').value);
        formData.append('category', document.getElementById('editCategory').value);
        formData.append('description', document.getElementById('editDescription').value);
        formData.append('availability', document.getElementById('editAvailability').value);
        
        const photoInput = document.getElementById('editPhoto');
        if (photoInput.files[0]) {
            formData.append('photo', photoInput.files[0]);
        }
        
        try {
            const response = await fetch('book_operations.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Failed to update book');
            }
            
            await loadBooks();
            closeModal('editBookModal');
            
            Swal.fire({
                title: 'Success!',
                text: 'Book information has been updated.',
                icon: 'success',
                confirmButtonColor: '#036d2b'
            });
        } catch (error) {
            console.error('Error updating book:', error);
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to update book.',
                icon: 'error',
                confirmButtonColor: '#036d2b'
            });
        }
    });

    // Delete book
    function confirmDeleteBook(accessionNo) {
        Swal.fire({
            title: 'Delete Book',
            text: `Are you sure you want to delete book with Accession No. ${accessionNo}? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            dangerMode: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch('book_operations.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            action: 'delete',
                            accessionNo: accessionNo
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (!data.success) {
                        throw new Error(data.error || 'Delete failed');
                    }
                    
                    // Remove from local array and re-render
                    currentBooks = currentBooks.filter(book => book.AccessionNo != accessionNo);
                    renderBooks();
                    
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'The book has been deleted.',
                        icon: 'success',
                        confirmButtonColor: '#036d2b'
                    });
                } catch (error) {
                    console.error('Error deleting book:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: error.message || 'Failed to delete book.',
                        icon: 'error',
                        confirmButtonColor: '#036d2b'
                    });
                }
            }
        });
    }

    // Add new book
    function showAddBookModal() {
        document.getElementById('addBookForm').reset();
        document.getElementById('addPhotoPreview').innerHTML = '';
        document.getElementById('inventoryModal').style.display = 'block';
    }

    // Handle add book form submission
    document.getElementById('addBookForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('action', 'add');
        formData.append('accessionNo', document.getElementById('addAccessionNo').value);
        formData.append('title', document.getElementById('addTitle').value);
        formData.append('author', document.getElementById('addAuthor').value);
        formData.append('category', document.getElementById('addCategory').value);
        formData.append('description', document.getElementById('addDescription').value);
        formData.append('availability', document.getElementById('addAvailability').value);
        
        const photoInput = document.getElementById('addPhoto');
        if (photoInput.files[0]) {
            formData.append('photo', photoInput.files[0]);
        }
        
        try {
            const response = await fetch('book_operations.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Failed to add book');
            }
            
            await loadBooks();
            closeModal('inventoryModal');
            
            Swal.fire({
                title: 'Success!',
                text: 'New book has been added.',
                icon: 'success',
                confirmButtonColor: '#036d2b'
            });
        } catch (error) {
            console.error('Error adding book:', error);
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to add book.',
                icon: 'error',
                confirmButtonColor: '#036d2b'
            });
        }
    });


    // Add photo preview functionality
    document.getElementById('editPhoto').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('photoPreview').innerHTML = 
                    `<img src="${event.target.result}" style="max-width: 100px; max-height: 100px;">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Borrowing Management Functions
    let currentBorrowings = [];
    let currentBorrowingPage = 1;
    const borrowingsPerPage = 10;

    // Load borrowings from database
    async function loadBorrowings() {
        try {
            showLoading(true);
            const response = await fetch('fetch_borrowings.php');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to load borrowings');
            }
            
            currentBorrowings = data.data;
            renderBorrowings();
        } catch (error) {
            console.error('Error loading borrowings:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to load borrowings. Please try again.',
                icon: 'error',
                confirmButtonColor: '#036d2b'
            });
        } finally {
            showLoading(false);
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
                <td>${borrowing.Title || 'N/A'}</td>
                <td>${borrowing.FirstName} ${borrowing.LastName} (${borrowing.Email})</td>
                <td>${formatDate(borrowing.BorrowedDate)}</td>
                <td>${borrowing.DueDate ? formatDate(borrowing.DueDate) : '-'}</td>
                <td>${borrowing.ReturnDate ? formatDate(borrowing.ReturnDate) : '-'}</td>
                <td><span class="badge ${getBorrowingStatusBadgeClass(borrowing.StatusDesc)}">${borrowing.StatusDesc}</span></td>
                <td>
                    <button class="btn-icon" onclick="editBorrowing(${borrowing.transactionID})">
                        <i class="fas fa-edit"></i>
                    </button>
                    
                    </button>
                    ${borrowing.StatusDesc === 'Approved' && !borrowing.ReturnDate ? 
                        `<button class="btn-icon" onclick="processReturn(${borrowing.transactionID})">
                            <i class="fas fa-book"></i>
                        </button>` : ''}
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }

    // Helper function to format dates
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    }

    // // Process book return
    // async function processReturn(transactionId) {
    //     try {
    //         const result = await Swal.fire({
    //             title: 'Process Return',
    //             html: `
    //                 <div class="swal2-form">
    //                     <label for="returnCondition">Book Condition:</label>
    //                     <select id="returnCondition" class="swal2-select">
    //                         <option value="good">Good</option>
    //                         <option value="damaged">Damaged</option>
    //                         <option value="lost">Lost</option>
    //                     </select>
    //                     <label for="returnNotes">Notes:</label>
    //                     <textarea id="returnNotes" class="swal2-textarea" placeholder="Any additional notes..."></textarea>
    //                 </div>
    //             `,
    //             focusConfirm: false,
    //             showCancelButton: true,
    //             confirmButtonText: 'Confirm Return',
    //             cancelButtonText: 'Cancel'
    //         });
            
    //         if (result.isConfirmed) {
    //             const condition = document.getElementById('returnCondition').value;
    //             const notes = document.getElementById('returnNotes').value;
                
    //             const response = await fetch('borrowing_operations.php', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/x-www-form-urlencoded',
    //                 },
    //                 body: new URLSearchParams({
    //                     action: 'return',
    //                     transactionId: transactionId,
    //                     condition: condition,
    //                     notes: notes
    //                 })
    //             });
                
    //             const data = await response.json();
                
    //             if (!data.success) {
    //                 throw new Error(data.error || 'Return processing failed');
    //             }
                
    //             await loadBorrowings();
    //             Swal.fire({
    //                 title: 'Success!',
    //                 text: 'Book return has been processed.',
    //                 icon: 'success',
    //                 confirmButtonColor: '#036d2b'
    //             });
    //         }
    //     } catch (error) {
    //         console.error('Error processing return:', error);
    //         Swal.fire({
    //             title: 'Error!',
    //             text: error.message || 'Failed to process return.',
    //             icon: 'error',
    //             confirmButtonColor: '#036d2b'
    //         });
    //     }
    // }

    async function checkDueDates() {
        try {
            const response = await fetch('borrowing_operations.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'check_due_dates'
                })
            });
            
            const result = await response.json();
            
            if (!result.success) {
                console.error('Failed to check due dates');
            }
        } catch (error) {
            console.error('Error checking due dates:', error);
        }
    }

    // Run due date check on admin panel load and every hour
    document.addEventListener('DOMContentLoaded', function() {
        // Run immediately
        checkDueDates();
        
        // Then run every hour
        setInterval(checkDueDates, 3600000);
    });

    // Enhanced editBorrowing function with return date enabled only for Returned/Returned Overdue
    async function editBorrowing(transactionId) {
        try {
            // Fetch the specific borrowing record
            const response = await fetch(`fetch_borrowings.php?transactionId=${transactionId}`);
            const data = await response.json();
            
            if (!data.success || !data.data[0]) {
                throw new Error('Failed to fetch borrowing record');
            }
            
            const borrowing = data.data[0];
            
            // Fetch all status options
            const statusResponse = await fetch('fetch_statuses.php');
            const statusData = await statusResponse.json();
            
            if (!statusData.success) {
                throw new Error('Failed to fetch status options');
            }
            
            // Filter status options based on current status
            let allowedStatuses = [];
            
            switch(borrowing.StatusDesc) {
                case 'Pending':
                    allowedStatuses = statusData.data.filter(status => 
                        ['Pending', 'Approved', 'Rejected'].includes(status.StatusDesc)
                    );
                    break;
                case 'Approved':
                    allowedStatuses = statusData.data.filter(status => 
                        ['Approved', 'Returned', 'Returned Overdue'].includes(status.StatusDesc)
                    );
                    break;
                case 'Rejected':
                    // Only show Rejected status (no changes allowed)
                    allowedStatuses = statusData.data.filter(status => 
                        status.StatusDesc === 'Rejected'
                    );
                    break;
                default:
                    // For other statuses, show current status plus all allowed options
                    allowedStatuses = statusData.data.filter(status => 
                        status.StatusDesc === borrowing.StatusDesc || 
                        !['Pending', 'Overdue'].includes(status.StatusDesc)
                    );
            }
            
            // Build status options HTML with current status first
            let statusOptions = '';
            if (allowedStatuses.length > 0) {
                // Add current status first
                const currentStatus = statusData.data.find(s => s.StatusDesc === borrowing.StatusDesc);
                if (currentStatus) {
                    statusOptions += `<option value="${currentStatus.statusID}" selected>${currentStatus.StatusDesc}</option>`;
                }
                
                // Add other allowed statuses (excluding current status)
                allowedStatuses.forEach(status => {
                    if (status.StatusDesc !== borrowing.StatusDesc) {
                        statusOptions += `<option value="${status.statusID}">${status.StatusDesc}</option>`;
                    }
                });
            } else {
                statusOptions = `<option value="${borrowing.statusID}" selected>${borrowing.StatusDesc}</option>`;
            }
            
            // Create the modal HTML
            const { value: formValues } = await Swal.fire({
                title: 'Edit Borrowing Record',
                html: `
                    <div class="borrowing-edit-form">
                        <div class="form-section">
                            <h3>Book Information</h3>
                            <div class="form-group">
                                <label>Title:</label>
                                <div class="form-value">${borrowing.Title || 'N/A'}</div>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h3>Borrower Information</h3>
                            <div class="form-group">
                                <label>Name:</label>
                                <div class="form-value">${borrowing.FirstName} ${borrowing.LastName}</div>
                            </div>
                            <div class="form-group">
                                <label>Email:</label>
                                <div class="form-value">${borrowing.Email}</div>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h3>Borrowing Details</h3>
                            <div class="form-group">
                                <label>Borrow Date:</label>
                                <div class="form-value">${formatDate(borrowing.BorrowedDate)}</div>
                            </div>
                            
                            <div class="form-group">
                                <label>Due Date:</label>
                                <div class="form-value">${formatDate(borrowing.DueDate)}</div>
                                <small class="text-muted">(Automatically calculated based on borrowing period)</small>
                            </div>
                            
                            <div class="form-group">
                                <label for="editStatus">Status:</label>
                                <select id="editStatus" class="form-control">
                                    ${statusOptions}
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="editReturnDate">Return Date:</label>
                                <input type="date" id="editReturnDate" class="form-control" 
                                    value="${borrowing.ReturnDate ? formatDate(borrowing.ReturnDate) : ''}"
                                    ${['Returned', 'Returned Overdue'].includes(borrowing.StatusDesc) ? '' : 'disabled'}>
                            </div>
                        </div>
                    </div>
                    
                    <style>
                    .borrowing-edit-form {
                        max-height: 60vh;
                        overflow-y: auto;
                        padding-right: 10px;
                    }
                    .form-section {
                        margin-bottom: 20px;
                        padding-bottom: 15px;
                        border-bottom: 1px solid #eee;
                    }
                    .form-section h3 {
                        margin-top: 0;
                        color: #036d2b;
                        font-size: 1.1rem;
                    }
                    .form-group {
                        margin-bottom: 15px;
                    }
                    .form-group label {
                        display: block;
                        margin-bottom: 5px;
                        font-weight: 500;
                    }
                    .form-value {
                        padding: 8px 12px;
                        background: #f5f5f5;
                        border-radius: 4px;
                    }
                    .form-control {
                        width: 100%;
                        padding: 8px 12px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                    }
                    .form-control:disabled {
                        background-color: #f5f5f5;
                        cursor: not-allowed;
                    }
                    .text-muted {
                        color: #6c757d;
                        font-size: 0.85rem;
                    }
                    </style>
                `,
                width: '700px',
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Save Changes',
                cancelButtonText: 'Cancel',
                didOpen: () => {
                    // Add event listener to status dropdown
                    const statusSelect = document.getElementById('editStatus');
                    const returnDateInput = document.getElementById('editReturnDate');
                    
                    if (statusSelect && returnDateInput) {
                        statusSelect.addEventListener('change', function() {
                            const selectedStatus = this.options[this.selectedIndex]?.text;
                            const shouldEnableReturnDate = ['Returned', 'Returned Overdue'].includes(selectedStatus);
                            
                            returnDateInput.disabled = !shouldEnableReturnDate;
                            returnDateInput.required = shouldEnableReturnDate;
                            returnDateInput.style.backgroundColor = shouldEnableReturnDate ? '' : '#f5f5f5';
                        });
                    }
                },
                preConfirm: () => {
                    const statusSelect = document.getElementById('editStatus');
                    const returnDateInput = document.getElementById('editReturnDate');
                    
                    if (statusSelect && returnDateInput) {
                        const selectedStatus = statusSelect.options[statusSelect.selectedIndex]?.text;
                        const requiresReturnDate = ['Returned', 'Returned Overdue'].includes(selectedStatus);
                        
                        if (requiresReturnDate && !returnDateInput.value) {
                            Swal.showValidationMessage('Return date is required for this status');
                            return false;
                        }
                    }
                    
                    return {
                        statusId: statusSelect?.value || borrowing.statusID,
                        returnDate: returnDateInput?.value || null
                    };
                }
            });
            
            if (formValues) {
                // Determine the new status
                const newStatus = statusData.data.find(s => s.statusID == formValues.statusId)?.StatusDesc;
                
                // Prepare the request body
                const body = new URLSearchParams({
                    action: 'update',
                    transactionId: transactionId,
                    statusId: formValues.statusId,
                    returnDate: formValues.returnDate || '',
                    newStatus: newStatus || ''
                });
                
                const updateResponse = await fetch('borrowing_operations.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: body
                });
                
                const updateResult = await updateResponse.json();
                
                if (!updateResult.success) {
                    throw new Error(updateResult.error || 'Update failed');
                }
                
                // Show success message with notification info
                let notificationMsg = '';
                if (newStatus === 'Approved') {
                    notificationMsg = ' and approval notification sent to student';
                } else if (newStatus === 'Rejected') {
                    notificationMsg = ' and rejection notification sent to student';
                }
                loadBorrowings();
                Swal.fire({
                    title: 'Success!',
                    text: `Borrowing record has been updated${notificationMsg}.`,
                    icon: 'success',
                    confirmButtonColor: '#036d2b'
                });
            }
        } catch (error) {
            console.error('Error editing borrowing:', error);
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to update borrowing record.',
                icon: 'error',
                confirmButtonColor: '#036d2b'
            });
        }
    }

    // Handle status change to enable/disable return date field
    function handleStatusChange() {
        const statusSelect = document.getElementById('editStatus');
        const returnDateInput = document.getElementById('editReturnDate');
        
        if (!statusSelect || !returnDateInput) return;
        
        const selectedStatus = statusSelect.options[statusSelect.selectedIndex].text;
        
        if (['Pending', 'Approved', 'Rejected'].includes(selectedStatus)) {
            returnDateInput.disabled = true;
            returnDateInput.value = '';
            returnDateInput.style.backgroundColor = '#f5f5f5';
        } else {
            returnDateInput.disabled = false;
            returnDateInput.style.backgroundColor = '';
        }
    }

    // Delete borrowing record
    async function confirmDeleteBorrowing(transactionId) {
        try {
            const result = await Swal.fire({
                title: 'Delete Borrowing Record',
                text: 'Are you sure you want to delete this borrowing record? This action cannot be undone.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                dangerMode: true
            });
            
            if (result.isConfirmed) {
                const response = await fetch('borrowing_operations.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        action: 'delete',
                        transactionId: transactionId
                    })
                });
                
                const data = await response.json();
                
                if (!data.success) {
                    throw new Error(data.error || 'Delete failed');
                }
                
                await loadBorrowings();
                Swal.fire({
                    title: 'Deleted!',
                    text: 'The borrowing record has been deleted.',
                    icon: 'success',
                    confirmButtonColor: '#036d2b'
                });
            }
        } catch (error) {
            console.error('Error deleting borrowing:', error);
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to delete borrowing record.',
                icon: 'error',
                confirmButtonColor: '#036d2b'
            });
        }
    }

    // Get badge class based on borrowing status
    function getBorrowingStatusBadgeClass(status) {
        switch(status) {
            case 'Pending': return 'badge-warning';
            case 'Approved': return 'badge-success';
            case 'Returned': return 'badge-primary';
            case 'Overdue': return 'badge-danger';
            case 'Returned Overdue': return 'badge-danger';
            case 'Rejected': return 'badge-danger';
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
            (borrowing.Title && borrowing.Title.toLowerCase().includes(searchTerm)) ||
            (borrowing.FirstName && borrowing.FirstName.toLowerCase().includes(searchTerm)) ||
            (borrowing.LastName && borrowing.LastName.toLowerCase().includes(searchTerm)) ||
            (borrowing.Email && borrowing.Email.toLowerCase().includes(searchTerm)) ||
            (borrowing.StatusDesc && borrowing.StatusDesc.toLowerCase().includes(searchTerm))
        );
        
        const tableBody = document.getElementById('borrowingTableBody');
        tableBody.innerHTML = '';
        
        filteredBorrowings.forEach(borrowing => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${borrowing.Title || 'N/A'}</td>
                <td>${borrowing.FirstName} ${borrowing.LastName} (${borrowing.Email})</td>
                <td>${formatDate(borrowing.BorrowedDate)}</td>
                <td>${borrowing.DueDate ? formatDate(borrowing.DueDate) : '-'}</td>
                <td>${borrowing.ReturnDate ? formatDate(borrowing.ReturnDate) : '-'}</td>
                <td><span class="badge ${getBorrowingStatusBadgeClass(borrowing.StatusDesc)}">${borrowing.StatusDesc}</span></td>
                <td>
                    <button class="btn-icon" onclick="editBorrowing(${borrowing.transactionID})">
                        <i class="fas fa-edit"></i>
                    </button>
                    
                    </button>
                    ${borrowing.StatusDesc === 'Approved' && !borrowing.ReturnDate ? 
                        `<button class="btn-icon" onclick="processReturn(${borrowing.transactionID})">
                            <i class="fas fa-book"></i>
                        </button>` : ''}
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
            borrowing.StatusDesc === status
        );
        
        const tableBody = document.getElementById('borrowingTableBody');
        tableBody.innerHTML = '';
        
        filteredBorrowings.forEach(borrowing => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${borrowing.Title || 'N/A'}</td>
                <td>${borrowing.FirstName} ${borrowing.LastName} (${borrowing.Email})</td>
                <td>${formatDate(borrowing.BorrowedDate)}</td>
                <td>${borrowing.DueDate ? formatDate(borrowing.DueDate) : '-'}</td>
                <td>${borrowing.ReturnDate ? formatDate(borrowing.ReturnDate) : '-'}</td>
                <td><span class="badge ${getBorrowingStatusBadgeClass(borrowing.StatusDesc)}">${borrowing.StatusDesc}</span></td>
                <td>
                    <button class="btn-icon" onclick="editBorrowing(${borrowing.transactionID})">
                        <i class="fas fa-edit"></i>
                    </button>
                    
                    </button>
                    ${borrowing.StatusDesc === 'Approved' && !borrowing.ReturnDate ? 
                        `<button class="btn-icon" onclick="processReturn(${borrowing.transactionID})">
                            <i class="fas fa-book"></i>
                        </button>` : ''}
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
                <div class="dashboard-tables">
                    <div class="table-container" onclick="showContent('borrowing')">
                        <div class="table-header">
                            <i class="fas fa-exclamation-circle"></i>
                            <h3>Overdue Books</h3>
                        </div>
                        <div class="table-content">
                            <table class="snippet-table">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Book Title</th>
                                        <th>Due Date</th>
                                    </tr>
                                </thead>
                                <tbody id="overdueBooksTable">
                                    <!-- Will be populated dynamically -->
                                </tbody>
                            </table>
                        </div>
                        <div class="table-footer">
                            <span>Click to view all borrowings</span>
                            <i class="fas fa-arrow-right"></i>
                        </div>
                    </div>

                    <div class="table-container" onclick="showContent('borrowing')">
                        <div class="table-header">
                            <i class="fas fa-clock"></i>
                            <h3>Pending Approvals</h3>
                        </div>
                        <div class="table-content">
                            <table class="snippet-table">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Book Title</th>
                                        <th>Request Date</th>
                                    </tr>
                                </thead>
                                <tbody id="pendingApprovalsTable">
                                    <!-- Will be populated dynamically -->
                                </tbody>
                            </table>
                        </div>
                        <div class="table-footer">
                            <span>Click to view all borrowings</span>
                            <i class="fas fa-arrow-right"></i>
                        </div>
                    </div>
                </div>
            </div>
        `,
    'inventory': `
            <div class="content-section">
                <div class="section-header">
                    <h2><span class="section-indicator">Book Accession</span> Management</h2>
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
                
                <div id="loadingOverlay" style="display: none;">
                    <i class="fas fa-spinner fa-spin"></i> Loading books...
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
                            <!-- Books will be loaded here -->
                        </tbody>
                    </table>
                </div>
                
                <div class="pagination">
                    <button class="btn-pagination" onclick="prevPage()">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <span id="currentPage">1</span>     
                    <button class="btn-pagination" onclick="nextPage()">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `,
        'borrowing': `
            <div class="content-section">
                <div class="section-header">
                    <h2><span class="section-indicator">Borrowing/Returns</span> Management</h2>
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
                            <option value="Rejected">Rejected</option>
                            <option value="Returned">Returned</option>
                            <option value="Overdue">Overdue</option>
                            <option value="Returned Overdue">Returned Overdue</option>
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
            <div class="content-section" id="settingsSection">
        <div class="section-header">
            <h2><span class="section-indicator">System Settings</span></h2>
            <div class="section-divider"></div>
            <div class="tab-buttons">
                <button onclick="showTab('logo')" class="tab-btn active"><i class="fas fa-image"></i> School Logo</button>
                <button onclick="showTab('contact')" class="tab-btn"><i class="fas fa-address-book"></i> Contact Info</button>
                <button onclick="showTab('maxbooks')" class="tab-btn"><i class="fas fa-book"></i> Max Books</button>
                <button onclick="showTab('backup')" class="tab-btn"><i class="fas fa-download"></i> Backup</button>
            </div>
            </div>
        
            <div class="tab-content" id="logo"  ">
        <h3>Update School Logo</h3>
        <div class="logo-upload-container">
            <div class="current-logo-preview">
                <h4>Current Logo</h4>
                <img id="currentLogoDisplay" src="../photos/logo.jpg" alt="Current Logo">
            </div>
            
            <div class="logo-upload-form">
                <div class="upload-area" id="dropZone">
                    <i class="fas fa-cloud-upload-alt upload-icon"></i>
                    <p>Drag & drop your logo here or</p>
                    <label for="logoUpload" class="btn btn-primary">
                        <i class="fas fa-folder-open"></i> Browse Files
                    </label>
                    <input type="file" id="logoUpload" accept="image/*" style="display: none;">
                </div>
                <div class="preview-area" id="previewArea" style="display: none;">
                    <h4>New Logo Preview</h4>
                    <img id="logoPreview" src="#" alt="Logo Preview">
                    <div class="upload-actions">
                        <button class="btn btn-secondary" id="cancelUpload">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button class="btn btn-primary" id="saveLogo">
                            <i class="fas fa-save"></i> Save Logo
                        </button>
                    </div>
                </div>
                <p class="text-muted">Recommended size: 200x200 pixels (PNG or JPG)</p>
                <div class="upload-progress" style="display: none;">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <span class="progress-text">Uploading: 0%</span>
                </div>
            </div>
        </div>
    </div>


            <!-- Contact Info Tab -->
            <div class="tab-content" id="contact">
            <div class="settings-form">
                <div class="form-group floating-label">
                    <input type="email" id="contactEmail" class="form-control" placeholder=" ">
                    <label for="contactEmail">Email Address</label>
                    <i class="fas fa-envelope input-icon"></i>
                </div>
                <div class="form-group floating-label">
                    <input type="tel" id="contactPhone" class="form-control" placeholder=" ">
                    <label for="contactPhone">Telephone Number</label>
                    <i class="fas fa-phone input-icon"></i>
                </div>
                <div class="form-actions">
                    <button class="btn btn-primary save-btn" onclick="saveContactInfo()">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                </div>
            </div>
        </div>
        
            
            <!-- Max Books Tab -->
                <div class="tab-content" id="maxbooks">
                    <div class="settings-form">
                        <div class="form-group floating-label">
                            <input type="number" id="maxBooks" class="form-control" value="5" min="1" max="10" placeholder=" ">
                            <label for="maxBooks">Maximum Books per Student</label>
                            <i class="fas fa-book maxicon"></i>
                            <div class="input-hint">Between 1-10 books</div>
                        </div>
                        <div class="form-actions">
                            <button class="btn btn-primary save-btn" onclick="saveMaxBooks()">
                                <i class="fas fa-save"></i> Save Changes
                            </button>
                        </div>
                    </div>
                </div>

        
        </div>
        
            <div class="tab-content" id="backup">
                <h3>Backup Data</h3>
                <label>Select Data Type:</label>
                <select class="form-control">
                    <option>User Management</option>
                    <option>Book Inventory</option>
                    <option>Borrow/Returns</option>
                </select>
                <label>Filter by:</label>
                <select class="form-control">
                    <option>Day</option>
                    <option>Month</option>
                    <option>Year</option>
                </select>
                <button class="btn btn-primary"><i class="fas fa-download"></i> Download Excel</button>
            </div>
        </div>
        
            `
    };

    // Save settings function
    function saveSettings(tabId) {
        // Here you would collect the data from the form and send it to the server
        // For now, we'll just show a success message
        
        let settingName = '';
        switch(tabId) {
            case 'logo':
                settingName = 'School Logo';
                break;
            case 'contact':
                settingName = 'Contact Information';
                break;
            case 'maxbooks':
                settingName = 'Maximum Books';
                break;

        }
        
        Swal.fire({
            title: 'Settings Saved',
            text: `${settingName} settings have been saved successfully.`,
            icon: 'success',
            confirmButtonColor: '#036d2b'
        });
        
        // In a real implementation, you would:
        // 1. Collect the form data
        // 2. Send it to the server via AJAX
        // 3. Handle the response
        // Example:
        /*
        const formData = new FormData();
        // Add form data based on tabId
        if (tabId === 'logo') {
            const logoFile = document.querySelector('#logo input[type="file"]').files[0];
            formData.append('logo', logoFile);
        } else if (tabId === 'contact') {
            // etc...
        }
        
        fetch('save_settings.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show success message
            } else {
                // Show error message
            }
        });
        */
    }
    // Function to save contact information
    async function saveContactInfo() {
        try {
            const email = document.getElementById('contactEmail').value;
            const phone = document.getElementById('contactPhone').value;
            
            const response = await fetch('contact_operations.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'save',
                    email: email,
                    telephone: phone
                })
            });
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Failed to save contact information');
            }
            
            // Show success message with animation
            const saveBtn = document.querySelector('.save-btn');
            saveBtn.classList.add('save-success');
            saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
            
            setTimeout(() => {
                saveBtn.classList.remove('save-success');
                saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
            }, 2000);
            
        } catch (error) {
            console.error('Error saving contact info:', error);
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to save contact information',
                icon: 'error',
                confirmButtonColor: '#036d2b'
            });
        }
    }

    // Function to load contact information
    async function loadContactInfo() {
        try {
            const response = await fetch('fetch_contact_info.php');
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Failed to load contact information');
            }
            
            // Set the values in the form
            document.getElementById('contactEmail').value = result.data.email || '';
            document.getElementById('contactPhone').value = result.data.telephone || '';
            
        } catch (error) {
            console.error('Error loading contact info:', error);
            // Don't show error to user as this happens on page load
        }
    }

    // Function to save max books setting
    async function saveMaxBooks() {
        try {
            const maxBooks = document.getElementById('maxBooks').value;
            
            const response = await fetch('maxbooks_operations.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'save',
                    maxBooks: maxBooks
                })
            });
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Failed to save maximum books setting');
            }
            
            // Show success message with animation
            const saveBtn = document.querySelector('#maxbooks .save-btn');
            saveBtn.classList.add('save-success');
            saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
            
            setTimeout(() => {
                saveBtn.classList.remove('save-success');
                saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
            }, 2000);
            
        } catch (error) {
            console.error('Error saving max books:', error);
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to save maximum books setting',
                icon: 'error',
                confirmButtonColor: '#036d2b'
            });
        }
    }

    // Function to load max books setting
    async function loadMaxBooks() {
        try {
            const response = await fetch('maxbooks_operations.php?action=fetch');
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Failed to load maximum books setting');
            }
            
            // Set the value in the form
            document.getElementById('maxBooks').value = result.maxBooks;
            
        } catch (error) {
            console.error('Error loading max books:', error);
            // Don't show error to user as this happens on page load
        }
    }

    // Call loadMaxBooks when the maxbooks tab is shown
    function showTab(tabId) {
        const contents = document.querySelectorAll('.tab-content');
        const buttons = document.querySelectorAll('.tab-btn');

        contents.forEach(content => content.style.display = 'none');
        buttons.forEach(btn => btn.classList.remove('active'));

        document.getElementById(tabId).style.display = 'block';
        document.querySelector(`.tab-btn[onclick="showTab('${tabId}')"]`).classList.add('active');
        
        // Load appropriate data when tab is shown
        if (tabId === 'contact') {
            loadContactInfo();
        } else if (tabId === 'maxbooks') {
            loadMaxBooks();
        }
    }

    // Load overdue books and pending approvals for dashboard
    async function loadDashboardData() {
        try {
            // Load overdue books
            const overdueResponse = await fetch('fetch_borrowings.php?status=Overdue&limit=5');
            const overdueData = await overdueResponse.json();
            
            if (overdueData.success) {
                const overdueTable = document.getElementById('overdueBooksTable');
                overdueTable.innerHTML = '';
                
                overdueData.data.forEach(borrowing => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${borrowing.FirstName} ${borrowing.LastName}</td>
                        <td>${borrowing.Title}</td>
                        <td>${formatDate(borrowing.DueDate)}</td>
                    `;
                    overdueTable.appendChild(row);
                });
            }

            // Load pending approvals
            const pendingResponse = await fetch('fetch_borrowings.php?status=Pending&limit=5');
            const pendingData = await pendingResponse.json();
            
            if (pendingData.success) {
                const pendingTable = document.getElementById('pendingApprovalsTable');
                pendingTable.innerHTML = '';
                
                pendingData.data.forEach(borrowing => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${borrowing.FirstName} ${borrowing.LastName}</td>
                        <td>${borrowing.Title}</td>
                        <td>${formatDate(borrowing.BorrowedDate)}</td>
                    `;
                    pendingTable.appendChild(row);
                });
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    // Update the showContent function to load dashboard data when showing homepage
    function showContent(sectionId) {
        // Update navigation active state
        const navLinks = document.querySelectorAll(".nav-list a");
        navLinks.forEach(nav => {
            // Remove active class from all nav items
            nav.classList.remove("active");
            // Add active class to the matching nav item
            if (nav.getAttribute('onclick')?.includes(sectionId)) {
                nav.classList.add("active");
            }
        });
        
        // Show loading state
        const panelContent = document.getElementById("panelContent");
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
                } else if (sectionId === 'homepage') {
                    loadDashboardData();
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

    function showTab(tabId) {
        const contents = document.querySelectorAll('.tab-content');
        const buttons = document.querySelectorAll('.tab-btn');

        contents.forEach(content => content.style.display = 'none');
        buttons.forEach(btn => btn.classList.remove('active'));

        document.getElementById(tabId).style.display = 'block';
        document.querySelector(`.tab-btn[onclick="showTab('${tabId}')"]`).classList.add('active');
    }
