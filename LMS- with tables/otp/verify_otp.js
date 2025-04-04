// OTP input formatting
document.getElementById('otp').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
});

// Resend OTP functionality
document.getElementById('resend-otp').addEventListener('click', function(e) {
    e.preventDefault();
    
    const btn = this;
    btn.textContent = 'Sending...';
    btn.style.pointerEvents = 'none';
    
    fetch('../php/resend_otp.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('New OTP has been sent to your email!');
        } else {
            alert('Error: ' + (data.message || 'Failed to resend OTP'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while resending OTP');
    })
    .finally(() => {
        btn.textContent = 'Resend OTP';
        btn.style.pointerEvents = 'auto';
    });
});