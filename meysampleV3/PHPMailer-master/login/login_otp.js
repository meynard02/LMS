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

    // Resend OTP
    resendBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        
        if (!canResend) return;
        
        resendBtn.textContent = 'Sending...';
        canResend = false;
        
        try {
            const response = await fetch('../login/resend_login_otp.php');
            const result = await response.json();
            
            if (result.success) {
                showMessage('New OTP sent! Check your email.', 'success');
                // Start cooldown
                setTimeout(() => {
                    canResend = true;
                    resendBtn.textContent = 'Resend OTP';
                }, 5000);
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

    function showMessage(message, type) {
        const existing = document.querySelector('.custom-message');
        if (existing) existing.remove();
        
        const div = document.createElement('div');
        div.className = `custom-message ${type}`;
        div.textContent = message;
        otpForm.prepend(div);
        
        setTimeout(() => div.remove(), 3000);
    }
});