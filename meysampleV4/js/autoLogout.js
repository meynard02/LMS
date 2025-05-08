class AutoLogout {
    constructor() {
        this.timeout = 5 * 60 * 1000; // 5 minutes
        this.warningTime = 30 * 1000; // 30 seconds warning (changed from 1 minute)
        this.timer = null;
        this.warningTimer = null;
        this.lastActivity = Date.now();
        
        this.activityEvents = [
            'mousedown', 'mousemove', 'keypress',
            'scroll', 'touchstart', 'click'
        ];
        
        this.init();
    }
    
    init() {
        this.activityEvents.forEach(event => {
            document.addEventListener(event, () => this.resetTimer());
        });
        this.startTimer();
    }
    
    startTimer() {
        this.timer = setTimeout(() => {
            this.logout();
        }, this.timeout);
        
        this.warningTimer = setTimeout(() => {
            this.showWarning();
        }, this.timeout - this.warningTime);
    }
    
    resetTimer() {
        this.lastActivity = Date.now();
        clearTimeout(this.timer);
        clearTimeout(this.warningTimer);
        this.startTimer();
    }
    
    showWarning() {
        Swal.fire({
            title: 'Session Timeout Warning',
            html: `
                <div class="warning-content">
                    <div class="warning-icon-container">
                        <i class="fas fa-exclamation-triangle warning-icon"></i>
                    </div>
                    <div class="warning-text">
                        <h3>Your Session is About to Expire</h3>
                        <p>You've been inactive for 4 minutes and 30 seconds.</p>
                        <p>Your session will expire in <span class="countdown">0:30</span></p>
                    </div>
                    <div class="warning-progress">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                    </div>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Stay Logged In',
            cancelButtonText: 'Logout Now',
            confirmButtonColor: '#036d2b',
            cancelButtonColor: '#dc3545',
            allowOutsideClick: false,
            allowEscapeKey: false,
            timer: 30000, // Changed to 30 seconds
            timerProgressBar: true,
            customClass: {
                popup: 'animated-popup',
                title: 'warning-title',
                htmlContainer: 'warning-html',
                confirmButton: 'btn-stay-logged',
                cancelButton: 'btn-logout-now'
            },
            didOpen: (popup) => {
                this.startCountdown(popup);
                this.animateProgressBar(popup);
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.showStayLoggedInAnimation();
                this.resetTimer();
            } else {
                this.logout();
            }
        });
    }
    
    startCountdown(popup) {
        let timeLeft = 30; // Changed to 30 seconds
        const countdownElement = popup.querySelector('.countdown');
        
        const countdownInterval = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            countdownElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);
    }
    
    animateProgressBar(popup) {
        const progressFill = popup.querySelector('.progress-fill');
        progressFill.style.width = '100%';
        progressFill.style.transition = 'width 30s linear'; // Changed to 30 seconds
        setTimeout(() => {
            progressFill.style.width = '0%';
        }, 100);
    }
    
    showStayLoggedInAnimation() {
        Swal.fire({
            title: 'Session Extended',
            html: `
                <div class="success-content">
                    <div class="success-icon-container">
                        <i class="fas fa-check-circle success-icon"></i>
                    </div>
                    <p>Your session has been extended.</p>
                </div>
            `,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            customClass: {
                popup: 'animated-popup success-popup'
            }
        });
    }
    
    logout() {
        Swal.fire({
            title: 'Session Expired',
            html: `
                <div class="logout-content">
                    <div class="logout-icon-container">
                        <i class="fas fa-clock logout-icon"></i>
                    </div>
                    <div class="logout-text">
                        <h3>You've Been Logged Out</h3>
                        <p>Due to inactivity, your session has expired.</p>
                        <p>Please log in again to continue.</p>
                    </div>
                </div>
            `,
            icon: 'info',
            confirmButtonText: 'Return to Login',
            confirmButtonColor: '#036d2b',
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
                popup: 'animated-popup logout-popup',
                title: 'logout-title',
                htmlContainer: 'logout-html',
                confirmButton: 'btn-return-login'
            }
        }).then(() => {
            window.location.href = '../login/index.php';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AutoLogout();
}); 
