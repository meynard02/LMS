<?php
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'admin') {
    header("Location: ../login/index.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Library Management - System Settings</title>
    <link rel="stylesheet" href="../admin/adminHP.css">
    <link rel="stylesheet" href="./system_settings.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="sidebar">
        <!-- Existing sidebar content from adminHP.php -->
    </div>

    <div class="main-content">
        <div class="header">
            <!-- Existing header content from adminHP.php -->
        </div>

        <div class="content-panel" id="contentPanel">
            <div class="panel-content">
                <div class="system-settings-container">
                    <h2 class="settings-title"><i class="fas fa-cog"></i> System Settings</h2>
                    
                    <div class="settings-tabs">
                        <button class="tab-btn active" data-tab="school-logo"><i class="fas fa-image"></i> School Logo</button>
                        <button class="tab-btn" data-tab="contact-info"><i class="fas fa-address-book"></i> Contact Information</button>
                        <button class="tab-btn" data-tab="operating-hours"><i class="fas fa-clock"></i> Operating Hours</button>
                        <button class="tab-btn" data-tab="borrowing-rules"><i class="fas fa-book"></i> Borrowing Rules</button>
                        <button class="tab-btn" data-tab="backup-data"><i class="fas fa-database"></i> Backup Data</button>
                        <button class="tab-btn" data-tab="restore-data"><i class="fas fa-undo"></i> Restore Data</button>
                    </div>

                    <div class="settings-content">
                        <!-- School Logo Tab -->
                        <div id="school-logo" class="tab-content active">
                            <h3><i class="fas fa-image"></i> School Logo Settings</h3>
                            <div class="current-logo-container">
                                <p>Current Logo:</p>
                                <img id="current-logo-preview" src="../photos/logo.jpg" alt="Current School Logo">
                            </div>
                            <form id="logo-upload-form" enctype="multipart/form-data">
                                <div class="form-group">
                                    <label for="new-logo">Upload New Logo:</label>
                                    <input type="file" id="new-logo" name="new-logo" accept="image/*" required>
                                    <small class="text-muted">Recommended size: 300x300 pixels, Max file size: 2MB</small>
                                    <div id="logo-preview" class="photo-preview"></div>
                                </div>
                                <div class="form-actions">
                                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Changes</button>
                                    <button type="reset" class="btn btn-secondary"><i class="fas fa-times"></i> Cancel</button>
                                </div>
                            </form>
                        </div>

                        <!-- Contact Information Tab -->
                        <div id="contact-info" class="tab-content">
                            <h3><i class="fas fa-address-book"></i> Contact Information</h3>
                            <form id="contact-info-form">
                                <div class="form-group">
                                    <label for="contact-email">Email Address:</label>
                                    <input type="email" id="contact-email" class="form-control" placeholder="library@spist.edu.ph" required>
                                </div>
                                <div class="form-group">
                                    <label for="contact-phone">Phone Number:</label>
                                    <input type="tel" id="contact-phone" class="form-control" placeholder="+63 123 456 7890" required>
                                </div>
                                <div class="form-group">
                                    <label for="contact-tel">Telephone Number:</label>
                                    <input type="tel" id="contact-tel" class="form-control" placeholder="(082) 123-4567" required>
                                </div>
                                <div class="form-group">
                                    <label for="contact-address">Physical Address:</label>
                                    <textarea id="contact-address" class="form-control" rows="3" placeholder="Enter library physical address" required></textarea>
                                </div>
                                <div class="form-actions">
                                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Changes</button>
                                    <button type="reset" class="btn btn-secondary"><i class="fas fa-times"></i> Cancel</button>
                                </div>
                            </form>
                        </div>

                        <!-- Operating Hours Tab -->
                        <div id="operating-hours" class="tab-content">
                            <h3><i class="fas fa-clock"></i> Operating Hours</h3>
                            <form id="operating-hours-form">
                                <div class="days-container">
                                    <?php
                                    $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                                    foreach ($days as $day) {
                                        echo '
                                        <div class="day-schedule">
                                            <div class="day-header">
                                                <input type="checkbox" id="'.$day.'-active" name="'.$day.'-active" checked>
                                                <label for="'.$day.'-active">'.$day.'</label>
                                            </div>
                                            <div class="time-selection">
                                                <div class="form-group">
                                                    <label>Opening Time:</label>
                                                    <input type="time" id="'.$day.'-open" name="'.$day.'-open" value="08:00" required>
                                                </div>
                                                <div class="form-group">
                                                    <label>Closing Time:</label>
                                                    <input type="time" id="'.$day.'-close" name="'.$day.'-close" value="17:00" required>
                                                </div>
                                            </div>
                                        </div>';
                                    }
                                    ?>
                                </div>
                                <div class="form-actions">
                                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Changes</button>
                                    <button type="reset" class="btn btn-secondary"><i class="fas fa-times"></i> Cancel</button>
                                </div>
                            </form>
                        </div>

                        <!-- Borrowing Rules Tab -->
                        <div id="borrowing-rules" class="tab-content">
                            <h3><i class="fas fa-book"></i> Borrowing Rules</h3>
                            <form id="borrowing-rules-form">
                                <div class="form-group">
                                    <label for="max-books">Maximum Books Allowed per Student:</label>
                                    <input type="number" id="max-books" class="form-control" min="1" max="10" value="3" required>
                                </div>
                                <div class="form-group">
                                    <label for="borrowing-duration">Borrowing Duration (in days):</label>
                                    <input type="number" id="borrowing-duration" class="form-control" min="1" max="30" value="14" required>
                                </div>
                                <div class="form-group">
                                    <label for="renewal-count">Maximum Renewals Allowed:</label>
                                    <input type="number" id="renewal-count" class="form-control" min="0" max="5" value="1" required>
                                </div>
                                <div class="form-group">
                                    <label for="fine-amount">Daily Fine for Overdue Books (₱):</label>
                                    <input type="number" id="fine-amount" class="form-control" min="0" max="100" step="0.50" value="10.00" required>
                                </div>
                                <div class="form-actions">
                                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Changes</button>
                                    <button type="reset" class="btn btn-secondary"><i class="fas fa-times"></i> Cancel</button>
                                </div>
                            </form>
                        </div>

                        <!-- Backup Data Tab -->
                        <div id="backup-data" class="tab-content">
                            <h3><i class="fas fa-database"></i> Backup Data</h3>
                            <form id="backup-data-form">
                                <div class="form-group">
                                    <label>Select Data to Backup:</label>
                                    <div class="checkbox-group">
                                        <label><input type="checkbox" name="backup-users" checked> User Management (Students & Admins)</label>
                                        <label><input type="checkbox" name="backup-inventory" checked> Book Inventory</label>
                                        <label><input type="checkbox" name="backup-transactions" checked> Borrowing/Returns Data</label>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="backup-range">Time Range:</label>
                                    <select id="backup-range" class="form-control" required>
                                        <option value="all">All Data</option>
                                        <option value="day">Last Day</option>
                                        <option value="week">Last Week</option>
                                        <option value="month">Last Month</option>
                                        <option value="year">Last Year</option>
                                        <option value="custom">Custom Range</option>
                                    </select>
                                </div>
                                <div class="form-group custom-range" style="display:none;">
                                    <label>Custom Date Range:</label>
                                    <div class="date-range">
                                        <input type="date" id="backup-start-date" class="form-control">
                                        <span>to</span>
                                        <input type="date" id="backup-end-date" class="form-control">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="backup-format">Backup Format:</label>
                                    <select id="backup-format" class="form-control" required>
                                        <option value="excel">Excel (.xlsx)</option>
                                        <option value="csv">CSV (.csv)</option>
                                        <option value="json">JSON (.json)</option>
                                    </select>
                                </div>
                                <div class="form-actions">
                                    <button type="submit" class="btn btn-primary"><i class="fas fa-download"></i> Download Backup</button>
                                </div>
                            </form>
                        </div>

                        <!-- Restore Data Tab -->
                        <div id="restore-data" class="tab-content">
                            <h3><i class="fas fa-undo"></i> Restore Data</h3>
                            <div class="restore-warning">
                                <i class="fas fa-exclamation-triangle"></i>
                                <p>Warning: Restoring data will overwrite existing records. Please proceed with caution.</p>
                            </div>
                            <form id="restore-data-form" enctype="multipart/form-data">
                                <div class="form-group">
                                    <label for="restore-file">Select Backup File:</label>
                                    <input type="file" id="restore-file" class="form-control" accept=".xlsx,.csv,.json" required>
                                    <small class="text-muted">Supported formats: .xlsx, .csv, .json</small>
                                </div>
                                <div class="form-group">
                                    <label>Select Data to Restore:</label>
                                    <div class="checkbox-group">
                                        <label><input type="checkbox" name="restore-users"> User Management</label>
                                        <label><input type="checkbox" name="restore-inventory"> Book Inventory</label>
                                        <label><input type="checkbox" name="restore-transactions"> Borrowing/Returns Data</label>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="restore-mode">Restore Mode:</label>
                                    <select id="restore-mode" class="form-control" required>
                                        <option value="merge">Merge with existing data</option>
                                        <option value="replace">Replace existing data</option>
                                    </select>
                                </div>
                                <div class="form-actions">
                                    <button type="submit" class="btn btn-primary"><i class="fas fa-upload"></i> Restore Data</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../admin/adminHP.js"></script>
    <script src="./system_settings.js"></script>
</body>
</html>