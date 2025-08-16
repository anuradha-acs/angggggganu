
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

class AuthAPI {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function login() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['username']) || !isset($input['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Username and password required']);
            return;
        }

        $username = $input['username'];
        $password = sha1($input['password']); // Using SHA1 as per existing database

        $query = "SELECT * FROM tblemployee WHERE USERNAME = :username AND PASSWRD = :password AND ACCSTATUS = 'YES'";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':password', $password);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            // Generate a simple token (in production, use JWT)
            $token = base64_encode($username . ':' . time());

            echo json_encode([
                'success' => true,
                'token' => $token,
                'user' => [
                    'EMPID' => $result['EMPID'],
                    'EMPLOYID' => $result['EMPLOYID'],
                    'EMPNAME' => $result['EMPNAME'],
                    'EMPPOSITION' => $result['EMPPOSITION'],
                    'COMPANY' => $result['COMPANY'],
                    'DEPARTMENT' => $result['DEPARTMENT'],
                    'EMPSEX' => $result['EMPSEX'],
                    'AVELEAVE' => $result['AVELEAVE']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
    }

    public function logout() {
        echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
    }
}

$auth = new AuthAPI();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $path = $_GET['action'] ?? '';
    
    switch ($path) {
        case 'login':
            $auth->login();
            break;
        case 'logout':
            $auth->logout();
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
    }
}
?>
