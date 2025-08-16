
<?php
class LeaveTypeController {
    private $db;

    public function __construct() {
        global $mydb;
        $this->db = $mydb;
    }

    public function getAll() {
        $this->db->setQuery("SELECT * FROM tblleavetype ORDER BY LEAVETYPE");
        $leaveTypes = $this->db->loadResultList();

        echo json_encode($leaveTypes);
    }

    public function getById($id) {
        $this->db->setQuery("SELECT * FROM tblleavetype WHERE LEAVETYPEID = $id");
        $leaveType = $this->db->loadSingleResult();

        if ($leaveType) {
            echo json_encode($leaveType);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Leave type not found']);
        }
    }

    public function create() {
        $input = json_decode(file_get_contents('php://input'), true);

        $required = ['LEAVETYPE'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Field $field is required"]);
                return;
            }
        }

        $leaveType = $this->db->escape_value($input['LEAVETYPE']);
        $description = isset($input['DESCRIPTION']) ? $this->db->escape_value($input['DESCRIPTION']) : '';

        $sql = "INSERT INTO tblleavetype (LEAVETYPE, DESCRIPTION) VALUES ('$leaveType', '$description')";

        $this->db->setQuery($sql);
        $result = $this->db->executeQuery();

        if ($result) {
            $id = $this->db->insert_id();
            echo json_encode(['success' => true, 'id' => $id]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create leave type']);
        }
    }

    public function update($id) {
        $input = json_decode(file_get_contents('php://input'), true);

        $updates = [];
        if (isset($input['LEAVETYPE'])) $updates[] = "LEAVETYPE = '" . $this->db->escape_value($input['LEAVETYPE']) . "'";
        if (isset($input['DESCRIPTION'])) $updates[] = "DESCRIPTION = '" . $this->db->escape_value($input['DESCRIPTION']) . "'";

        if (empty($updates)) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update']);
            return;
        }

        $sql = "UPDATE tblleavetype SET " . implode(', ', $updates) . " WHERE LEAVETYPEID = $id";
        $this->db->setQuery($sql);
        $result = $this->db->executeQuery();

        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update leave type']);
        }
    }

    public function delete($id) {
        $this->db->setQuery("DELETE FROM tblleavetype WHERE LEAVETYPEID = $id");
        $result = $this->db->executeQuery();

        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete leave type']);
        }
    }
}
?>
