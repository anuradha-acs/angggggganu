<?php
class DepartmentController {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAll() {
        $query = "SELECT * FROM tbldepartment ORDER BY DEPARTMENT";
        $result = $this->conn->query($query);

        $departments = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $departments[] = $row;
            }
        }

        header('Content-Type: application/json');
        echo json_encode($departments);
    }

    public function getById($id) {
        $query = "SELECT * FROM tbldepartment WHERE DEPARTMENTID = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            header('Content-Type: application/json');
            echo json_encode($row);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Department not found']);
        }
    }

    public function create() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['DEPARTMENT'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Department name is required']);
            return;
        }

        $query = "INSERT INTO tbldepartment (DEPARTMENT, DEPARTMENTDESC) VALUES (?, ?)";
        $stmt = $this->conn->prepare($query);
        $departmentDesc = isset($input['DEPARTMENTDESC']) ? $input['DEPARTMENTDESC'] : '';
        $stmt->bind_param("ss", $input['DEPARTMENT'], $departmentDesc);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Department created successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to create department']);
        }
    }

    public function update($id) {
        $input = json_decode(file_get_contents('php://input'), true);

        $fields = [];
        $params = [];
        $types = "";

        if (isset($input['DEPARTMENT'])) {
            $fields[] = "DEPARTMENT = ?";
            $params[] = $input['DEPARTMENT'];
            $types .= "s";
        }
        if (isset($input['DEPARTMENTDESC'])) {
            $fields[] = "DEPARTMENTDESC = ?";
            $params[] = $input['DEPARTMENTDESC'];
            $types .= "s";
        }

        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'No fields to update']);
            return;
        }

        $query = "UPDATE tbldepartment SET " . implode(', ', $fields) . " WHERE DEPARTMENTID = ?";
        $stmt = $this->conn->prepare($query);
        $params[] = $id;
        $types .= "i";
        $stmt->bind_param($types, ...$params);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Department updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update department']);
        }
    }

    public function delete($id) {
        $query = "DELETE FROM tbldepartment WHERE DEPARTMENTID = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Department deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to delete department']);
        }
    }
}
?>