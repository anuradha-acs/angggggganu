
<?php
class EmployeeController {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAll() {
        $query = "SELECT e.*, c.COMPANYNAME as company_name, d.DEPARTMENT as department_name 
                  FROM tblemployee e 
                  LEFT JOIN tblcompany c ON e.COMPANYID = c.COMPANYID 
                  LEFT JOIN tbldepartment d ON e.DEPARTMENTID = d.DEPARTMENTID 
                  ORDER BY e.FNAME, e.LNAME";
        $result = $this->conn->query($query);
        
        $employees = [];
        while ($row = $result->fetch_assoc()) {
            $employees[] = $row;
        }
        
        header('Content-Type: application/json');
        echo json_encode($employees);
    }
    
    public function getById($id) {
        $query = "SELECT e.*, c.COMPANYNAME as company_name, d.DEPARTMENT as department_name 
                  FROM tblemployee e 
                  LEFT JOIN tblcompany c ON e.COMPANYID = c.COMPANYID 
                  LEFT JOIN tbldepartment d ON e.DEPARTMENTID = d.DEPARTMENTID 
                  WHERE e.EMPLOYEEID = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($row = $result->fetch_assoc()) {
            header('Content-Type: application/json');
            echo json_encode($row);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Employee not found']);
        }
    }
    
    public function create() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $query = "INSERT INTO tblemployee (EMPID, FNAME, LNAME, MNAME, POSITION, COMPANYID, DEPARTMENTID, DATESTART) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sssssiis", 
            $input['EMPID'],
            $input['FNAME'],
            $input['LNAME'],
            $input['MNAME'],
            $input['POSITION'],
            $input['COMPANYID'],
            $input['DEPARTMENTID'],
            $input['DATESTART']
        );
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Employee created successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to create employee']);
        }
    }
    
    public function update($id) {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $query = "UPDATE tblemployee SET EMPID = ?, FNAME = ?, LNAME = ?, MNAME = ?, POSITION = ?, COMPANYID = ?, DEPARTMENTID = ?, DATESTART = ? WHERE EMPLOYEEID = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sssssiisd", 
            $input['EMPID'],
            $input['FNAME'],
            $input['LNAME'],
            $input['MNAME'],
            $input['POSITION'],
            $input['COMPANYID'],
            $input['DEPARTMENTID'],
            $input['DATESTART'],
            $id
        );
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Employee updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update employee']);
        }
    }
    
    public function delete($id) {
        $query = "DELETE FROM tblemployee WHERE EMPLOYEEID = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Employee deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to delete employee']);
        }
    }
}
?>
