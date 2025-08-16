
<?php
class EmployeeController {
    private $db;

    public function __construct() {
        global $mydb;
        $this->db = $mydb;
    }

    public function getAll() {
        $this->db->setQuery("SELECT * FROM tblemployee ORDER BY EMPNAME");
        $employees = $this->db->loadResultList();

        echo json_encode($employees);
    }

    public function getById($id) {
        $this->db->setQuery("SELECT * FROM tblemployee WHERE EMPID = $id");
        $employee = $this->db->loadSingleResult();

        if ($employee) {
            echo json_encode($employee);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Employee not found']);
        }
    }

    public function create() {
        $input = json_decode(file_get_contents('php://input'), true);

        $required = ['empName', 'empPosition', 'username', 'password', 'company', 'department', 'employId'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Field $field is required"]);
                return;
            }
        }

        $empName = $this->db->escape_value($input['empName']);
        $empPosition = $this->db->escape_value($input['empPosition']);
        $username = $this->db->escape_value($input['username']);
        $password = sha1($input['password']); // Using SHA1 as per existing database
        $company = $this->db->escape_value($input['company']);
        $department = $this->db->escape_value($input['department']);
        $employId = $this->db->escape_value($input['employId']);
        $empSex = isset($input['empSex']) ? $this->db->escape_value($input['empSex']) : 'MALE';
        $aveLeave = isset($input['aveLeave']) ? intval($input['aveLeave']) : 18;

        $sql = "INSERT INTO tblemployee (EMPNAME, EMPPOSITION, USERNAME, PASSWRD, ACCSTATUS, EMPSEX, COMPANY, DEPARTMENT, EMPLOYID, AVELEAVE) 
                VALUES ('$empName', '$empPosition', '$username', '$password', 'YES', '$empSex', '$company', '$department', '$employId', $aveLeave)";

        $this->db->setQuery($sql);
        $result = $this->db->executeQuery();

        if ($result) {
            $id = $this->db->insert_id();
            echo json_encode(['success' => true, 'id' => $id]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create employee']);
        }
    }

    public function update($id) {
        $input = json_decode(file_get_contents('php://input'), true);

        $updates = [];
        if (isset($input['empName'])) $updates[] = "EMPNAME = '" . $this->db->escape_value($input['empName']) . "'";
        if (isset($input['empPosition'])) $updates[] = "EMPPOSITION = '" . $this->db->escape_value($input['empPosition']) . "'";
        if (isset($input['username'])) $updates[] = "USERNAME = '" . $this->db->escape_value($input['username']) . "'";
        if (isset($input['password'])) $updates[] = "PASSWRD = '" . sha1($input['password']) . "'";
        if (isset($input['company'])) $updates[] = "COMPANY = '" . $this->db->escape_value($input['company']) . "'";
        if (isset($input['department'])) $updates[] = "DEPARTMENT = '" . $this->db->escape_value($input['department']) . "'";
        if (isset($input['empSex'])) $updates[] = "EMPSEX = '" . $this->db->escape_value($input['empSex']) . "'";
        if (isset($input['aveLeave'])) $updates[] = "AVELEAVE = " . intval($input['aveLeave']);
        if (isset($input['accStatus'])) $updates[] = "ACCSTATUS = '" . $this->db->escape_value($input['accStatus']) . "'";

        if (empty($updates)) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update']);
            return;
        }

        $sql = "UPDATE tblemployee SET " . implode(', ', $updates) . " WHERE EMPID = $id";
        $this->db->setQuery($sql);
        $result = $this->db->executeQuery();

        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update employee']);
        }
    }

    public function delete($id) {
        $this->db->setQuery("DELETE FROM tblemployee WHERE EMPID = $id");
        $result = $this->db->executeQuery();

        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete employee']);
        }
    }
}
?>
