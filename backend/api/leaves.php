
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

class LeaveAPI {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function getLeaves() {
        $query = "SELECT l.*, e.EMPNAME, lt.LEAVETYPE 
                  FROM tblleave l 
                  JOIN tblemployee e ON l.EMPID = e.EMPID 
                  JOIN tblleavetype lt ON l.LEAVETYPEID = lt.LEAVETYPEID 
                  ORDER BY l.LEAVEDATE DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'data' => $result]);
    }

    public function getMyLeaves($empId) {
        $query = "SELECT l.*, lt.LEAVETYPE 
                  FROM tblleave l 
                  JOIN tblleavetype lt ON l.LEAVETYPEID = lt.LEAVETYPEID 
                  WHERE l.EMPID = :empId 
                  ORDER BY l.LEAVEDATE DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':empId', $empId);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'data' => $result]);
    }

    public function createLeave() {
        $input = json_decode(file_get_contents('php://input'), true);

        $query = "INSERT INTO tblleave (EMPID, LEAVETYPEID, LEAVEDATE, LEAVEDAYSFROM, LEAVEDAYSTO, REASON, STATUS) 
                  VALUES (:empId, :leaveTypeId, :leaveDate, :leaveDaysFrom, :leaveDaysTo, :reason, 'Pending')";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':empId', $input['empId']);
        $stmt->bindParam(':leaveTypeId', $input['leaveTypeId']);
        $stmt->bindParam(':leaveDate', $input['leaveDate']);
        $stmt->bindParam(':leaveDaysFrom', $input['leaveDaysFrom']);
        $stmt->bindParam(':leaveDaysTo', $input['leaveDaysTo']);
        $stmt->bindParam(':reason', $input['reason']);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Leave application submitted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create leave application']);
        }
    }

    public function updateLeaveStatus() {
        $input = json_decode(file_get_contents('php://input'), true);

        $query = "UPDATE tblleave SET STATUS = :status, REMARKS = :remarks WHERE LEAVEID = :leaveId";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $input['status']);
        $stmt->bindParam(':remarks', $input['remarks']);
        $stmt->bindParam(':leaveId', $input['leaveId']);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Leave status updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update leave status']);
        }
    }
}

$leave = new LeaveAPI();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'GET':
        if ($action === 'my-leaves') {
            $empId = $_GET['empId'] ?? '';
            $leave->getMyLeaves($empId);
        } else {
            $leave->getLeaves();
        }
        break;
    case 'POST':
        $leave->createLeave();
        break;
    case 'PUT':
        $leave->updateLeaveStatus();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
?>
