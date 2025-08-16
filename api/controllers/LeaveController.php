
<?php
class LeaveController {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getLeaves() {
        $query = "SELECT l.*, CONCAT(e.FNAME, ' ', e.LNAME) as employee_name 
                  FROM tblleave l 
                  LEFT JOIN tblemployee e ON l.EMPLOYID = e.EMPID 
                  ORDER BY l.DATEPOSTED DESC";
        $result = $this->conn->query($query);
        
        $leaves = [];
        while ($row = $result->fetch_assoc()) {
            $leaves[] = $row;
        }
        
        header('Content-Type: application/json');
        echo json_encode($leaves);
    }
    
    public function getMyLeaves($empId) {
        $query = "SELECT * FROM tblleave WHERE EMPLOYID = ? ORDER BY DATEPOSTED DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $empId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $leaves = [];
        while ($row = $result->fetch_assoc()) {
            $leaves[] = $row;
        }
        
        header('Content-Type: application/json');
        echo json_encode($leaves);
    }
    
    public function createLeave() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $query = "INSERT INTO tblleave (EMPLOYID, DATESTART, DATEEND, NODAYS, SHIFTTIME, TYPEOFLEAVE, REASON, LEAVESTATUS, ADMINREMARKS, DATEPOSTED) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', 'N/A', CURDATE())";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sssdsss", 
            $input['employeeId'],
            $input['startDate'],
            $input['endDate'],
            $input['noDays'],
            $input['shiftTime'],
            $input['leaveType'],
            $input['reason']
        );
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Leave request submitted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to submit leave request']);
        }
    }
    
    public function updateLeaveStatus() {
        $input = json_decode(file_get_contents('php://input'), true);
        $leaveId = $_GET['id'] ?? 0;
        
        $query = "UPDATE tblleave SET LEAVESTATUS = ?, ADMINREMARKS = ? WHERE LEAVEID = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssi", $input['status'], $input['remarks'], $leaveId);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Leave status updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update leave status']);
        }
    }
    
    public function deleteLeave($id) {
        $query = "DELETE FROM tblleave WHERE LEAVEID = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Leave deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to delete leave']);
        }
    }
}
?>
