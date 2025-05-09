document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const attemptCounter = document.getElementById('attemptCounter');
    const attemptsLeft = document.getElementById('attemptsLeft');
    const attemptProgress = document.getElementById('attemptProgress');
    const lockoutTimer = document.getElementById('lockoutTimer');
    const timerDisplay = document.getElementById('timerDisplay');
    const timerProgress = document.getElementById('timerProgress');
    const togglePassword = document.querySelector("#togglePassword");
    const passwordInput = document.querySelector("#password");
    
    let attempts = 5;
    let isLocked = false;
    let lockoutEndTime = null;
    const LOCKOUT_DURATION = 30000; // 30 seconds in milliseconds

    // Check if there's a lockout in session storage
    const storedLockout = sessionStorage.getItem('loginLockout');
    if (storedLockout) {
        const lockoutData = JSON.parse(storedLockout);
        if (lockoutData.endTime > Date.now()) {
            startLockout(lockoutData.endTime - Date.now());
        } else {
            sessionStorage.removeItem('loginLockout');
        }
    }

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", function() {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            this.classList.toggle("bx-hide");
            this.classList.toggle("bx-show");
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {

            e.preventDefault();
            
            if (isLocked) {
                return;
            }

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            if (!username || !password) {
                showError('Please enter both username and password');
                return;
            }
            // Submit the form
            this.submit();
        });
    }

    // Function to handle failed login attempts
    function handleFailedAttempt() {
        attempts--;
        attemptsLeft.textContent = `${attempts} attempt${attempts !== 1 ? 's' : ''} remaining`;
        attemptCounter.style.display = 'flex';
        
        // Update progress bar
        const progressPercentage = (attempts / 5) * 100;
        attemptProgress.style.width = `${progressPercentage}%`;
        
        // Add shake animation
        loginForm.classList.add('shake');
        setTimeout(() => loginForm.classList.remove('shake'), 500);

        if (attempts <= 0) {
            startLockout(LOCKOUT_DURATION);
        }
    }

    // Function to start the lockout timer
    function startLockout(duration) {
        isLocked = true;
        loginForm.classList.add('form-locked');
        attemptCounter.style.display = 'none';
        lockoutTimer.style.display = 'flex';
        
        const endTime = Date.now() + duration;
        lockoutEndTime = endTime;
        
        // Store lockout in session storage
        sessionStorage.setItem('loginLockout', JSON.stringify({
            endTime: endTime
        }));

        const startTime = Date.now();
        const timer = setInterval(() => {
            const remaining = endTime - Date.now();
            const elapsed = Date.now() - startTime;
            
            if (remaining <= 0) {
                clearInterval(timer);
                resetLockout();
            } else {
                // Update timer display
                const seconds = Math.ceil(remaining / 1000);
                timerDisplay.textContent = `Account locked for ${seconds} second${seconds !== 1 ? 's' : ''}`;
                
                // Update progress bar
                const progressPercentage = (elapsed / duration) * 100;
                timerProgress.style.width = `${progressPercentage}%`;
            }
        }, 100); // Update more frequently for smoother progress bar
    }

    // Function to reset the lockout
    function resetLockout() {
        isLocked = false;
        attempts = 5;
        loginForm.classList.remove('form-locked');
        lockoutTimer.style.display = 'none';
        attemptCounter.style.display = 'none';
        sessionStorage.removeItem('loginLockout');
        
        // Reset progress bars
        attemptProgress.style.width = '100%';
        timerProgress.style.width = '0%';
    }

    // Function to show error messages
    function showError(message) {
        const errorModal = document.getElementById('errorModal');
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = message;
        errorModal.style.display = 'block';
    }

    // Check for error on page load
document.addEventListener('DOMContentLoaded', function() {
    setContactInfo();
    
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error) {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = error;
        
        // Only show contact info if it's an account status issue
        const contactInfoDiv = document.querySelector('#errorModal .contact-info');
        if (error.includes('inactive') || error.includes('suspended')) {
            contactInfoDiv.style.display = 'block';
        } else {
            contactInfoDiv.style.display = 'none';
        }
        
        errorModal.style.display = 'block';
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

    
// Contact Us functionality
const contactUsLink = document.getElementById("contactUs");
const contactModal = document.getElementById("contactModal");
const contactCloseBtn = document.querySelector(".contact-close");

if (contactUsLink && contactModal) {
    contactUsLink.addEventListener("click", function(e) {
        e.preventDefault();
        contactModal.style.display = "block";
        fetchContactInfo();
    });
}

if (contactCloseBtn) {
    contactCloseBtn.onclick = function() {
        contactModal.style.display = "none";
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target == contactModal) {
        contactModal.style.display = "none";
    }
});

// Function to fetch contact info
function fetchContactInfo() {
    fetch('../login/fetch_contact.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('contactEmail').textContent = data.email || 'Not available';
                document.getElementById('contactPhone').textContent = data.phone || 'Not available';
            } else {
                document.getElementById('contactEmail').textContent = 'Error loading data';
                document.getElementById('contactPhone').textContent = 'Error loading data';
                console.error('Error fetching contact info:', data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('contactEmail').textContent = 'Connection error';
            document.getElementById('contactPhone').textContent = 'Connection error';
        });
}
});

