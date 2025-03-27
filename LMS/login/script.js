const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");

// Password visibility toggle
togglePassword.addEventListener("click", function () {
    // Toggle the type attribute
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);

    // Toggle the eye icon
    this.classList.toggle("bx-hide");
    this.classList.toggle("bx-show");
});

// Login function (moved outside)
function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin') {
        // Correct path to adminHP.html inside the admin folder
        window.location.href = "../admin/adminHP/adminHP.html"; 
        return false; // Prevent form submission
    } else if (username === 'user' && password === 'user') {
        // Redirect to adminHP.html
        window.location.href = "../user/user.html";
        return false; // Prevent form submission
    
    } else {
        alert('Incorrect username or password');
        return false; // Prevent form submission
    }
}



