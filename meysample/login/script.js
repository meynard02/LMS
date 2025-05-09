document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.querySelector("#togglePassword");
    const passwordInput = document.querySelector("#password");
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", function() {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            this.classList.toggle("bx-hide");
            this.classList.toggle("bx-show");
        });
    }

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            if (!username || !password) {
                e.preventDefault();
                alert('Please enter both username and password');
            }
        });
    }
});