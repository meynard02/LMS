<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Form with Logo</title>
  <link rel="stylesheet" href="../login/style.css">
  <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <style>
      /* Modal styles */
      .modal {
          display: none;
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
      }
      
      .modal-content {
          background-color: #f8d7da;
          color: #721c24;
          margin: 15% auto;
          padding: 20px;
          border: 1px solid #f5c6cb;
          width: 80%;
          max-width: 400px;
          border-radius: 5px;
      }
      
      .modal-content p {
          white-space: pre-line;
          text-align: left;
          margin: 15px 0;
          line-height: 1.6;
      }
      
      .close-btn {
          color: #721c24;
          float: right;
          font-size: 28px;
          font-weight: bold;
          cursor: pointer;
      }
      
      .close-btn:hover {
          color: #491217;
      }
  </style>
</head>
<body>
<div class="logofolder">  
    <img src="../photos/lmslogo.png" alt="lmslogo" class="lmslogo">
    <div class="logochange">
      <img src="../photos/logo.jpg" alt="Logo" class="logoslot">
    </div>
  </div>    

  <div class="wrapper">
    <img src="../photos/logo.jpg" alt="Logo" class="logo">
    <form action="../login/login.php" method="POST" id="login-form">
      <h1>SIGN IN TO YOUR ACCOUNT</h1>
      <div class="input-box">
        <input type="text" id="username" name="username" placeholder="Email or Username" required>
        <i class='bx bxs-user' aria-label="Username Icon"></i>
      </div>
      <div class="input-box">
        <input type="password" id="password" name="password" placeholder="Password" required>
        <i class='bx bx-hide' id="togglePassword" aria-label="Toggle Password Visibility"></i>
      </div>

      <div class="attempt-counter" id="attemptCounter" style="display: none;">
        <i class='bx bx-error-circle'></i>
        <div class="attempt-info">
          <span id="attemptsLeft">5 attempts remaining</span>
          <div class="attempt-progress">
            <div class="progress-bar">
              <div class="progress-fill" id="attemptProgress"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="lockout-timer" id="lockoutTimer" style="display: none;">
        <i class='bx bx-lock-alt'></i>
        <div class="timer-info">
          <span id="timerDisplay">Account locked for 30 seconds</span>
          <div class="timer-progress">
            <div class="progress-bar">
              <div class="progress-fill" id="timerProgress"></div>
            </div>
          </div>
        </div>
      </div>  

      <div class="remember-forgot">
        <label></label>
        <a href="../Forgot Password/FP.php">Forgot Password?</a>
      </div>
      <button type="submit" class="btn">Login</button>
      <div class="register-link">
        <p>Don't have an account? <a href="../register/register.php">Register</a></p>
        <p><a href="#" id="contactUs">Contact Us</a></p>
      </div>
    </form>
  </div>
          <!-- Error Modal - matches Contact Us style -->
          <div id="errorModal" class="modal">
              <div class="modal-content1">
                  <span class="close-btn">&times;</span>
                  <h3 id="errorTitle">Account Issue</h3>
                  <p id="errorMessage"></p>
                  <div class="contact-info">
                      <p><i class='bx bxs-envelope'></i> Email: <span id="errorContactEmail">support@example.com</span></p>
                      <p><i class='bx bxs-phone'></i> Phone: <span id="errorContactPhone">(123) 456-7890</span></p>
                  </div>
              </div>
          </div>

<!-- Contact Us Modal -->
<div id="contactModal" class="modal">
    <div class="modal-content1">
        <span class="close-btn contact-close">&times;</span>
        <h3>Contact Information</h3>
        <div class="contact-info">
            <p><i class='bx bxs-envelope'></i> Email: <span id="contactEmail">Loading...</span></p>
            <p><i class='bx bxs-phone'></i> Phone: <span id="contactPhone">Loading...</span></p>
        </div>
    </div>
</div>

<script>
    // Handle modals
    const errorModal = document.getElementById('errorModal');
    const contactModal = document.getElementById('contactModal');
    const closeBtns = document.querySelectorAll('.close-btn');
    
    // Set contact info for both modals
    function setContactInfo() {
        fetch('../login/fetch_contact.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('errorContactEmail').textContent = data.email || 'support@example.com';
                    document.getElementById('errorContactPhone').textContent = data.phone || '(123) 456-7890';
                    document.getElementById('contactEmail').textContent = data.email || 'support@example.com';
                    document.getElementById('contactPhone').textContent = data.phone || '(123) 456-7890';
                }
            })
            .catch(error => {
                console.error('Error fetching contact info:', error);
            });
    }
    
    // Close modals
    closeBtns.forEach(btn => {
        btn.onclick = function() {
            errorModal.style.display = 'none';
            contactModal.style.display = 'none';
        }
    });
    
    window.onclick = function(event) {
        if (event.target == errorModal || event.target == contactModal) {
            errorModal.style.display = 'none';
            contactModal.style.display = 'none';
        }
    }
    
    // Check for error on page load
    document.addEventListener('DOMContentLoaded', function() {
        setContactInfo();
        
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        
        if (error) {
            document.getElementById('errorMessage').textContent = error;
            errorModal.style.display = 'block';
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    });
</script>
  <script src="../login/script.js"></script>
  <script>
    // Display error message if exists
    <?php if (isset($_SESSION['error'])): ?>
      alert("<?= $_SESSION['error'] ?>");
      <?php unset($_SESSION['error']); ?>
    <?php endif; ?>
  </script>

      <!-- Contact Us Modal -->
    <div id="contactModal" class="modal">
        <div class="modal-content1">
            <span class="close-btn contact-close">&times;</span>
            <h3>Contact Information</h3>
            <div id="contactInfo">
                <p><i class='bx bxs-envelope'></i> Email: <span id="contactEmail">Loading...</span></p>
                <p><i class='bx bxs-phone'></i> Phone: <span id="contactPhone">Loading...</span></p>
            </div>
        </div>
    </div>

</body>
</html>