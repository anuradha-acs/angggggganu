<?php
class LeaveController {
    private $db;

    public function __construct() {
        global $mydb;
        $this->db = $mydb;
    }

    public function getAll() {
        $this->db->setQuery("
            SELECT l.*, e.EMPNAME, e.COMPANY, e.DEPARTMENT 
            FROM tblleave l 
            JOIN tblemployee e ON l.EMPLOYID = e.EMPLOYID 
            ORDER BY l.DATEPOSTED DESC
        ");
        $leaves = $this->db->loadResultList();

        echo json_encode($leaves);
    }

    public function getById($id) {
        $this->db->setQuery("
            SELECT l.*, e.EMPNAME, e.COMPANY, e.DEPARTMENT 
            FROM tblleave l 
            JOIN tblemployee e ON l.EMPLOYID = e.EMPLOYID 
            WHERE l.LEAVEID = $id
        ");
        $leave = $this->db->loadSingleResult();

        if ($leave) {
            echo json_encode($leave);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Leave not found']);
        }
    }

    public function create() {
        $input = json_decode(file_get_contents('php://input'), true);

        $required = ['employId', 'dateStart', 'dateEnd', 'noDays', 'shiftTime', 'typeOfLeave', 'reason'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Field $field is required"]);
                return;
            }
        }

        $employId = $this->db->escape_value($input['employId']);
        $dateStart = $this->db->escape_value($input['dateStart']);
        $dateEnd = $this->db->escape_value($input['dateEnd']);
        $noDays = floatval($input['noDays']);
        $shiftTime = $this->db->escape_value($input['shiftTime']);
        $typeOfLeave = $this->db->escape_value($input['typeOfLeave']);
        $reason = $this->db->escape_value($input['reason']);
        $leaveStatus = 'PENDING';
        $adminRemarks = 'N/A';
        $datePosted = date('Y-m-d');

        $sql = "INSERT INTO tblleave (EMPLOYID, DATESTART, DATEEND, NODAYS, SHIFTTIME, TYPEOFLEAVE, REASON, LEAVESTATUS, ADMINREMARKS, DATEPOSTED) 
                VALUES ('$employId', '$dateStart', '$dateEnd', $noDays, '$shiftTime', '$typeOfLeave', '$reason', '$leaveStatus', '$adminRemarks', '$datePosted')";

        $this->db->setQuery($sql);
        $result = $this->db->executeQuery();

        if ($result) {
            $id = $this->db->insert_id();
            echo json_encode(['success' => true, 'id' => $id]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create leave request']);
        }
    }

    public function update($id) {
        $input = json_decode(file_get_contents('php://input'), true);

        $updates = [];
        if (isset($input['dateStart'])) $updates[] = "DATESTART = '" . $this->db->escape_value($input['dateStart']) . "'";
        if (isset($input['dateEnd'])) $updates[] = "DATEEND = '" . $this->db->escape_value($input['dateEnd']) . "'";
        if (isset($input['noDays'])) $updates[] = "NODAYS = " . floatval($input['noDays']);
        if (isset($input['shiftTime'])) $updates[] = "SHIFTTIME = '" . $this->db->escape_value($input['shiftTime']) . "'";
        if (isset($input['typeOfLeave'])) $updates[] = "TYPEOFLEAVE = '" . $this->db->escape_value($input['typeOfLeave']) . "'";
        if (isset($input['reason'])) $updates[] = "REASON = '" . $this->db->escape_value($input['reason']) . "'";
        if (isset($input['leaveStatus'])) $updates[] = "LEAVESTATUS = '" . $this->db->escape_value($input['leaveStatus']) . "'";
        if (isset($input['adminRemarks'])) $updates[] = "ADMINREMARKS = '" . $this->db->escape_value($input['adminRemarks']) . "'";

        if (empty($updates)) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update']);
            return;
        }

        $sql = "UPDATE tblleave SET " . implode(', ', $updates) . " WHERE LEAVEID = $id";
        $this->db->setQuery($sql);
        $result = $this->db->executeQuery();

        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update leave request']);
        }
    }

    public function delete($id) {
        $this->db->setQuery("DELETE FROM tblleave WHERE LEAVEID = $id");
        $result = $this->db->executeQuery();

        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete leave request']);
        }
    }

    public function approve($id) {
        $input = json_decode(file_get_contents('php://input'), true);
        $remarks = isset($input['remarks']) ? $this->db->escape_value($input['remarks']) : 'Approved';

        $this->db->setQuery("UPDATE tblleave SET LEAVESTATUS = 'APPROVED', ADMINREMARKS = '$remarks' WHERE LEAVEID = $id");
        $result = $this->db->executeQuery();

        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to approve leave request']);
        }
    }

    public function reject($id) {
        $input = json_decode(file_get_contents('php://input'), true);
        $remarks = isset($input['remarks']) ? $this->db->escape_value($input['remarks']) : 'Rejected';

        $this->db->setQuery("UPDATE tblleave SET LEAVESTATUS = 'REJECTED', ADMINREMARKS = '$remarks' WHERE LEAVEID = $id");
        $result = $this->db->executeQuery();

        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to reject leave request']);
        }
    }

    public function getMyLeaves() {
        // In a real application, you would get the user ID from the JWT token
        // For now, we'll return all leaves or filter by a specific employee
        $this->db->setQuery("
            SELECT l.*, e.EMPNAME, e.COMPANY, e.DEPARTMENT 
            FROM tblleave l 
            JOIN tblemployee e ON l.EMPLOYID = e.EMPLOYID 
            ORDER BY l.DATEPOSTED DESC
        ");
        $leaves = $this->db->loadResultList();

        echo json_encode($leaves);
    }

    public function getPending() {
        $this->db->setQuery("
            SELECT l.*, e.EMPNAME, e.COMPANY, e.DEPARTMENT 
            FROM tblleave l 
            JOIN tblemployee e ON l.EMPLOYID = e.EMPLOYID 
            WHERE l.LEAVESTATUS = 'PENDING'
            ORDER BY l.DATEPOSTED DESC
        ");
        $leaves = $this->db->loadResultList();

        echo json_encode($leaves);
    }

    public function getApproved() {
        $this->db->setQuery("
            SELECT l.*, e.EMPNAME, e.COMPANY, e.DEPARTMENT 
            FROM tblleave l 
            JOIN tblemployee e ON l.EMPLOYID = e.EMPLOYID 
            WHERE l.LEAVESTATUS = 'APPROVED'
            ORDER BY l.DATEPOSTED DESC
        ");
        $leaves = $this->db->loadResultList();

        echo json_encode($leaves);
    }

    public function getRejected() {
        $this->db->setQuery("
            SELECT l.*, e.EMPNAME, e.COMPANY, e.DEPARTMENT 
            FROM tblleave l 
            JOIN tblemployee e ON l.EMPLOYID = e.EMPLOYID 
            WHERE l.LEAVESTATUS = 'REJECTED'
            ORDER BY l.DATEPOSTED DESC
        ");
        $leaves = $this->db->loadResultList();

        echo json_encode($leaves);
    }
}
?>