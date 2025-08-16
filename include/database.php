<?php
require_once(LIB_PATH.DS."config.php");

class Database {
    var $sql_string = '';
    var $error_no = 0;
    var $error_msg = '';
    private $conn;
    public $last_query;
    private $magic_quotes_active;
    private $real_escape_string_exists;

    function __construct() {
        $this->open_connection();
        $this->magic_quotes_active = false;
        $this->real_escape_string_exists = function_exists("mysqli_real_escape_string");
    }

    public function open_connection() {
        // Create SQLite database for development
        $db_path = __DIR__ . '/../database/leavedb.sqlite';

        // Ensure database directory exists
        if (!file_exists(dirname($db_path))) {
            mkdir(dirname($db_path), 0777, true);
        }

        try {
            $this->conn = new PDO('sqlite:' . $db_path);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Create tables if they don't exist
            $this->createTables();

        } catch(PDOException $e) {
            echo "Database connection failed: " . $e->getMessage();
            exit();
        }
    }

    private function createTables() {
        $tables = [
            "CREATE TABLE IF NOT EXISTS tblcompany (
                COMPID INTEGER PRIMARY KEY AUTOINCREMENT,
                COMPANY TEXT NOT NULL
            )",
            "CREATE TABLE IF NOT EXISTS tbldepts (
                DEPTID INTEGER PRIMARY KEY AUTOINCREMENT,
                DEPTNAME TEXT NOT NULL,
                DEPTSHORTNAME VARCHAR(30) NOT NULL
            )",
            "CREATE TABLE IF NOT EXISTS tblemployee (
                EMPID INTEGER PRIMARY KEY AUTOINCREMENT,
                EMPNAME VARCHAR(60) NOT NULL,
                EMPPOSITION VARCHAR(30) NOT NULL,
                USERNAME VARCHAR(30) NOT NULL,
                PASSWRD TEXT NOT NULL,
                ACCSTATUS VARCHAR(5) NOT NULL DEFAULT 'NO',
                EMPSEX VARCHAR(10) NOT NULL DEFAULT 'MALE',
                COMPANY VARCHAR(30) NOT NULL,
                DEPARTMENT VARCHAR(30) NOT NULL,
                EMPLOYID VARCHAR(30) NOT NULL,
                AVELEAVE INTEGER NOT NULL DEFAULT 18
            )",
            "CREATE TABLE IF NOT EXISTS tblleave (
                LEAVEID INTEGER PRIMARY KEY AUTOINCREMENT,
                EMPLOYID VARCHAR(30) NOT NULL,
                DATESTART DATE NOT NULL,
                DATEEND DATE NOT NULL,
                NODAYS REAL NOT NULL,
                SHIFTTIME VARCHAR(10) NOT NULL,
                TYPEOFLEAVE VARCHAR(30) NOT NULL,
                REASON TEXT NOT NULL,
                LEAVESTATUS VARCHAR(30) NOT NULL,
                ADMINREMARKS TEXT NOT NULL,
                DATEPOSTED DATE NOT NULL
            )",
            "CREATE TABLE IF NOT EXISTS tblleavetype (
                LEAVTID INTEGER PRIMARY KEY AUTOINCREMENT,
                LEAVETYPE VARCHAR(30) NOT NULL,
                DESCRIPTION TEXT NOT NULL
            )"
        ];

        foreach ($tables as $table) {
            try {
                $this->conn->exec($table);
            } catch(PDOException $e) {
                // Table might already exist, continue
            }
        }

        // Insert default data if tables are empty
        $this->insertDefaultData();
    }

    private function insertDefaultData() {
        // Check if data exists
        $stmt = $this->conn->query("SELECT COUNT(*) FROM tblemployee");
        if ($stmt->fetchColumn() == 0) {
            // Insert default admin user
            $adminPass = sha1('admin123');
            $this->conn->exec("INSERT INTO tblcompany (COMPANY) VALUES ('BAYON'), ('SOA'), ('MOLY')");
            $this->conn->exec("INSERT INTO tbldepts (DEPTNAME, DEPTSHORTNAME) VALUES 
                ('IT DEPARTMENTS', 'IT'),
                ('HR DEPARTMENT', 'HR'),
                ('TECHNICAL DEPARTMENT', 'TD'),
                ('FINANCE DEPARTMENT', 'FD'),
                ('SALES & MARKETING DEPARTMENT', 'SMD')");
            $this->conn->exec("INSERT INTO tblleavetype (LEAVETYPE, DESCRIPTION) VALUES 
                ('SICK LEAVE', 'SICK LEAVE'),
                ('CASUAL LEAVE', 'CASUAL LEAVE'),
                ('UNPAID LEAVE', 'UNPAID LEAVE')");
            $this->conn->exec("INSERT INTO tblemployee (EMPNAME, EMPPOSITION, USERNAME, PASSWRD, ACCSTATUS, EMPSEX, COMPANY, DEPARTMENT, EMPLOYID, AVELEAVE) VALUES 
                ('Admin User', 'Administrator', 'admin@test.com', '$adminPass', 'YES', 'MALE', 'BAYON', 'HR DEPARTMENT', '001', 18)");
        }
    }

    function setQuery($sql='') {
        $this->sql_string = $sql;
        $this->last_query = $sql;
    }

    function executeQuery() {
        try {
            $result = $this->conn->query($this->sql_string);
            return $result;
        } catch(PDOException $e) {
            $this->error_no = $e->getCode();
            $this->error_msg = $e->getMessage();
            return false;
        }
    }

    private function confirm_query($result) {
        if(!$result){
            return false;
        }
        return $result;
    }

    function loadResultList($key='') {
        $result = $this->executeQuery();
        if (!$result) return array();

        $array = array();
        while ($row = $result->fetch(PDO::FETCH_OBJ)) {
            if ($key && isset($row->$key)) {
                $array[$row->$key] = $row;
            } else {
                $array[] = $row;
            }
        }
        return $array;
    }

    function loadSingleResult() {
        $result = $this->executeQuery();
        if (!$result) return null;

        return $result->fetch(PDO::FETCH_OBJ);
    }

    function getFieldsOnOneTable($tbl_name) {
        $this->setQuery("PRAGMA table_info($tbl_name)");
        $rows = $this->loadResultList();

        $f = array();
        foreach($rows as $row) {
            $f[] = $row->name;
        }

        return $f;
    }

    public function fetch_array($result) {
        return $result->fetch(PDO::FETCH_ASSOC);
    }

    public function num_rows() {
        $result = $this->executeQuery();
        if (!$result) return 0;
        return $result->rowCount();
    }

    public function insert_id() {
        return $this->conn->lastInsertId();
    }

    public function affected_rows() {
        return $this->conn->rowCount();
    }

    public function escape_value($value) {
        return str_replace("'", "''", $value);
    }

    public function close_connection() {
        $this->conn = null;
    }
}

$mydb = new Database();
?>