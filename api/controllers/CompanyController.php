
<?php
class CompanyController {
    private $db;

    public function __construct() {
        global $mydb;
        $this->db = $mydb;
    }

    public function getAll() {
        $this->db->setQuery("SELECT * FROM tblcompany ORDER BY COMPANY");
        $companies = $this->db->loadResultList();

        echo json_encode($companies);
    }

    public function getById($id) {
        $this->db->setQuery("SELECT * FROM tblcompany WHERE COMPANYID = $id");
        $company = $this->db->loadSingleResult();

        if ($company) {
            echo json_encode($company);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Company not found']);
        }
    }

    public function create() {
        $input = json_decode(file_get_contents('php://input'), true);

        $required = ['COMPANY'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Field $field is required"]);
                return;
            }
        }

        $company = $this->db->escape_value($input['COMPANY']);
        $companyAddress = isset($input['COMPANYADDRESS']) ? $this->db->escape_value($input['COMPANYADDRESS']) : '';
        $companyStatus = isset($input['COMPANYSTATUS']) ? $this->db->escape_value($input['COMPANYSTATUS']) : 'Active';

        $sql = "INSERT INTO tblcompany (COMPANY, COMPANYADDRESS, COMPANYSTATUS) VALUES ('$company', '$companyAddress', '$companyStatus')";

        $this->db->setQuery($sql);
        $result = $this->db->executeQuery();

        if ($result) {
            $id = $this->db->insert_id();
            echo json_encode(['success' => true, 'id' => $id]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create company']);
        }
    }

    public function update($id) {
        $input = json_decode(file_get_contents('php://input'), true);

        $updates = [];
        if (isset($input['COMPANY'])) $updates[] = "COMPANY = '" . $this->db->escape_value($input['COMPANY']) . "'";
        if (isset($input['COMPANYADDRESS'])) $updates[] = "COMPANYADDRESS = '" . $this->db->escape_value($input['COMPANYADDRESS']) . "'";
        if (isset($input['COMPANYSTATUS'])) $updates[] = "COMPANYSTATUS = '" . $this->db->escape_value($input['COMPANYSTATUS']) . "'";

        if (empty($updates)) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update']);
            return;
        }

        $sql = "UPDATE tblcompany SET " . implode(', ', $updates) . " WHERE COMPANYID = $id";
        $this->db->setQuery($sql);
        $result = $this->db->executeQuery();

        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update company']);
        }
    }

    public function delete($id) {
        $this->db->setQuery("DELETE FROM tblcompany WHERE COMPANYID = $id");
        $result = $this->db->executeQuery();

        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete company']);
        }
    }
}
?>
