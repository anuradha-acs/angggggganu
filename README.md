# leavemanager
# Leave Management System

A complete full-stack leave management application with Angular 18 frontend and PHP backend.

## Architecture

- **Frontend**: Angular 18 with Bootstrap 5
- **Backend**: PHP with RESTful APIs
- **Database**: MySQL
- **Server**: PHP Built-in Development Server

## Project Structure

```
├── api/                          # PHP Backend APIs
│   ├── controllers/              # API Controllers
│   └── index.php                # API Router
├── leave-management-frontend/    # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/       # Angular Components
│   │   │   └── services/         # Angular Services
│   │   └── index.html
│   └── package.json
├── database/                     # Database Files
│   └── leavedb.sql              # MySQL Schema & Sample Data
└── include/                      # PHP Includes & Configurations
```

## Features

### User Management
- Secure login/logout with role-based authentication
- Support for Admin, HR, and Employee roles
- Session management and access control

### Company & Department Management
- Add, edit, delete companies
- Manage departments (HR, IT, Administration, etc.)
- Assign employees to companies and departments

### Leave Management
- Apply for different leave types (Sick, Casual, Earned, Maternity, etc.)
- Track leave status (Pending, Approved, Rejected)
- HR/Admin can approve/reject leave requests with remarks
- View leave history with filters

### Dashboard & Reports
- Role-based dashboards
- Leave statistics and summaries
- Historical leave data with status indicators

## Setup Instructions

### 1. Database Setup (XAMPP MySQL)

1. Start XAMPP and enable MySQL
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Create a new database named `leavedb`
4. Import the SQL file: `database/leavedb.sql`

### 2. Backend Configuration

Update the database configuration in `include/config.php`:

```php
<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'leavedb');
?>
```

### 3. Frontend Setup

Navigate to the Angular frontend directory:

```bash
cd leave-management-frontend
npm install
```

### 4. Running the Application

#### Option 1: Using Replit (Recommended)
Click the "Run" button to start both servers simultaneously.

#### Option 2: Manual Setup in VS Code

**Terminal 1 - Start PHP Backend:**
```bash
php -S 0.0.0.0:5000
```

**Terminal 2 - Start Angular Frontend:**
```bash
cd leave-management-frontend
npm start
```

### 5. Access the Application

- **Angular Frontend**: http://localhost:4200
- **PHP Backend APIs**: http://localhost:5000/api

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify session

### Leaves
- `GET /api/leaves` - Get all leaves
- `GET /api/leaves/my-leaves` - Get current user's leaves
- `GET /api/leaves/pending` - Get pending leaves
- `GET /api/leaves/approved` - Get approved leaves
- `GET /api/leaves/rejected` - Get rejected leaves
- `POST /api/leaves` - Create new leave request
- `PUT /api/leaves/{id}` - Update leave status
- `DELETE /api/leaves/{id}` - Delete leave

### Companies
- `GET /api/companies` - Get all companies
- `POST /api/companies` - Create company
- `PUT /api/companies/{id}` - Update company
- `DELETE /api/companies/{id}` - Delete company

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create department
- `PUT /api/departments/{id}` - Update department
- `DELETE /api/departments/{id}` - Delete department

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/{id}` - Get specific employee
- `POST /api/employees` - Create employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

### Leave Types
- `GET /api/leave-types` - Get all leave types
- `POST /api/leave-types` - Create leave type
- `PUT /api/leave-types/{id}` - Update leave type
- `DELETE /api/leave-types/{id}` - Delete leave typei/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify session

### Leaves
- `GET /api/leaves` - Get all leaves
- `GET /api/leaves/my-leaves` - Get current user's leaves
- `GET /api/leaves/pending` - Get pending leaves
- `POST /api/leaves` - Create new leave request
- `PUT /api/leaves/{id}` - Update leave status
- `DELETE /api/leaves/{id}` - Delete leave

### Companies
- `GET /api/companies` - Get all companies
- `POST /api/companies` - Create company
- `PUT /api/companies/{id}` - Update company
- `DELETE /api/companies/{id}` - Delete company

## Default Users

The system comes with pre-loaded sample data:

### Admin User
- **Username**: admin
- **Password**: admin123
- **Role**: Administrator

### HR User
- **Username**: hr.manager
- **Password**: hr123
- **Role**: Manager user

### Employee User
- **Username**: john.doe
- **Password**: emp123
- **Role**: Normal user

## Angular Services

### AuthService
- Handles user authentication
- Manages JWT tokens and user sessions
- Provides role-based authorization methods

### LeaveService
- Manages leave applications
- Handles CRUD operations for leaves
- Filters leaves by status and user

### CompanyService
- Manages company data
- Handles company CRUD operations

## Technologies Used

### Frontend
- **Angular 18**: Modern TypeScript framework
- **Bootstrap 5**: Responsive UI framework
- **RxJS**: Reactive programming with observables
- **Angular Reactive Forms**: Form validation and management

### Backend
- **PHP 8.2**: Server-side scripting
- **MySQL**: Database management
- **RESTful APIs**: JSON-based data exchange

## Development Notes

- Frontend runs on port 4200
- Backend runs on port 5000
- CORS is configured for cross-origin requests
- All API responses are in JSON format
- Authentication uses session-based tokens
- Bootstrap CSS is loaded via CDN in index.html

## Deployment

The application can be deployed on Replit using the built-in deployment features. The configuration supports both development and production environments.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
