
<?php
class DepartmentController {
    private $db;

    public function __construct() {
        global $mydb;
        $this->db = $mydb;
    }

    public function getAll() {
        $this->db->setQuery("SELECT * FROM tbldepartment ORDER BY DEPARTMENT");
        $departments = $this->db->loadResultList();

        echo json_encode($departments);
    }

    public function getById($id) {
        $this->db->setQuery("SELECT * FROM tbldepartment WHERE DEPARTMENTID = $id");
        $department = $this->db->loadSingleResult();

        if ($department) {
            echo json_encode($department);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Department not found']);
        }
    }

    public function create() {
        $input = json_decode(file_get_contents('php://input'), true);

        $required = ['DEPARTMENT'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Field $field is required"]);
                return;
            }
        }

        $department = $this->db->escape_value($input['DEPARTMENT']);
        $departmentDesc = isset($input['DEPARTMENTDESC']) ? $this->db->escape_value($input['DEPARTMENTDESC']) : '';

        $sql = "INSERT INTO tbldepartment (DEPARTMENT, DEPARTMENTDESC) VALUES ('$department', '$departmentDesc')";

        $this->db->setQuery($sql);
        $result = $this->db->executeQuery();

        if ($result) {
            $id = $this->db->insert_id();
            echo json_encode(['success' => true, 'id' => $id]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create department']);
        }
    }

    public function update($id) {
        $input = json_decode(file_get_contents('php://input'), true);

        $updates = [];
        if (isset($input['DEPARTMENT'])) $updates[] = "DEPARTMENT = '" . $this->db->escape_value($input['DEPARTMENT']) . "'";
        if (isset($input['DEPARTMENTDESC'])) $updates[] = "DEPARTMENTDESC = '" . $this->db->escape_value($input['DEPARTMENTDESC']) . "'";

        if (empty($updates)) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update']);
            return;
        }

        $sql = "UPDATE tbldepartment SET " . implode(', ', $updates) . " WHERE DEPARTMENTID = $id";
        $this->db->setQuery($sql);
        $result = $this->db->executeQuery();

        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update department']);
        }
    }

    public function delete($id) {
        $this->db->setQuery("DELETE FROM tbldepartment WHERE DEPARTMENTID = $id");
        $result = $this->db->executeQuery();

        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete department']);
        }
    }
}
?>
