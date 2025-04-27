document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // School Logo Preview
    const logoInput = document.getElementById('new-logo');
    const logoPreview = document.getElementById('logo-preview');
    
    if (logoInput) {
        logoInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                
                reader.addEventListener('load', function() {
                    logoPreview.innerHTML = `<img src="${this.result}" alt="Logo Preview">`;
                });
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Backup Range Selection
    const backupRange = document.getElementById('backup-range');
    const customRange = document.querySelector('.custom-range');
    
    if (backupRange) {
        backupRange.addEventListener('change', function() {
            if (this.value === 'custom') {
                customRange.style.display = 'block';
                
                // Set default dates (today and 7 days ago)
                const today = new Date().toISOString().split('T')[0];
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
                
                document.getElementById('backup-start-date').value = sevenDaysAgoStr;
                document.getElementById('backup-end-date').value = today;
            } else {
                customRange.style.display = 'none';
            }
        });
    }
    
    // Form Submissions (sample data - would be connected to database in production)
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form ID to determine which form was submitted
            const formId = this.id;
            
            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Settings Saved',
                text: 'Your changes have been saved successfully.',
                confirmButtonColor: 'var(--primary-color)'
            });
            
            // In a real application, you would send the form data to the server here
            // For example:
            /*
            const formData = new FormData(this);
            
            fetch('save_settings.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Settings Saved',
                        text: 'Your changes have been saved successfully.',
                        confirmButtonColor: 'var(--primary-color)'
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message || 'An error occurred while saving settings.',
                        confirmButtonColor: 'var(--primary-color)'
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while saving settings.',
                    confirmButtonColor: 'var(--primary-color)'
                });
            });
            */
        });
    });
    
    // Sample data for demonstration
    loadSampleData();
    
    function loadSampleData() {
        // Contact Information
        document.getElementById('contact-email').value = 'library@spist.edu.ph';
        document.getElementById('contact-phone').value = '+63 123 456 7890';
        document.getElementById('contact-tel').value = '(082) 123-4567';
        document.getElementById('contact-address').value = '123 Library Street, Davao City, Philippines';
        
        // Operating Hours - weekends closed by default
        document.getElementById('Saturday-active').checked = false;
        document.getElementById('Sunday-active').checked = false;
        
        // Set weekend times to disabled state initially
        toggleDayAvailability('Saturday');
        toggleDayAvailability('Sunday');
        
        // Add event listeners for day toggles
        const dayToggles = document.querySelectorAll('.day-header input[type="checkbox"]');
        dayToggles.forEach(toggle => {
            const day = toggle.id.replace('-active', '');
            toggle.addEventListener('change', () => toggleDayAvailability(day));
        });
    }
    
    function toggleDayAvailability(day) {
        const isActive = document.getElementById(`${day}-active`).checked;
        document.getElementById(`${day}-open`).disabled = !isActive;
        document.getElementById(`${day}-close`).disabled = !isActive;
    }
    
    // Initialize date inputs with today's date for backup
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        if (!input.value) {
            input.value = today;
        }
    });
});