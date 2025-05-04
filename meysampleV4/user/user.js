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
    // Fetch all user's books
    fetch('get_user_books.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const list = document.getElementById('finished-reads-list');
                list.innerHTML = ''; // Clear existing content

                // Filter out Pending and Approved books, only keep Returned, Rejected, etc.
                const finishedBooks = data.transactions.filter(book => 
                    book.status !== 'Pending' && book.status !== 'Approved'
                );

                if (finishedBooks.length === 0) {
                    list.innerHTML = `
                        <div class="no-borrows">
                            <i class="fas fa-book-open"></i>
                            <p>You have no finished reads yet</p>
                        </div>
                    `;
                    return;
                }

                finishedBooks.forEach(book => {
                    const item = document.createElement('div');
                    item.className = 'borrow-item';

                    // Check if book was returned overdue
                    const returnedOverdue = book.returnDate ? 
                        (new Date(book.returnDate) > new Date(book.dueDate)) : 
                        false;

                    item.innerHTML = `
                        <div class="borrow-cover" style="${book.cover ? `background-image:url('../uploads/${book.cover}')` : ''}">
                            ${!book.cover ? '<i class="fas fa-book book-icon"></i>' : ''}
                        </div>
                        <div class="borrow-info">
                            <div class="borrow-title">${book.title}</div>
                            <div class="borrow-author">${book.author}</div>
                            <div class="borrow-meta">
                                <span class="borrow-date"><i class="fas fa-calendar-alt"></i> Borrowed: ${formatDisplayDate(book.borrowedDate)}</span>
                                ${book.returnDate ? 
                                    `<span class="borrow-date"><i class="fas fa-calendar-check"></i> Returned: ${formatDisplayDate(book.returnDate)}</span>` : 
                                    ''}
                                <span class="borrow-status ${returnedOverdue ? 'overdue' : ''}">
                                    <i class="fas ${getStatusIcon(book.status)}"></i> 
                                    ${book.status}
                                    ${returnedOverdue ? ' (Overdue)' : ''}
                                </span>
                            </div>
                        </div>
                    `;
                    list.appendChild(item);
                });

                // Initialize the filter functionality
                setupFinishedReadsFilter(finishedBooks);
            } else {
                showToast('Error loading finished reads: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Error loading finished reads', 'error');
        });
}

// Helper function to get appropriate icon for status
function getStatusIcon(status) {
    switch(status.toLowerCase()) {
        case 'returned': return 'fa-check-circle';
        case 'rejected': return 'fa-times-circle';
        case 'lost': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Helper function to format date for display
function formatDisplayDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Setup filter functionality for finished reads
function setupFinishedReadsFilter(books) {
    const filterSelect = document.getElementById('finishedFilter');
    const customDateInput = document.getElementById('customDate');
    
    filterSelect.addEventListener('change', function() {
        applyFinishedReadsFilter(books, this.value, customDateInput.value);
    });
    
    customDateInput.addEventListener('change', function() {
        if (filterSelect.value === 'custom') {
            applyFinishedReadsFilter(books, 'custom', this.value);
        }
    });
}

// Apply filter to finished reads
function applyFinishedReadsFilter(books, filterType, customDate = '') {
    const now = new Date();
    let filteredBooks = [...books];
    
    switch(filterType) {
        case 'week':
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            filteredBooks = books.filter(book => 
                new Date(book.returnDate || book.dueDate) >= oneWeekAgo
            );
            break;
            
        case 'month':
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(now.getMonth() - 1);
            filteredBooks = books.filter(book => 
                new Date(book.returnDate || book.dueDate) >= oneMonthAgo
            );
            break;
            
        case 'year':
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(now.getFullYear() - 1);
            filteredBooks = books.filter(book => 
                new Date(book.returnDate || book.dueDate) >= oneYearAgo
            );
            break;
            
        case 'custom':
            if (customDate) {
                const selectedDate = new Date(customDate);
                filteredBooks = books.filter(book => 
                    new Date(book.returnDate || book.dueDate).toDateString() === selectedDate.toDateString()
                );
            }
            break;
            
        // 'all' is default - show all books
    }
    
    // Update the display
    const list = document.getElementById('finished-reads-list');
    list.innerHTML = '';
    
    if (filteredBooks.length === 0) {
        list.innerHTML = `
            <div class="no-borrows">
                <i class="fas fa-book-open"></i>
                <p>No books match your filter criteria</p>
            </div>
        `;
        return;
    }
    
    filteredBooks.forEach(book => {
        const item = document.createElement('div');
        item.className = 'borrow-item';
        
        const returnedOverdue = book.returnDate ? 
            (new Date(book.returnDate) > new Date(book.dueDate)): 
            false;
        
        item.innerHTML = `
            <div class="borrow-cover" style="${book.cover ? `background-image:url('../uploads/${book.cover}')` : ''}">
                ${!book.cover ? '<i class="fas fa-book book-icon"></i>' : ''}
            </div>
            <div class="borrow-info">
                <div class="borrow-title">${book.title}</div>
                <div class="borrow-author">${book.author}</div>
                <div class="borrow-meta">
                    <span class="borrow-date"><i class="fas fa-calendar-alt"></i> Borrowed: ${formatDisplayDate(book.borrowedDate)}</span>
                    ${book.returnDate ? 
                        `<span class="borrow-date"><i class="fas fa-calendar-check"></i> Returned: ${formatDisplayDate(book.returnDate)}</span>` : 
                        ''}
                    <span class="borrow-status ${returnedOverdue ? 'overdue' : ''}">
                        <i class="fas ${getStatusIcon(book.status)}"></i> 
                        ${book.status}
                        ${returnedOverdue ? ' (Overdue)' : ''}
                    </span>
                </div>
            </div>
        `;
        list.appendChild(item);
    });
}

// ========== Books In My Bag ==========
function setupBooksInBag() {
    // Fetch approved books for the current user
    fetch('get_user_books.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const list = document.getElementById('books-bag-list');
                list.innerHTML = ''; // Clear existing content

                // Filter only approved books that haven't been returned
                const approvedBooks = data.transactions.filter(book => 
                    book.status === 'Approved' && !book.returnDate
                );

                if (approvedBooks.length === 0) {
                    list.innerHTML = `
                        <div class="no-borrows">
                            <i class="fas fa-book-open"></i>
                            <p>You have no books currently in your bag</p>
                        </div>
                    `;
                    return;
                }

                approvedBooks.forEach(book => {
                    const item = document.createElement('div');
                    item.className = 'borrow-item';
                    
                    // Check if book is overdue
                    const today = new Date();
                    const dueDate = new Date(book.dueDate);
                    const isOverdue = today > dueDate;

                    // Highlight the shopping bag icon if any book is overdue
                    if (isOverdue) {
                        document.querySelector(`button[onclick*="books-in-my-bag"] .fa-shopping-bag`).style.color = '#e74c3c';
                    }

                    item.innerHTML = `
                        <div class="borrow-cover" style="${book.cover ? `background-image:url('../uploads/${book.cover}')` : ''}">
                            ${!book.cover ? '<i class="fas fa-book book-icon"></i>' : ''}
                        </div>
                        <div class="borrow-info">
                            <div class="borrow-title">${book.title}</div>
                            <div class="borrow-author">${book.author}</div>
                            <div class="borrow-meta">
                                <span class="borrow-date"><i class="fas fa-calendar-alt"></i> Borrowed: ${formatDisplayDate(book.borrowedDate)}</span>
                                <span class="borrow-date ${isOverdue ? 'overdue' : ''}">
                                    <i class="fas fa-calendar-check"></i> Due: ${formatDisplayDate(book.dueDate)}
                                    ${isOverdue ? '<i class="fas fa-exclamation-triangle"></i>' : ''}
                                </span>
                            </div>
                        </div>
                    `;
                    list.appendChild(item);
                });
            } else {
                showToast('Error loading your books: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Error loading your books', 'error');
        });
}

// Helper function to format date for display
function formatDisplayDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Book data and functionality
function initializeBookData() {
    // Color palette for categories
    const categoryColors = [
        '#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#f39c12', 
        '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b',
        '#8e44ad', '#27ae60', '#d35400', '#2980b9'
    ];

    // Fetch categories and books from server
    fetch('get_books.php')
        .then(response => response.json())
        .then(data => {
            const categories = data.categories;
            const booksData = data.books;
            
            // Clear existing category tabs
            const categoryTabs = document.querySelector('.category-tabs');
            categoryTabs.innerHTML = '';
            
            // Create tabs for first 7 categories
            let categoryCount = 0;
            for (const [id, name] of Object.entries(categories)) {
                if (categoryCount < 7) {
                    const tab = document.createElement('div');
                    tab.className = 'category-tab';
                    tab.style.backgroundColor = categoryColors[categoryCount % categoryColors.length];
                    tab.setAttribute('data-category-id', id);
                    tab.setAttribute('onclick', `showBookPanel(${id})`);
                    
                    // Add icon based on category name
                    let iconClass = 'fa-book';
                    if (name.toLowerCase().includes('science')) iconClass = 'fa-flask';
                    if (name.toLowerCase().includes('filipino')) iconClass = 'fa-flag';
                    if (name.toLowerCase().includes('pe') || name.toLowerCase().includes('physical')) iconClass = 'fa-running';
                    if (name.toLowerCase().includes('music')) iconClass = 'fa-music';
                    if (name.toLowerCase().includes('english')) iconClass = 'fa-language';
                    if (name.toLowerCase().includes('history') || name.toLowerCase().includes('ap')) iconClass = 'fa-globe-asia';
                    
                    tab.innerHTML = `<i class="fas ${iconClass}"></i> ${name}`;
                    categoryTabs.appendChild(tab);
                    categoryCount++;
                }
            }
            
            // Add "More" tab if there are more categories
            if (Object.keys(categories).length > 7) {
                const moreTab = document.createElement('div');
                moreTab.className = 'category-tab more';
                moreTab.innerHTML = '<i class="fas fa-ellipsis-h"></i> More';
                moreTab.onclick = function() {
                    showMoreCategories(categories, booksData, categoryColors);
                };
                categoryTabs.appendChild(moreTab);
            }
            
            // Store books data globally
            initializeBookData.booksData = booksData;
            initializeBookData.categories = categories;
        });
}

// Function to show more categories in a modal
function showMoreCategories(categories, booksData, colors) {
    // Create modal for additional categories
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.maxWidth = '600px';
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-modal';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = function() {
        modal.remove();
    };
    
    const title = document.createElement('h2');
    title.innerHTML = '<i class="fas fa-list"></i> More Categories';
    
    const categoriesContainer = document.createElement('div');
    categoriesContainer.className = 'categories-grid';
    categoriesContainer.style.display = 'grid';
    categoriesContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
    categoriesContainer.style.gap = '10px';
    categoriesContainer.style.marginTop = '20px';
    
    // Add categories starting from the 8th one
    let categoryCount = 0;
    for (const [id, name] of Object.entries(categories)) {
        if (categoryCount >= 7) {
            const categoryBtn = document.createElement('div');
            categoryBtn.className = 'category-tab';
            categoryBtn.style.backgroundColor = colors[(categoryCount + 7) % colors.length];
            categoryBtn.style.cursor = 'pointer';
            categoryBtn.style.padding = '10px';
            categoryBtn.style.textAlign = 'center';
            categoryBtn.setAttribute('data-category-id', id);
            
            categoryBtn.innerHTML = name;
            categoryBtn.onclick = function() {
                showBookPanel(id);
                modal.remove();
            };
            categoriesContainer.appendChild(categoryBtn);
        }
        categoryCount++;
    }
    
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(title);
    modalContent.appendChild(categoriesContainer);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    };
}

// Modified showBookPanel function
window.showBookPanel = function(categoryId) {
    if (!initializeBookData.booksData) return;
    
    const categoryName = initializeBookData.categories[categoryId] || 'Unknown Category';
    document.getElementById('books-panel-title').textContent = `${categoryName} Books`;
    
    const bookGrid = document.getElementById('bookGrid');
    bookGrid.innerHTML = "";
    
    const books = initializeBookData.booksData[categoryId] || [];
    
    if (books.length === 0) {
        bookGrid.innerHTML = '<div class="no-books"><i class="fas fa-book"></i><p>No books available in this category</p></div>';
    } else {
        books.forEach(book => {
            const bookCard = document.createElement("div");
            bookCard.className = "book-card";
            bookCard.setAttribute('data-category-id', categoryId);
            
            const coverPath = book.photo ? `../uploads/${book.photo}` : '';
            const coverContent = book.photo 
                ? `<div class="book-cover" style="background-image: url('${coverPath}')"></div>`
                : `<div class="book-cover"><i class="fas fa-book book-icon"></i></div>`;
            
            bookCard.innerHTML = `
                ${coverContent}
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
                <div class="book-availability">
                    <span class="availability-status ${book.availability === 'Available' ? 'available' : 'not-available'}">
                        ${book.availability}
                    </span>
                </div>
            `;
            bookGrid.appendChild(bookCard);
        });
    }
    
    showPanel('books');
    
    // Highlight the active category tab
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active-tab');
        if (tab.getAttribute('data-category-id') === categoryId) {
            tab.classList.add('active-tab');
        }
    });
};

// Book Borrowing Functionality
function setupBookBorrowing() {
    // Store pending borrows in localStorage
    let pendingBorrows = JSON.parse(localStorage.getItem('pendingBorrows')) || [];
    let currentBookToBorrow = null;

    // Open book details modal when a book is clicked
    document.addEventListener('click', function(e) {
        const bookCard = e.target.closest('.book-card');
        if (bookCard) {
            const bookTitle = bookCard.querySelector('.book-title').textContent;
            const categoryId = bookCard.getAttribute('data-category-id');
            const books = initializeBookData.booksData[categoryId] || [];
            
            // Find the book in our data
            const book = books.find(b => b.title === bookTitle);
            if (book) {
                showBookDetails(book);
            }
        }
    });

    // Function to show book details in modal
    function showBookDetails(book) {
        document.getElementById('modal-book-title').textContent = book.title;
        document.getElementById('modal-book-author').textContent = book.author;
        
        // Format category display as "Category, Title" (e.g. "Computer, Java")
        const categoryDisplay = `${book.category || 'Not specified'}, ${book.title}`;
        document.getElementById('modal-book-category').textContent = categoryDisplay;
        
        document.getElementById('modal-book-description').textContent = book.description || 'No description available';
        document.getElementById('modal-book-year').textContent = book.publishedYear === '0000' ? 'Not specified' : book.publishedYear;
        document.getElementById('modal-book-accession').textContent = book.accessionNo || '--';
        
        // Set book cover
        const coverElement = document.getElementById('modal-book-cover');
        if (book.photo) {
            coverElement.style.backgroundImage = `url('../uploads/${book.photo}')`;
            coverElement.innerHTML = '';
        } else {
            coverElement.style.backgroundImage = '';
            coverElement.innerHTML = '<i class="fas fa-book book-icon"></i>';
        }
        
        // Set availability
        const availabilityElement = document.getElementById('modal-book-availability');
        availabilityElement.textContent = book.availability || 'Available';
        availabilityElement.className = 'availability-status ' + 
            (book.availability === 'Available' ? 'available' : 'not-available');
        
        // Set up borrow button
        const borrowBtn = document.getElementById('borrow-btn');
        const isAlreadyBorrowed = pendingBorrows.some(b => b.title === book.title);
        
        if (isAlreadyBorrowed || book.availability !== 'Available') {
            borrowBtn.disabled = true;
            borrowBtn.innerHTML = '<i class="fas fa-check-circle"></i> ' + 
                (isAlreadyBorrowed ? 'Already Requested' : 'Not Available');
        } else {
            borrowBtn.disabled = false;
            borrowBtn.innerHTML = '<i class="fas fa-bookmark"></i> Borrow Book';
            borrowBtn.onclick = function() {
                showBorrowModal(book); // Changed from borrowBook to showBorrowModal
            };
        }
        
        // Show modal
        document.getElementById('book-details-modal').style.display = 'block';
    }

    // Show borrow modal with dates
    function showBorrowModal(book) {
        currentBookToBorrow = book;
        
        // Set dates
        const today = new Date();
        const minDate = new Date();
        minDate.setDate(today.getDate() + 5); // 5 days from now
        
        // Find next available date (skip Sundays)
        while (minDate.getDay() === 0) { // 0 is Sunday
            minDate.setDate(minDate.getDate() + 1);
        }
        
        const dueDate = new Date(minDate);
        dueDate.setDate(minDate.getDate() + 10); // 10 days from borrow date
        
        // Format dates as YYYY-MM-DD for input fields
        document.getElementById('borrow-date').value = formatDate(minDate);
        document.getElementById('due-date').value = formatDate(dueDate);
        
        // Set min date (5 days from now) and disable Sundays
        const borrowDateInput = document.getElementById('borrow-date');
        borrowDateInput.min = formatDate(minDate);
        borrowDateInput.onchange = function() {
            const selectedDate = new Date(this.value);
            // Skip Sundays
            if (selectedDate.getDay() === 0) {
                alert("Borrowing is not available on Sundays. Please select another date.");
                this.value = formatDate(minDate);
                return;
            }
            
            // Update due date (10 days after selected date)
            const newDueDate = new Date(selectedDate);
            newDueDate.setDate(selectedDate.getDate() + 10);
            document.getElementById('due-date').value = formatDate(newDueDate);
        };
        
        // Show modal
        document.getElementById('borrow-modal').style.display = 'block';
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Close modal when clicking X button
    document.querySelector('#borrow-modal .close-modal').addEventListener('click', function() {
        document.getElementById('borrow-modal').style.display = 'none';
        currentBookToBorrow = null;
    });

    // Close modal when clicking Cancel button
    document.getElementById('cancel-borrow-btn').addEventListener('click', function() {
        document.getElementById('borrow-modal').style.display = 'none';
        currentBookToBorrow = null;
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('borrow-modal')) {
            document.getElementById('borrow-modal').style.display = 'none';
            currentBookToBorrow = null;
        }
    });

    // Add event listener for confirm borrow button
    // Update the confirm borrow button event listener
document.getElementById('confirm-borrow-btn').addEventListener('click', function() {
    if (!currentBookToBorrow) return;
    
    const borrowDate = document.getElementById('borrow-date').value;
    const dueDate = document.getElementById('due-date').value;
    
    // Show loading state
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    this.disabled = true;
    
    // Send borrow request to server
    fetch('borrow_book.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            accessionNo: currentBookToBorrow.accessionNo,
            userId: currentUser.id,
            borrowDate: borrowDate,
            dueDate: dueDate
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            showToast(data.message || 'Book borrowed successfully!', 'success');
            
            // Update UI
            const borrowBtn = document.getElementById('borrow-btn');
            borrowBtn.disabled = true;
            borrowBtn.innerHTML = '<i class="fas fa-check-circle"></i> Borrowed';
            
            // Add to pending borrows
            const newBorrow = {
                title: currentBookToBorrow.title,
                author: currentBookToBorrow.author,
                cover: currentBookToBorrow.photo,
                accessionNo: currentBookToBorrow.accessionNo,
                borrowDate: borrowDate,
                dueDate: dueDate,
                status: "Pending Approval"
            };
            
            let pendingBorrows = JSON.parse(localStorage.getItem('pendingBorrows')) || [];
            pendingBorrows.push(newBorrow);
            localStorage.setItem('pendingBorrows', JSON.stringify(pendingBorrows));
            
            // Update borrows badge
            updateBorrowsBadge();
            
            // Update pending borrows display if on that panel
            if (document.getElementById('my-borrows-section').classList.contains('active')) {
                updatePendingBorrowsDisplay();
            }
        } else {
            showToast(data.message || 'Error borrowing book', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error communicating with server', 'error');
    })
    .finally(() => {
        // Reset button state
        this.innerHTML = '<i class="fas fa-check"></i> Confirm Borrow';
        this.disabled = false;
        
        // Close modal
        document.getElementById('borrow-modal').style.display = 'none';
        currentBookToBorrow = null;
    });
});

    // Function to update pending borrows display
window.updatePendingBorrowsDisplay = function() {
    const container = document.getElementById('pending-borrows');
    const noBorrowsMessage = document.getElementById('no-borrows-message');
    const pendingBorrows = JSON.parse(localStorage.getItem('pendingBorrows')) || [];
    
    // Clear existing borrows
    container.querySelectorAll('.borrow-item').forEach(borrow => borrow.remove());
    
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
            <div class="borrow-cover" style="${borrow.cover ? `background-image: url('../uploads/${borrow.cover}')` : ''}">
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
    const pendingBorrows = JSON.parse(localStorage.getItem('pendingBorrows')) || [];
    const borrow = pendingBorrows[index];
    
    // Show loading state
    const cancelBtn = document.querySelector(`.cancel-borrow[data-index="${index}"]`);
    cancelBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Canceling...';
    cancelBtn.disabled = true;

    // Send cancel request to server
    fetch('cancel_borrow.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            accessionNo: borrow.accessionNo
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Remove from pending borrows
            pendingBorrows.splice(index, 1);
            localStorage.setItem('pendingBorrows', JSON.stringify(pendingBorrows));
            
            // Update UI
            updateBorrowsBadge();
            updatePendingBorrowsDisplay();
            
            showToast(`Borrow request for "${borrow.title}" cancelled`, 'success');
            
            // Refresh book availability in the grid
            refreshBookAvailability(borrow.accessionNo);
        } else {
            showToast(data.message || 'Error cancelling borrow request', 'error');
            cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
            cancelBtn.disabled = false;
        }
    })
    .catch(error => {
        showToast('Error communicating with server', 'error');
        console.error('Error:', error);
        cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
        cancelBtn.disabled = false;
    });
}

// Helper function to refresh book availability in the grid
function refreshBookAvailability(accessionNo) {
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach(card => {
        if (card.getAttribute('data-accession') === accessionNo) {
            const availabilityElement = card.querySelector('.availability-status');
            availabilityElement.textContent = 'Available';
            availabilityElement.className = 'availability-status available';
        }
    });
}
    
    // Function to update borrows badge count
    function updateBorrowsBadge() {
        const navBadge = document.getElementById('borrows-badge');
        const profileBadge = document.getElementById('profile-borrows-badge');
        pendingBorrows = JSON.parse(localStorage.getItem('pendingBorrows')) || [];
        
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