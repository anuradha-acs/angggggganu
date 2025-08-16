
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../include/initialize.php';

// Include all controllers and middleware
require_once 'middleware/AuthMiddleware.php';
require_once 'controllers/AuthController.php';
require_once 'controllers/LeaveController.php';
require_once 'controllers/EmployeeController.php';
require_once 'controllers/CompanyController.php';
require_once 'controllers/DepartmentController.php';
require_once 'controllers/LeaveTypeController.php';

// Initialize auth middleware
$authMiddleware = new AuthMiddleware();

// Get the request URI and method
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

// Remove query string from URI
$uri = parse_url($request_uri, PHP_URL_PATH);

// Remove the base path (assuming the API is at /api/)
$uri = str_replace('/api', '', $uri);

// Split the URI into segments
$segments = array_filter(explode('/', $uri));
$segments = array_values($segments); // Re-index array

// Route the request
try {
    // Authentication routes
    if ($segments[0] === 'auth') {
        $authController = new AuthController();
        
        if ($segments[1] === 'login' && $request_method === 'POST') {
            $authController->login();
        } elseif ($segments[1] === 'logout' && $request_method === 'POST') {
            echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Auth endpoint not found']);
        }
    }
    // Leaves routes (protected)
    elseif ($segments[0] === 'leaves') {
        $currentUser = $authMiddleware->validateToken();
        $leaveController = new LeaveController();
        
        if (count($segments) === 1) {
            // /api/leaves
            if ($request_method === 'GET') {
                $leaveController->getAll();
            } elseif ($request_method === 'POST') {
                $leaveController->create();
            }
        } elseif (count($segments) === 2) {
            if ($segments[1] === 'my-leaves' && $request_method === 'GET') {
                $leaveController->getMyLeaves();
            } elseif ($segments[1] === 'pending' && $request_method === 'GET') {
                $leaveController->getPending();
            } elseif ($segments[1] === 'approved' && $request_method === 'GET') {
                $leaveController->getApproved();
            } elseif ($segments[1] === 'rejected' && $request_method === 'GET') {
                $leaveController->getRejected();
            } elseif (is_numeric($segments[1])) {
                // /api/leaves/{id}
                $id = intval($segments[1]);
                if ($request_method === 'GET') {
                    $leaveController->getById($id);
                } elseif ($request_method === 'PUT') {
                    $leaveController->update($id);
                } elseif ($request_method === 'DELETE') {
                    $leaveController->delete($id);
                }
            }
        } elseif (count($segments) === 3 && is_numeric($segments[1])) {
            $id = intval($segments[1]);
            if ($segments[2] === 'approve' && $request_method === 'POST') {
                $leaveController->approve($id);
            } elseif ($segments[2] === 'reject' && $request_method === 'POST') {
                $leaveController->reject($id);
            }
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Leave endpoint not found']);
        }
    }
    // Employees routes
    elseif ($segments[0] === 'employees') {
        $employeeController = new EmployeeController();
        
        if (count($segments) === 1) {
            // /api/employees
            if ($request_method === 'GET') {
                $employeeController->getAll();
            } elseif ($request_method === 'POST') {
                $employeeController->create();
            }
        } elseif (count($segments) === 2 && is_numeric($segments[1])) {
            // /api/employees/{id}
            $id = intval($segments[1]);
            if ($request_method === 'GET') {
                $employeeController->getById($id);
            } elseif ($request_method === 'PUT') {
                $employeeController->update($id);
            } elseif ($request_method === 'DELETE') {
                $employeeController->delete($id);
            }
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Employee endpoint not found']);
        }
    }
    // Companies routes
    elseif ($segments[0] === 'companies') {
        $companyController = new CompanyController();
        
        if (count($segments) === 1) {
            // /api/companies
            if ($request_method === 'GET') {
                $companyController->getAll();
            } elseif ($request_method === 'POST') {
                $companyController->create();
            }
        } elseif (count($segments) === 2 && is_numeric($segments[1])) {
            // /api/companies/{id}
            $id = intval($segments[1]);
            if ($request_method === 'GET') {
                $companyController->getById($id);
            } elseif ($request_method === 'PUT') {
                $companyController->update($id);
            } elseif ($request_method === 'DELETE') {
                $companyController->delete($id);
            }
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Company endpoint not found']);
        }
    }
    // Departments routes
    elseif ($segments[0] === 'departments') {
        $departmentController = new DepartmentController();
        
        if (count($segments) === 1) {
            // /api/departments
            if ($request_method === 'GET') {
                $departmentController->getAll();
            } elseif ($request_method === 'POST') {
                $departmentController->create();
            }
        } elseif (count($segments) === 2 && is_numeric($segments[1])) {
            // /api/departments/{id}
            $id = intval($segments[1]);
            if ($request_method === 'GET') {
                $departmentController->getById($id);
            } elseif ($request_method === 'PUT') {
                $departmentController->update($id);
            } elseif ($request_method === 'DELETE') {
                $departmentController->delete($id);
            }
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Department endpoint not found']);
        }
    }
    // Leave Types routes
    elseif ($segments[0] === 'leave-types') {
        $leaveTypeController = new LeaveTypeController();
        
        if (count($segments) === 1) {
            // /api/leave-types
            if ($request_method === 'GET') {
                $leaveTypeController->getAll();
            } elseif ($request_method === 'POST') {
                $leaveTypeController->create();
            }
        } elseif (count($segments) === 2 && is_numeric($segments[1])) {
            // /api/leave-types/{id}
            $id = intval($segments[1]);
            if ($request_method === 'GET') {
                $leaveTypeController->getById($id);
            } elseif ($request_method === 'PUT') {
                $leaveTypeController->update($id);
            } elseif ($request_method === 'DELETE') {
                $leaveTypeController->delete($id);
            }
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Leave type endpoint not found']);
        }
    }
    else {
        http_response_code(404);
        echo json_encode(['error' => 'API endpoint not found']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error: ' . $e->getMessage()]);
}
?>
