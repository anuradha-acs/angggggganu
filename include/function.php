<?php

function strip_zeros_from_date($marked_string="") {
	//first remove the marked zeros
	$no_zeros = str_replace('*0', '', $marked_string);
	$cleaned_string = str_replace('*', '', $no_zeros);
	return $cleaned_string;
}

function redirect_to( $location = NULL ) {
	if ($location != NULL) {
		header("Location: {$location}");
		exit;
	}
}

function output_message($message="") {

	if (!empty($message)) { 
		return "<p class=\"message\">{$message}</p>";
	} else {
		return "";
	}
}

spl_autoload_register(function($class_name) {
	$class_name = strtolower($class_name);
	$path = LIB_PATH.DS."{$class_name}.php";
	if(file_exists($path)) {
		require_once($path);
	} else {
		die("The file {$class_name}.php could not be found.");
	}
});

function redirect($location=NULL){ 
	if ($location != NULL) {
		header("Location: {$location}");
		exit;
	}
}

function currencyFormat($amount){
	$formatted = number_format($amount, 2);
	return $formatted;
}

function message($msg="", $msgtype="") {
	if(!empty($msg)) {
		// store message in session  
		$_SESSION['message'] = $msg;
		$_SESSION['msgtype'] = $msgtype;    
	} else {
		return false;
	}
}

function check_message(){
	if(isset($_SESSION['message'])) {
		if(isset($_SESSION['msgtype'])) {
			if ($_SESSION['msgtype']=="info") {
				echo  '<div class="alert alert-info alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'. $_SESSION['message'] . '</div>';

			} elseif ($_SESSION['msgtype']=="error") {
				echo  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'. $_SESSION['message'] . '</div>';

			} elseif ($_SESSION['msgtype']=="success") {
				echo  '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'. $_SESSION['message'] . '</div>';
			}	 
			unset($_SESSION['message']);
			unset($_SESSION['msgtype']);
		}
	}
}

?>