document.addEventListener('DOMContentLoaded', function() {
    const otpForm = document.getElementById('otp-form');
    const otpInput = document.getElementById('otp');
    const resendBtn = document.getElementById('resend-otp');
    const verifyBtn = document.querySelector('.btn[type="submit"]');
    let canResend = true;

    // OTP input formatting
    otpInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
        if (this.value.length > 6) {
            this.value = this.value.slice(0, 6);
        }
    });

    // Form submission
    otpForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        verifyBtn.disabled = true;
        verifyBtn.textContent = 'Verifying...';
        
        try {
            const response = await fetch(otpForm.action, {
                method: 'POST',
                body: new FormData(otpForm)
            });
            
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                const result = await response.text();
                const errorMatch = result.match(/<div class="error-message">(.*?)<\/div>/);
                if (errorMatch) {
                    showMessage(errorMatch[1], 'error');
                }
            }
        } catch (error) {
            showMessage('Network error. Please try again.', 'error');
        } finally {
            verifyBtn.disabled = false;
            verifyBtn.textContent = 'Verify';
        }
    });

    // Resend OTP
    resendBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        
        if (!canResend) return;
        
        resendBtn.textContent = 'Sending...';
        canResend = false;
        
        try {
            const response = await fetch('../otp/resend_otp.php');
            const result = await response.json();
            
            if (result.success) {
                showMessage('New OTP sent! Check your email.', 'success');
                startCooldown();
            } else {
                showMessage(result.message || 'Failed to resend OTP', 'error');
                canResend = true;
                resendBtn.textContent = 'Resend OTP';
            }
        } catch (error) {
            showMessage('Network error. Please try again.', 'error');
            canResend = true;
            resendBtn.textContent = 'Resend OTP';
        }
    });

    function startCooldown() {
        let seconds = 60;
        const timer = setInterval(() => {
            resendBtn.textContent = `Resend OTP (${seconds}s)`;
            seconds--;
            
            if (seconds <= 0) {
                clearInterval(timer);
                resendBtn.textContent = 'Resend OTP';
                canResend = true;
            }
        }, 1000);
    }

    function showMessage(message, type) {
        const existing = document.querySelector('.custom-message');
        if (existing) existing.remove();
        
        const div = document.createElement('div');
        div.className = `custom-message ${type}`;
        div.textContent = message;
        otpForm.prepend(div);
        
        setTimeout(() => div.remove(), 3000);
    }

    // Check if verified
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('verified')) {
        showMessage('Registration complete! Redirecting to login...', 'success');
        setTimeout(() => {
            window.location.href = "../login/index.php";
        }, 2000);
    }
});