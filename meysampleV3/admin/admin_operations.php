<?php
// admin_operations.php
require_once '../php/connection.php';
header('Content-Type: application/json');

class AdminOperations {
    private $conn;
    
    public function __construct($connection) {
        $this->conn = $connection;
    }
    
    public function handleRequest() {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                throw new Exception('Invalid request method');
            }
            
            $action = $_POST['action'] ?? '';
            $adminId = $_POST['adminId'] ?? null;
            
            switch ($action) {
                case 'update':
                    $this->updateAdmin();
                    break;
                    
                case 'toggleStatus':
                    $this->toggleAdminStatus();
                    break;
                    
                case 'delete':
                    $this->deleteAdmin();
                    break;
                    
                case 'add':
                    $this->addAdmin();
                    break;
                    
                default:
                    throw new Exception('Invalid action specified');
            }
        } catch (Exception $e) {
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    private function updateAdmin() {
        $this->validateAdminId();
        $requiredFields = ['email', 'firstName', 'lastName'];
        $this->validateRequiredFields($requiredFields);
        
        $email = $_POST['email'];
        $firstName = $_POST['firstName'];
        $lastName = $_POST['lastName'];
        $password = $_POST['password'] ?? null;
        
        $query = "UPDATE admin SET 
                 AdminEmail = ?,
                 AdminFName = ?,
                 AdminLName = ?";
        
        $params = [$email, $firstName, $lastName];
        $types = "sss";
        
        if (!empty($password)) {
            $query .= ", AdminPassword = ?";
            $params[] = password_hash($password, PASSWORD_DEFAULT);
            $types .= "s";
        }
        
        $query .= " WHERE AdminID = ?";
        $params[] = $_POST['adminId'];
        $types .= "i";
        
        $this->executeQuery($query, $types, $params);
        
        echo json_encode([
            'success' => true,
            'message' => 'Admin updated successfully'
        ]);
    }
    
    private function toggleAdminStatus() {
        $this->validateAdminId();
        $currentStatus = $_POST['currentStatus'] ?? '';
        
        if (!in_array($currentStatus, ['Active', 'Inactive'])) {
            throw new Exception('Invalid current status');
        }
        
        $newStatus = $currentStatus === 'Active' ? 'Inactive' : 'Active';
        
        $this->executeQuery(
            "UPDATE admin SET Status = ? WHERE AdminID = ?",
            "si",
            [$newStatus, $_POST['adminId']]
        );
        
        echo json_encode([
            'success' => true,
            'newStatus' => $newStatus
        ]);
    }
    
    private function deleteAdmin() {
        $this->validateAdminId();
        
        $this->executeQuery(
            "DELETE FROM admin WHERE AdminID = ?",
            "i",
            [$_POST['adminId']]
        );
        
        echo json_encode(['success' => true]);
    }
    
    private function addAdmin() {
        $requiredFields = ['email', 'firstName', 'lastName', 'username', 'password'];
        $this->validateRequiredFields($requiredFields);
        
        $this->executeQuery(
            "INSERT INTO admin (AdminEmail, AdminFName, AdminLName, AdminUsername, AdminPassword, Status) 
             VALUES (?, ?, ?, ?, ?, 'Active')",
            "sssss",
            [
                $_POST['email'],
                $_POST['firstName'],
                $_POST['lastName'],
                $_POST['username'],
                password_hash($_POST['password'], PASSWORD_DEFAULT)
            ]
        );
        
        echo json_encode(['success' => true]);
    }
    
    private function validateAdminId() {
        if (empty($_POST['adminId'])) {
            throw new Exception('Admin ID is required');
        }
    }
    
    private function validateRequiredFields($fields) {
        foreach ($fields as $field) {
            if (empty($_POST[$field])) {
                throw new Exception(ucfirst($field) . ' is required');
            }
        }
    }
    
    private function executeQuery($query, $types, $params) {
        $this->conn->begin_transaction();
        
        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param($types, ...$params);
            
            if (!$stmt->execute()) {
                throw new Exception('Database operation failed');
            }
            
            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }
}

// Initialize and handle request
$adminOps = new AdminOperations($conn);
$adminOps->handleRequest();
$conn->close();
?>