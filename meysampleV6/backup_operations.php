<?php
require_once '../php/connection.php';

// Set headers for file download
header('Content-Type: application/sql');
header('Content-Disposition: attachment; filename="lms_backup_' . date('Ymd_His') . '.sql"');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');

$action = $_POST['action'] ?? '';

try {
    if ($action !== 'generate') {
        throw new Exception('Invalid action');
    }

    $dataType = $_POST['dataType'] ?? '';
    $filterType = $_POST['filterType'] ?? '';
    $dateRange = $_POST['dateRange'] ?? '';
    
    // Validate inputs
    $validDataTypes = ['users', 'admins', 'books', 'transactions', 'all'];
    if (!in_array($dataType, $validDataTypes)) {
        throw new Exception('Invalid data type');
    }
    
    if (!in_array($filterType, ['day', 'month', 'year', 'all'])) {
        throw new Exception('Invalid filter type');
    }
    
    // Output SQL header
    echo "-- LMS Database Backup\n";
    echo "-- Generated: " . date('Y-m-d H:i:s') . "\n";
    echo "-- Data Type: " . ucfirst($dataType) . "\n";
    echo "-- Filter: " . ucfirst($filterType) . ($filterType !== 'all' ? " ($dateRange)" : "") . "\n\n";
    
    // Set timezone for date operations
    date_default_timezone_set('Asia/Manila');
    
    // Backup all tables or specific ones
    if ($dataType === 'all') {
        backupTable('admin', 'created_at', $filterType, $dateRange);
        backupTable('user', 'created_at', $filterType, $dateRange);
        backupTable('book', 'created_at', $filterType, $dateRange);
        backupTable('transaction', 'BorrowedDate', $filterType, $dateRange);
        backupTable('book_categories', null, $filterType, $dateRange);
        backupTable('contact_info', null, $filterType, $dateRange);
        backupTable('max_books', null, $filterType, $dateRange);
        backupTable('status', null, $filterType, $dateRange);
    } else {
        switch ($dataType) {
            case 'admins':
                backupTable('admin', 'created_at', $filterType, $dateRange);
                break;
            case 'users':
                backupTable('user', 'created_at', $filterType, $dateRange);
                break;
            case 'books':
                backupTable('book', 'created_at', $filterType, $dateRange);
                backupTable('book_categories', null, $filterType, $dateRange);
                break;
            case 'transactions':
                backupTable('transaction', 'BorrowedDate', $filterType, $dateRange);
                backupTable('status', null, $filterType, $dateRange);
                break;
        }
    }
    
    exit();

} catch (Exception $e) {
    // If error occurs, switch to JSON response
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
    exit();
}

function backupTable($tableName, $dateField, $filterType, $dateRange) {
    global $conn;
    
    // Get table structure
    $result = $conn->query("SHOW CREATE TABLE `$tableName`");
    if (!$result) {
        throw new Exception("Error getting structure for $tableName: " . $conn->error);
    }
    
    $row = $result->fetch_assoc();
    echo "-- Table structure for table `$tableName`\n";
    echo "DROP TABLE IF EXISTS `$tableName`;\n";
    echo $row['Create Table'] . ";\n\n";
    
    // Build query for data
    $query = "SELECT * FROM `$tableName` WHERE 1=1";
    
    // Add date filter if applicable
    if ($dateField && $filterType !== 'all' && $dateRange) {
        $date = new DateTime($dateRange);
        
        switch ($filterType) {
            case 'day':
                $nextDay = clone $date;
                $nextDay->modify('+1 day');
                $query .= " AND `$dateField` >= '{$date->format('Y-m-d')}' AND `$dateField` < '{$nextDay->format('Y-m-d')}'";
                break;
            case 'month':
                $firstDay = $date->format('Y-m-01');
                $lastDay = $date->format('Y-m-t');
                $query .= " AND `$dateField` >= '$firstDay' AND `$dateField` <= '$lastDay'";
                break;
            case 'year':
                $firstDay = $date->format('Y-01-01');
                $lastDay = $date->format('Y-12-31');
                $query .= " AND `$dateField` >= '$firstDay' AND `$dateField` <= '$lastDay'";
                break;
        }
    }
    
    // Add deleteStatus filter if table has this column
    $columns = $conn->query("SHOW COLUMNS FROM `$tableName`");
    $hasDeleteStatus = false;
    while ($column = $columns->fetch_assoc()) {
        if ($column['Field'] === 'deleteStatus') {
            $hasDeleteStatus = true;
            break;
        }
    }
    
    if ($hasDeleteStatus) {
        $query .= " AND deleteStatus = 1";
    }
    
    // Get data
    $result = $conn->query($query);
    if (!$result) {
        throw new Exception("Error getting data from $tableName: " . $conn->error);
    }
    
    // Output INSERT statements
    if ($result->num_rows > 0) {
        echo "-- Data for table `$tableName`\n";
        
        while ($row = $result->fetch_assoc()) {
            $fields = [];
            $values = [];
            
            foreach ($row as $field => $value) {
                $fields[] = "`$field`";
                $values[] = is_null($value) ? 'NULL' : "'" . $conn->real_escape_string($value) . "'";
            }
            
            echo "INSERT INTO `$tableName` (" . implode(', ', $fields) . ") VALUES (" . implode(', ', $values) . ");\n";
        }
        
        echo "\n";
    }
}