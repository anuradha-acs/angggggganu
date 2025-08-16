
<?php
// Database configuration
defined('DB_HOST') ? null : define('DB_HOST', 'localhost');
defined('DB_USER') ? null : define('DB_USER', 'root');
defined('DB_PASS') ? null : define('DB_PASS', '');
defined('DB_NAME') ? null : define('DB_NAME', 'leavedb');

// Legacy database constants for backward compatibility
defined('server') ? null : define('server', 'localhost');
defined('user') ? null : define('user', 'root');
defined('pass') ? null : define('pass', '');
defined('database_name') ? null : define('database_name', 'leavedb');

// Calculate web root path
$this_file = str_replace('\\', '/', __FILE__);
$doc_root = $_SERVER['DOCUMENT_ROOT'];
$webRoot = str_replace(array($doc_root, 'include/config.php'), '', $this_file);
$srvRoot = str_replace('include/config.php', '', $this_file);

// Application configuration
defined('WEB_ROOT') ? null : define('WEB_ROOT', $webRoot);
defined('SRV_ROOT') ? null : define('SRV_ROOT', $srvRoot);
defined('SITE_NAME') ? null : define('SITE_NAME', 'Leave Management System');
?>
