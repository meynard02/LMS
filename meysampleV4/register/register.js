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
          errorElement.textContent = 'Only @spist.edu.ph emails are allowed';
          this.parentNode.insertBefore(errorElement, this.nextSibling);
      }
  } else if (emailError) {
      emailError.remove();
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