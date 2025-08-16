<?php
session_start(); //before we store information of our member, we need to start first the session

class Session {
    private $logged_in = false;
    public $user_id;
    public $username;
    public $message;

    function __construct() {
        session_start();
        $this->check_message();
        $this->check_login();
    }

    public function is_logged_in() {
        return $this->logged_in;
    }

    public function login($user) {
        if($user) {
            $this->user_id = $_SESSION['EMPID'] = $user->EMPID;
            $this->username = $_SESSION['USERNAME'] = $user->USERNAME;
            $_SESSION['EMPNAME'] = $user->EMPNAME;
            $_SESSION['EMPPOSITION'] = $user->EMPPOSITION;
            $_SESSION['EMPSEX'] = $user->EMPSEX;
            $_SESSION['COMPANY'] = $user->COMPANY;
            $_SESSION['DEPARTMENT'] = $user->DEPARTMENT;
            $_SESSION['EMPLOYID'] = $user->EMPLOYID;
            $_SESSION['AVELEAVE'] = $user->AVELEAVE;
            $this->logged_in = true;
        }
    }

    public function logout() {
        unset($_SESSION['EMPID']);
        unset($_SESSION['USERNAME']);
        unset($_SESSION['EMPNAME']);
        unset($_SESSION['EMPPOSITION']);
        unset($_SESSION['EMPSEX']);
        unset($_SESSION['COMPANY']);
        unset($_SESSION['DEPARTMENT']);
        unset($_SESSION['EMPLOYID']);
        unset($_SESSION['AVELEAVE']);
        unset($this->user_id);
        unset($this->username);
        $this->logged_in = false;
    }

    public function check_login() {
        if(isset($_SESSION['EMPID'])) {
            $this->user_id = $_SESSION['EMPID'];
            $this->username = $_SESSION['USERNAME'];
            $this->logged_in = true;
        } else {
            unset($this->user_id);
            unset($this->username);
            $this->logged_in = false;
        }
    }

    public function message($msg="") {
        if(!empty($msg)) {
            $_SESSION['message'] = $msg;
        } else {
            return $this->message;
        }
    }

    public function check_message() {
        if(isset($_SESSION['message'])) {
            $this->message = $_SESSION['message'];
            unset($_SESSION['message']);
        } else {
            $this->message = "";
        }
    }
}

$session = new Session();

// Function moved to Session class methods above
?>
