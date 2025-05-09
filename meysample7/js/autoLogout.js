class AutoLogout {
    constructor() {
        this.timeout = 2 * 60 * 1000; // 2 minutes (changed from 5 minutes)
        this.warningTime = 1 * 60 * 1000; // 1 minute warning (changed from 30 seconds)
        this.timer = null;
        this.logoutTimer = null;
        this.isWarningActive = false;
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
        // Clear any existing timers
        clearTimeout(this.timer);
        clearTimeout(this.logoutTimer);
        
        // Set warning to show after (timeout - warningTime)
        this.timer = setTimeout(() => {
            this.showWarning();
        }, this.timeout - this.warningTime);
        
        // Set actual logout to happen after full timeout
        this.logoutTimer = setTimeout(() => {
            this.logout();
        }, this.timeout);
    }
    
    resetTimer() {
        // Don't reset if warning is currently showing
        if (this.isWarningActive) return;
        
        this.lastActivity = Date.now();
        this.startTimer();
    }
    
    showWarning() {
        this.isWarningActive = true;
        
        Swal.fire({
            title: 'Session Timeout Warning',
            html: `
                <div class="warning-content">
                    <div class="warning-icon-container">
                        <i class="fas fa-exclamation-triangle warning-icon"></i>
                    </div>
                    <div class="warning-text">
                        <h3>Your Session is About to Expire</h3>
                        <p>You've been inactive for 1 minute.</p>
                        <p>Your session will expire in <span class="countdown">1:00</span></p>
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
            timer: this.warningTime, // 1 minute
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
                
                // Add event listeners to buttons to properly handle them
                popup.querySelector('.swal2-confirm').addEventListener('click', () => {
                    this.isWarningActive = false;
                    this.resetTimer();
                });
                
                popup.querySelector('.swal2-cancel').addEventListener('click', () => {
                    this.isWarningActive = false;
                });
            }
        }).then((result) => {
            this.isWarningActive = false;
            if (result.isConfirmed) {
                this.showStayLoggedInAnimation();
                this.resetTimer();
            } else if (result.dismiss === Swal.DismissReason.timer) {
                this.logout();
            } else {
                this.logout();
            }
        });
    }
    
    startCountdown(popup) {
        let timeLeft = this.warningTime / 1000; // Convert to seconds
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
        progressFill.style.transition = `width ${this.warningTime/1000}s linear`;
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