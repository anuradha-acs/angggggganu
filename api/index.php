
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';
require_once 'controllers/AuthController.php';
require_once 'controllers/LeaveController.php';
require_once 'controllers/CompanyController.php';
require_once 'controllers/DepartmentController.php';
require_once 'controllers/EmployeeController.php';
require_once 'controllers/LeaveTypeController.php';

try {
    $request_uri = $_SERVER['REQUEST_URI'];
    $path = parse_url($request_uri, PHP_URL_PATH);
    $path_segments = explode('/', trim($path, '/'));
    
    // Remove 'api' from path if present
    if ($path_segments[0] === 'api') {
        array_shift($path_segments);
    }
    
    $request_method = $_SERVER['REQUEST_METHOD'];
    
    // Create database connection
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    // Route handling
    if (count($path_segments) >= 1) {
        $endpoint = $path_segments[0];
        
        switch ($endpoint) {
            case 'auth':
                $authController = new AuthController($conn);
                if (count($path_segments) >= 2) {
                    $action = $path_segments[1];
                    switch ($action) {
                        case 'login':
                            if ($request_method === 'POST') {
                                $authController->login();
                            }
                            break;
                        case 'logout':
                            if ($request_method === 'POST') {
                                $authController->logout();
                            }
                            break;
                        case 'verify':
                            if ($request_method === 'GET') {
                                $authController->verify();
                            }
                            break;
                    }
                }
                break;
                
            case 'leaves':
                $leaveController = new LeaveController($conn);
                if (count($path_segments) >= 2) {
                    $action = $path_segments[1];
                    if ($action === 'my-leaves') {
                        if ($request_method === 'GET') {
                            $empId = $_GET['empId'] ?? '';
                            $leaveController->getMyLeaves($empId);
                        }
                    } elseif (is_numeric($action)) {
                        $id = intval($action);
                        if ($request_method === 'PUT') {
                            $_GET['id'] = $id;
                            $leaveController->updateLeaveStatus();
                        } elseif ($request_method === 'DELETE') {
                            $leaveController->deleteLeave($id);
                        }
                    }
                } else {
                    if ($request_method === 'GET') {
                        $leaveController->getLeaves();
                    } elseif ($request_method === 'POST') {
                        $leaveController->createLeave();
                    }
                }
                break;
                
            case 'companies':
                $companyController = new CompanyController($conn);
                if (count($path_segments) >= 2 && is_numeric($path_segments[1])) {
                    $id = intval($path_segments[1]);
                    if ($request_method === 'GET') {
                        $companyController->getById($id);
                    } elseif ($request_method === 'PUT') {
                        $companyController->update($id);
                    } elseif ($request_method === 'DELETE') {
                        $companyController->delete($id);
                    }
                } else {
                    if ($request_method === 'GET') {
                        $companyController->getAll();
                    } elseif ($request_method === 'POST') {
                        $companyController->create();
                    }
                }
                break;
                
            case 'departments':
                $departmentController = new DepartmentController($conn);
                if (count($path_segments) >= 2 && is_numeric($path_segments[1])) {
                    $id = intval($path_segments[1]);
                    if ($request_method === 'GET') {
                        $departmentController->getById($id);
                    } elseif ($request_method === 'PUT') {
                        $departmentController->update($id);
                    } elseif ($request_method === 'DELETE') {
                        $departmentController->delete($id);
                    }
                } else {
                    if ($request_method === 'GET') {
                        $departmentController->getAll();
                    } elseif ($request_method === 'POST') {
                        $departmentController->create();
                    }
                }
                break;
                
            case 'employees':
                $employeeController = new EmployeeController($conn);
                if (count($path_segments) >= 2 && is_numeric($path_segments[1])) {
                    $id = intval($path_segments[1]);
                    if ($request_method === 'GET') {
                        $employeeController->getById($id);
                    } elseif ($request_method === 'PUT') {
                        $employeeController->update($id);
                    } elseif ($request_method === 'DELETE') {
                        $employeeController->delete($id);
                    }
                } else {
                    if ($request_method === 'GET') {
                        $employeeController->getAll();
                    } elseif ($request_method === 'POST') {
                        $employeeController->create();
                    }
                }
                break;
                
            case 'leave-types':
                $leaveTypeController = new LeaveTypeController($conn);
                if (count($path_segments) >= 2 && is_numeric($path_segments[1])) {
                    $id = intval($path_segments[1]);
                    if ($request_method === 'GET') {
                        $leaveTypeController->getById($id);
                    } elseif ($request_method === 'PUT') {
                        $leaveTypeController->update($id);
                    } elseif ($request_method === 'DELETE') {
                        $leaveTypeController->delete($id);
                    }
                } else {
                    if ($request_method === 'GET') {
                        $leaveTypeController->getAll();
                    } elseif ($request_method === 'POST') {
                        $leaveTypeController->create();
                    }
                }
                break;
                
            default:
                http_response_code(404);
                echo json_encode(['error' => 'API endpoint not found']);
        }
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Invalid API request']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error: ' . $e->getMessage()]);
}
?>
