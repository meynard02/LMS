// Real-time email validation
document.getElementById('email').addEventListener('input', function() {
  const email = this.value;
  const emailError = document.getElementById('emailError');
  
  if (email && !email.endsWith('@spist.edu.ph')) {
      if (!emailError) {
          // Create error element if it doesn't exist
          const errorElement = document.createElement('div');
          errorElement.id = 'emailError';
          errorElement.style.color = 'red';
          errorElement.style.margin = '5px 0';
          errorElement.style.fontSize = '12px';
          errorElement.textContent = 'Only @spist.edu.ph emails are allowed';
          this.parentNode.insertBefore(errorElement, this.nextSibling);
      }
  } else if (emailError) {
      emailError.remove();
  }
});

// Password validation function
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

// Real-time password validation
document.getElementById('password').addEventListener('input', function() {
  const password = this.value;
  const passwordError = document.getElementById('passwordError');
  const requirements = document.getElementById('passwordRequirements');
  
  // Remove existing error if any
  if (passwordError) {
      passwordError.remove();
  }
  
  const validation = validatePassword(password);
  
  if (password && !validation.isValid) {
      const errorElement = document.createElement('div');
      errorElement.id = 'passwordError';
      errorElement.style.color = 'red';
      errorElement.style.margin = '5px 0';
      errorElement.style.fontSize = '12px';
      errorElement.textContent = 'Missing: ' + validation.errors.join(', ');
      this.parentNode.insertBefore(errorElement, this.nextSibling);
  }
  
  // Update requirements list
  if (requirements) {
      requirements.innerHTML = `
          <p style="font-size: 12px; margin-top: -20px; margin-bottom: 20px; text-align: left;">
              Password must contain:
              <br>- ${password.length >= 8 ? '✓' : '✗'} At least 8 characters
              <br>- ${/[A-Z]/.test(password) ? '✓' : '✗'} Uppercase letter
              <br>- ${/[a-z]/.test(password) ? '✓' : '✗'} Lowercase letter
              <br>- ${/[0-9]/.test(password) ? '✓' : '✗'} Number
              <br>- ${/[\W_]/.test(password) ? '✓' : '✗'} Special character
          </p>
      `;
  }
});

// Form submission validation
document.getElementById('register-form').addEventListener('submit', function(e) {
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  const validation = validatePassword(password);
  
  if (!validation.isValid) {
      e.preventDefault();
      alert('Please fix all password requirements before submitting.');
      return false;
  }
  
  if (password !== confirmPassword) {
      e.preventDefault();
      alert('Passwords do not match.');
      return false;
  }
  
  return true;
});


// Confirm password matching validation
document.getElementById('confirm-password').addEventListener('input', function() {
    const password = document.getElementById('password').value;
    const confirmPassword = this.value;
    const confirmError = document.getElementById('confirmError');
    
    // Remove existing error if any
    if (confirmError) {
        confirmError.remove();
    }
    
    // Check if passwords match
    if (confirmPassword && password !== confirmPassword) {
        const errorElement = document.createElement('div');
        errorElement.id = 'confirmError';
        errorElement.style.color = 'red';
        errorElement.style.margin = '5px 0';
        errorElement.style.fontSize = '12px';
        errorElement.textContent = 'Passwords do not match';
        this.parentNode.insertBefore(errorElement, this.nextSibling);
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