
-- Create database
CREATE DATABASE IF NOT EXISTS leavedb;
USE leavedb;

-- Companies table
CREATE TABLE IF NOT EXISTS `tblcompany` (
  `COMPID` int(11) NOT NULL AUTO_INCREMENT,
  `COMPANY` varchar(90) NOT NULL,
  PRIMARY KEY (`COMPID`)
);

-- Sample companies
INSERT INTO `tblcompany` (`COMPID`, `COMPANY`) VALUES
(1, 'Tech Solutions Inc'),
(2, 'Digital Marketing Pro'),
(3, 'Finance Solutions Ltd');

-- Departments table  
CREATE TABLE IF NOT EXISTS `tbldepartment` (
  `DEPTID` int(11) NOT NULL AUTO_INCREMENT,
  `DEPARTMENT` varchar(90) NOT NULL,
  `COMPID` int(11) NOT NULL,
  PRIMARY KEY (`DEPTID`)
);

-- Sample departments
INSERT INTO `tbldepartment` (`DEPTID`, `DEPARTMENT`, `COMPID`) VALUES
(1, 'Human Resources', 1),
(2, 'Information Technology', 1),
(3, 'Administration', 1),
(4, 'Marketing', 2),
(5, 'Finance', 3);

-- Employees table
CREATE TABLE IF NOT EXISTS `tblemployee` (
  `EMPID` int(11) NOT NULL AUTO_INCREMENT,
  `EMPLOYID` varchar(30) NOT NULL,
  `EMPNAME` varchar(90) NOT NULL,
  `EMPPOSITION` varchar(90) NOT NULL,
  `USERNAME` varchar(90) NOT NULL,
  `PASSWRD` varchar(90) NOT NULL,
  `ACCSTATUS` varchar(30) NOT NULL,
  `EMPSEX` varchar(11) NOT NULL,
  `COMPANY` varchar(90) NOT NULL,
  `DEPARTMENT` varchar(90) NOT NULL,
  `AVELEAVE` int(11) NOT NULL DEFAULT 15,
  PRIMARY KEY (`EMPID`)
);

-- Sample employees (password is 'admin123' hashed with SHA1)
INSERT INTO `tblemployee` (`EMPID`, `EMPLOYID`, `EMPNAME`, `EMPPOSITION`, `USERNAME`, `PASSWRD`, `ACCSTATUS`, `EMPSEX`, `COMPANY`, `DEPARTMENT`, `AVELEAVE`) VALUES
(1, 'EMP001', 'John Administrator', 'Administrator', 'admin', 'd033e22ae348aeb5660fc2140aec35850c4da997', 'YES', 'Male', 'Tech Solutions Inc', 'Human Resources', 15),
(2, 'EMP002', 'Sarah Johnson', 'Supervisor user', 'sarah.johnson', 'd033e22ae348aeb5660fc2140aec35850c4da997', 'YES', 'Female', 'Tech Solutions Inc', 'Human Resources', 15),
(3, 'EMP003', 'Mike Wilson', 'Normal user', 'mike.wilson', 'd033e22ae348aeb5660fc2140aec35850c4da997', 'YES', 'Male', 'Tech Solutions Inc', 'Information Technology', 15),
(4, 'EMP004', 'Lisa Davis', 'Normal user', 'lisa.davis', 'd033e22ae348aeb5660fc2140aec35850c4da997', 'YES', 'Female', 'Digital Marketing Pro', 'Marketing', 15);

-- Leave types table
CREATE TABLE IF NOT EXISTS `tblleavetype` (
  `LEAVTID` int(11) NOT NULL AUTO_INCREMENT,
  `LEAVETYPE` varchar(90) NOT NULL,
  `DESCRIPTION` varchar(200) NOT NULL,
  PRIMARY KEY (`LEAVTID`)
);

-- Sample leave types
INSERT INTO `tblleavetype` (`LEAVTID`, `LEAVETYPE`, `DESCRIPTION`) VALUES
(1, 'SICK LEAVE', 'Medical or health-related absences'),
(2, 'CASUAL LEAVE', 'Personal time off for personal matters'),
(3, 'EARNED LEAVE', 'Annual vacation leave earned through service'),
(4, 'MATERNITY LEAVE', 'Leave for new mothers'),
(5, 'PATERNITY LEAVE', 'Leave for new fathers'),
(6, 'UNPAID LEAVE', 'Leave without pay');

-- Leave applications table
CREATE TABLE IF NOT EXISTS `tblleave` (
  `LEAVEID` int(11) NOT NULL AUTO_INCREMENT,
  `EMPLOYID` varchar(30) NOT NULL,
  `DATESTART` date NOT NULL,
  `DATEEND` date NOT NULL,
  `NODAYS` decimal(5,1) NOT NULL,
  `SHIFTTIME` varchar(30) NOT NULL,
  `TYPEOFLEAVE` varchar(90) NOT NULL,
  `REASON` text NOT NULL,
  `LEAVESTATUS` varchar(30) NOT NULL DEFAULT 'PENDING',
  `ADMINREMARKS` text,
  `DATEPOSTED` date NOT NULL,
  PRIMARY KEY (`LEAVEID`)
);

-- Sample leave applications
INSERT INTO `tblleave` (`LEAVEID`, `EMPLOYID`, `DATESTART`, `DATEEND`, `NODAYS`, `SHIFTTIME`, `TYPEOFLEAVE`, `REASON`, `LEAVESTATUS`, `ADMINREMARKS`, `DATEPOSTED`) VALUES
(1, 'EMP003', '2024-01-15', '2024-01-17', 3.0, 'All Day', 'SICK LEAVE', 'Fever and flu symptoms', 'APPROVED', 'Take care and get well soon', '2024-01-10'),
(2, 'EMP004', '2024-01-20', '2024-01-22', 3.0, 'All Day', 'CASUAL LEAVE', 'Family function attendance', 'PENDING', 'N/A', '2024-01-12'),
(3, 'EMP003', '2024-02-01', '2024-02-05', 5.0, 'All Day', 'EARNED LEAVE', 'Vacation with family', 'REJECTED', 'Peak project period, please reschedule', '2024-01-25');
