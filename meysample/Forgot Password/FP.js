document.addEventListener('DOMContentLoaded', function() {
    // Password Visibility Toggle
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const isHidden = this.classList.contains('bx-hide');
            
            input.type = isHidden ? 'text' : 'password';
            this.classList.toggle('bx-hide');
            this.classList.toggle('bx-show');
        });
    });

    // Password Strength Checker
    const passwordInput = document.getElementById('new_password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const container = this.closest('.input-box');
            const strengthBar = container.querySelector('.strength-bar');
            const strengthText = container.querySelector('.strength-text');

            // Reset classes
            container.classList.remove('password-weak', 'password-fair', 'password-good', 'password-strong');

            if (!password) {
                strengthBar.style.width = '0';
                if (strengthText) strengthText.textContent = '';
                return;
            }

            // Calculate strength
            let strength = 0;
            const hasMinLength = password.length >= 8;
            const hasUpperCase = /[A-Z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

            strength = [hasMinLength, hasUpperCase, hasNumber, hasSpecialChar].filter(Boolean).length;

            // Update UI
            if (strengthText) {
                if (strength === 1) {
                    container.classList.add('password-weak');
                    strengthText.textContent = 'Weak - needs uppercase, number & special char';
                } else if (strength === 2) {
                    container.classList.add('password-fair');
                    strengthText.textContent = 'Fair - needs number or special char';
                } else if (strength === 3) {
                    container.classList.add('password-good');
                    strengthText.textContent = 'Good - could be stronger';
                } else if (strength === 4) {
                    container.classList.add('password-strong');
                    strengthText.textContent = 'Strong password!';
                }
            }
        });
    }

    // Form Validation
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            const password = document.getElementById('new_password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            const errors = [];

            if (password.length < 8) {
                errors.push('Password must be at least 8 characters');
            }
            if (!/[A-Z]/.test(password)) {
                errors.push('Password must contain at least one uppercase letter');
            }
            if (!/[0-9]/.test(password)) {
                errors.push('Password must contain at least one number');
            }
            if (!/[^A-Za-z0-9]/.test(password)) {
                errors.push('Password must contain at least one special character');
            }
            if (password !== confirmPassword) {
                errors.push('Passwords do not match');
            }

            if (errors.length > 0) {
                e.preventDefault();
                alert(errors.join('\n'));
            }
        });
    }
});