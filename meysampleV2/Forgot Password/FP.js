document.addEventListener('DOMContentLoaded', function() {
    // Password Visibility Toggle
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('bx-hide');
            this.classList.toggle('bx-show');
        });
    });

    // Password Strength Meter
    const passwordInput = document.getElementById('new_password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const container = this.closest('.input-box');
            const strengthBar = container.querySelector('.strength-bar');
            const strengthText = container.querySelector('.strength-text');

            // Reset
            strengthBar.style.width = '0';
            container.classList.remove('weak', 'fair', 'good', 'strong');
            
            if (!password) {
                if (strengthText) strengthText.textContent = '';
                return;
            }

            // Calculate strength
            let strength = 0;
            if (password.length >= 8) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^A-Za-z0-9]/.test(password)) strength++;

            // Update UI
            const width = (strength / 4) * 100;
            strengthBar.style.width = `${width}%`;
            
            if (strengthText) {
                if (strength === 1) {
                    container.classList.add('weak');
                    strengthText.textContent = 'Weak password';
                    strengthBar.style.backgroundColor = '#ff5252';
                } else if (strength === 2) {
                    container.classList.add('fair');
                    strengthText.textContent = 'Fair password';
                    strengthBar.style.backgroundColor = '#ffb142';
                } else if (strength === 3) {
                    container.classList.add('good');
                    strengthText.textContent = 'Good password';
                    strengthBar.style.backgroundColor = '#34ace0';
                } else if (strength === 4) {
                    container.classList.add('strong');
                    strengthText.textContent = 'Strong password!';
                    strengthBar.style.backgroundColor = '#33d9b2';
                }
            }
        });
    }

    // OTP Countdown Timer
    let timeLeft = 300; // 5 minutes in seconds
    const countdownElement = document.getElementById('countdown');
    
    if (countdownElement) {
        const updateCountdown = () => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            countdownElement.textContent = `OTP expires in: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                countdownElement.textContent = 'OTP has expired!';
                countdownElement.style.color = '#ff5252';
            }
            timeLeft--;
        };
        
        updateCountdown(); // Initial call
        const countdownInterval = setInterval(updateCountdown, 1000);
    }

    // OTP Resend Handler
    const resendBtn = document.getElementById('resend-otp');
    if (resendBtn) {
        resendBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // Disable button and show "Sending..." state
            const originalText = resendBtn.textContent;
            resendBtn.textContent = 'Sending...';
            resendBtn.style.pointerEvents = 'none';
            
            try {
                const response = await fetch('FP.php?resend=true');
                const result = await response.json();
                
                if (result.success) {
                    // Show temporary success message
                    const successMsg = document.createElement('div');
                    successMsg.className = 'custom-message success';
                    successMsg.textContent = 'New OTP sent successfully!';
                    document.querySelector('.wrapper').prepend(successMsg);
                    
                    // Remove message after 3 seconds
                    setTimeout(() => successMsg.remove(), 3000);
                    
                    // Reset countdown timer
                    if (countdownElement) {
                        timeLeft = 300;
                        countdownElement.style.color = '';
                    }
                } else {
                    throw new Error(result.message || 'Failed to resend OTP');
                }
            } catch (error) {
                // Show error message
                const errorMsg = document.createElement('div');
                errorMsg.className = 'custom-message error';
                errorMsg.textContent = error.message;
                document.querySelector('.wrapper').prepend(errorMsg);
                setTimeout(() => errorMsg.remove(), 3000);
            } finally {
                // Re-enable button after 60 seconds
                setTimeout(() => {
                    resendBtn.textContent = originalText;
                    resendBtn.style.pointerEvents = 'auto';
                }, 5000);
            }
        });
    }

    // Form Validation
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            const password = document.getElementById('new_password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            
            if (password !== confirmPassword) {
                e.preventDefault();
                alert('Passwords do not match!');
            }
        });
    }
});