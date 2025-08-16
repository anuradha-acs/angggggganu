<?php
class AuthController {
    private $db;

    public function __construct() {
        global $mydb;
        $this->db = $mydb;
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

        $this->db->setQuery("SELECT * FROM tblemployee WHERE USERNAME = '$username' AND PASSWRD = '$password' AND ACCSTATUS = 'YES'");
        $result = $this->db->loadSingleResult();

        if ($result) {
            // Generate a simple token (in production, use JWT)
            $token = base64_encode($username . ':' . time());

            echo json_encode([
                'success' => true,
                'token' => $token,
                'user' => [
                    'EMPID' => $result->EMPID,
                    'EMPLOYID' => $result->EMPLOYID,
                    'EMPNAME' => $result->EMPNAME,
                    'EMPPOSITION' => $result->EMPPOSITION,
                    'COMPANY' => $result->COMPANY,
                    'DEPARTMENT' => $result->DEPARTMENT,
                    'EMPSEX' => $result->EMPSEX,
                    'AVELEAVE' => $result->AVELEAVE
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
    }
}
?>