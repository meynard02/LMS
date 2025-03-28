
const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");

// Password visibility toggle
togglePassword.addEventListener("click", function () {
    // Toggle the type attribute
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);

    // Toggle the eye icon
    this.classList.toggle("bx-hide");
    this.classList.toggle("bx-show");
});

// Login function (moved outside)
function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin') {
        // Redirect to adminHP.html
        window.location.href = "adminHP.html";
        return false; // Prevent form submission
    } else {
        alert('Incorrect username or password');
        return false; // Prevent form submission
    }
}

function register() {
    // Get form values
    const fullname = document.getElementById('fullname').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const emailError = document.getElementById('emailError');
  
    // Reset error message
    emailError.style.display = 'none';
  
    // Validate email domain
    if (!email.endsWith('@spist.edu.ph')) {
      emailError.style.display = 'block';
      return false;
    }
  
    // Password validation
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return false;
    }
  
    // Here you would typically send the data to a server
    console.log('Registration data:', { fullname, username, email, password });
    
    // Simulate successful registration
    alert('Registration successful! You can now login.');
    window.location.href = 'home.html#';
    
    return false; // Prevent form submission for this demo
  }
  
  // Real-time email validation
  document.getElementById('email').addEventListener('input', function() {
    const email = this.value;
    const emailError = document.getElementById('emailError');
    
    if (email && !email.endsWith('@spist.edu.ph')) {
      emailError.style.display = 'block';
    } else {
      emailError.style.display = 'none';
    }
  });
  
  // Toggle password visibility
  document.getElementById('togglePassword').addEventListener('click', function() {
    const password = document.getElementById('password');
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    this.classList.toggle('bx-hide');
    this.classList.toggle('bx-show');
  });
  
  document.getElementById('toggleConfirmPassword').addEventListener('click', function() {
    const confirmPassword = document.getElementById('confirm-password');
    const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPassword.setAttribute('type', type);
    this.classList.toggle('bx-hide');
    this.classList.toggle('bx-show');
  });
