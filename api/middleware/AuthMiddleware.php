
<?php
class AuthMiddleware {
    private $db;

    public function __construct() {
        global $mydb;
        $this->db = $mydb;
    }

    public function validateToken() {
        $headers = getallheaders();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

        if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
            http_response_code(401);
            echo json_encode(['error' => 'Authorization token required']);
            exit();
        }

        $token = substr($authHeader, 7); // Remove 'Bearer ' prefix
        
        // Simple token validation (in production, use JWT)
        $decoded = base64_decode($token);
        if (!$decoded || !str_contains($decoded, ':')) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid token']);
            exit();
        }

        list($username, $timestamp) = explode(':', $decoded);
        
        // Check if token is not too old (24 hours)
        if (time() - $timestamp > 86400) {
            http_response_code(401);
            echo json_encode(['error' => 'Token expired']);
            exit();
        }

        // Verify user exists and is active
        $this->db->setQuery("SELECT * FROM tblemployee WHERE USERNAME = '$username' AND ACCSTATUS = 'YES'");
        $user = $this->db->loadSingleResult();

        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid user']);
            exit();
        }

        return $user;
    }

    public function requireAdmin($user = null) {
        if (!$user) {
            $user = $this->validateToken();
        }

        if ($user->EMPPOSITION !== 'Administrator') {
            http_response_code(403);
            echo json_encode(['error' => 'Admin access required']);
            exit();
        }

        return $user;
    }

    public function requireHROrAdmin($user = null) {
        if (!$user) {
            $user = $this->validateToken();
        }

        if (!in_array($user->EMPPOSITION, ['Administrator', 'HR Manager', 'Manager'])) {
            http_response_code(403);
            echo json_encode(['error' => 'HR or Admin access required']);
            exit();
        }

        return $user;
    }
}
?>
