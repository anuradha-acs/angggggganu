
<?php
// Simple configuration for API
define('DS', DIRECTORY_SEPARATOR);
define('SITE_ROOT', $_SERVER['DOCUMENT_ROOT']);
define('LIB_PATH', SITE_ROOT . DS . 'include');

// Include only necessary files
require_once(LIB_PATH . DS . 'database.php');

// Set timezone
date_default_timezone_set('UTC');

// Error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>
