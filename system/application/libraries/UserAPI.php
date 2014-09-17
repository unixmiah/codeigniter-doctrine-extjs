<?php
class UserAPI extends ControllerBase {
	protected $tableName = "User";
	protected $listFields = "u.ID, u.login, u.userRoleID, u.contactID, u.devicePin, u.inActiveDate, u.lastSetupOrder, u.isActive, c.firstName as firstName, c.lastName as lastName, c.email as email, c.colorCode as colorCode, CONCAT_WS(', ', c.lastName, c.firstName) fullName";
	protected $updateFields = array('orgID', 'login', 'password', 'email', 'devicePin', 'userRoleID', 'rUser', 'rTime');
	protected $updateOrgId = true;
	protected $oneToOne = array(
		'contactID' => array(
			'tableName' => 'ContactValue',
			'updateFields' => array("orgID", 'firstName', 'lastName', 'email', 'type', "colorCode", 'rUser', 'rTime'),
			'flatten' => true
		)
	);
	protected $saveRelationsLater = true;
	
	protected function prepareListQuery($q) {
		$q->from("User u, u.ContactValue c");
		$q->where("u.orgID = ?", $this->getOrgID());
	}
	
    /**
    * @remotable
    * @formHandler
    */
   	public function saveForm($a) {
		$a['type'] = 1;
		return parent::saveForm($a);
	}

    /**
     * @remotable
     */
    public function update($a){
		$password = '';
		if(isset($a->items->password)) {
			$password = $a->items->password;
		}
		if(strlen($password) === 0) {
			unset($a->items->password);
		}
		$response = parent::update($a);
		if(strlen($password) > 0) {
			$response['items'][0]['password'] = $password;
		}
		return $response;
    }
	

	/**
	  * @remotable
	  */
	public function getNameForID ( $id ) {
	  $query = " select login from user where id=$id";
	  $q = Doctrine_Manager::getInstance()->getCurrentConnection();
	  $result = $q->execute($query);
		$result = $result->fetchAll();
		if(empty($result)) {
		
		return array(
							'success' => false,
							'msg' => "No activity found for given id.");
		} else {
		$lid = $result[0]['login'];
				return array(
							'success' => true,
							'login' => $lid);

		}

	}


	/**
	  * @remotable
	  */
	public function sendToUser($params){
		//server full path
		$fullPath = $_SERVER["REQUEST_URI"];
		
		//detect environments 
		if(stristr($fullPath, "uat")){
        	$host = "https://".$_SERVER['SERVER_NAME']."/uat/moqoldWeb/";
		} elseif(stristr($fullPath, "moqoldWeb")) {
        	$host = "https://".$_SERVER['SERVER_NAME']."/moqoldWeb/";
		} else{
			$host = "https://".$_SERVER['SERVER_NAME']."/";
		} 
		
		
		$subject = "mOQOLD || Change your temporary password.";
		$message = "Thank you for signing up and your account has been created. Your username is ";
		$message .= $params->login." and this is your password: ".$params->password;
		$message .= "<br><br>This is your device pin number:".$params->devicePin;
		$message .= "<br>Please click on this link below:<br><a href='";
    	$message .= $host;
    	$message .= "index.html#Confirm'>".$host."index.html#Confirm</a><br><br>"; 
		
    	$message .= "You'll be asked to enter your email address and password, and 
    				then we will activate your account to allow you to start using 
    				the website. If you are unable to activate your account by clicking 
    				on the link above, please copy and paste the entire URL below into 
    				your web browser. Once the account has been activated, we recommend 
    				you flow the wizard if you are the first person in your organization 
    				using the site. ";
		
		$this->sendMail($params->email, $subject, $message);
		return array("success" => true);
	}
	
}