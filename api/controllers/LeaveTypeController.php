
<?php
class LeaveTypeController {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAll() {
        $query = "SELECT * FROM tblleavetype ORDER BY LEAVETYPE";
        $result = $this->conn->query($query);
        
        $leaveTypes = [];
        while ($row = $result->fetch_assoc()) {
            $leaveTypes[] = $row;
        }
        
        header('Content-Type: application/json');
        echo json_encode($leaveTypes);
    }
    
    public function getById($id) {
        $query = "SELECT * FROM tblleavetype WHERE LEAVETYPEID = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($row = $result->fetch_assoc()) {
            header('Content-Type: application/json');
            echo json_encode($row);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Leave type not found']);
        }
    }
    
    public function create() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $query = "INSERT INTO tblleavetype (LEAVETYPE, DESCRIPTION) VALUES (?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ss", $input['LEAVETYPE'], $input['DESCRIPTION']);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Leave type created successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to create leave type']);
        }
    }
    
    public function update($id) {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $query = "UPDATE tblleavetype SET LEAVETYPE = ?, DESCRIPTION = ? WHERE LEAVETYPEID = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssi", $input['LEAVETYPE'], $input['DESCRIPTION'], $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Leave type updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update leave type']);
        }
    }
    
    public function delete($id) {
        $query = "DELETE FROM tblleavetype WHERE LEAVETYPEID = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Leave type deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to delete leave type']);
        }
    }
}
?>
