
<?php
class AuthController {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function login() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['username']) || !isset($input['password'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Username and password required']);
            return;
        }
        
        $username = $input['username'];
        $password = $input['password'];
        
        $query = "SELECT * FROM tblemployee WHERE EMPID = ? OR username = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ss", $username, $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            
            // For demo purposes, we'll use simple password check
            // In production, use password_verify() with hashed passwords
            if ($password === 'admin123' && $username === 'admin') {
                $user['role'] = 'Administrator';
                $user['username'] = $username;
            } elseif ($password === 'hr123' && $username === 'hr.manager') {
                $user['role'] = 'Manager';
                $user['username'] = $username;
            } elseif ($password === 'emp123' && $username === 'john.doe') {
                $user['role'] = 'Normal user';
                $user['username'] = $username;
            } else {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
                return;
            }
            
            session_start();
            $_SESSION['user_id'] = $user['EMPLOYEEID'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];
            
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        }
    }
    
    public function logout() {
        session_start();
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
    }
    
    public function verify() {
        session_start();
        if (isset($_SESSION['user_id'])) {
            echo json_encode(['success' => true, 'authenticated' => true]);
        } else {
            echo json_encode(['success' => false, 'authenticated' => false]);
        }
    }
}
?>
