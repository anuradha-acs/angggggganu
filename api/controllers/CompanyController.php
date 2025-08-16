
<?php
class CompanyController {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAll() {
        $query = "SELECT * FROM tblcompany ORDER BY COMPANYNAME";
        $result = $this->conn->query($query);
        
        $companies = [];
        while ($row = $result->fetch_assoc()) {
            $companies[] = $row;
        }
        
        header('Content-Type: application/json');
        echo json_encode($companies);
    }
    
    public function getById($id) {
        $query = "SELECT * FROM tblcompany WHERE COMPANYID = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($row = $result->fetch_assoc()) {
            header('Content-Type: application/json');
            echo json_encode($row);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Company not found']);
        }
    }
    
    public function create() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $query = "INSERT INTO tblcompany (COMPANYNAME, COMPANYLOCATION, COMPANYCONTACT) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sss", $input['COMPANYNAME'], $input['COMPANYLOCATION'], $input['COMPANYCONTACT']);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Company created successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to create company']);
        }
    }
    
    public function update($id) {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $query = "UPDATE tblcompany SET COMPANYNAME = ?, COMPANYLOCATION = ?, COMPANYCONTACT = ? WHERE COMPANYID = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sssi", $input['COMPANYNAME'], $input['COMPANYLOCATION'], $input['COMPANYCONTACT'], $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Company updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update company']);
        }
    }
    
    public function delete($id) {
        $query = "DELETE FROM tblcompany WHERE COMPANYID = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Company deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to delete company']);
        }
    }
}
?>
