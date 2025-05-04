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
        /* Popup modal styles */
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
            text-align: center;
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
  <img src="../photos/lmslogo.png" alt="lmslogo" class="lmslogo">
  <div class="logochange">
    <img src="../photos/logo.jpg" alt="Logo" class="logoslot">
  </div>
  <div class="wrapper">
    <img src="../photos/logo.jpg" alt="Logo" class="logo">
    <form action="../login/login.php" method="POST" id="login-form">
      <h1>SIGN IN TO YOUR ACCOUNT</h1>
      <div class="input-box">
        <input type="text" id="username" name="username" placeholder="Username" required>
        <i class='bx bxs-user' aria-label="Username Icon"></i>
      </div>
      <div class="input-box">
        <input type="password" id="password" name="password" placeholder="Password" required>
        <i class='bx bx-hide' id="togglePassword" aria-label="Toggle Password Visibility"></i>
      </div>
      <div class="remember-forgot">
        <label><input type="checkbox">Remember me</label>
        <a href="../Forgot Password/FP.php">Forgot Password?</a>
      </div>
      <button type="submit" class="btn">Login</button>
      <div class="register-link">
        <p>Don't have an account? <a href="../register/register.php">Register</a></p>
      </div>
    </form>
  </div>
  <div id="errorModal" class="modal">
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <p id="errorMessage"></p>
        </div>
    </div>

    <script>
        // Handle modal display
        const modal = document.getElementById('errorModal');
        const closeBtn = document.querySelector('.close-btn');
        
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        }
        
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
        
        // Check for error on page load
        document.addEventListener('DOMContentLoaded', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const error = urlParams.get('error');
            
            if (error) {
                document.getElementById('errorMessage').textContent = error;
                modal.style.display = 'block';
                
                // Clear the error from URL
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
</body>
</html>