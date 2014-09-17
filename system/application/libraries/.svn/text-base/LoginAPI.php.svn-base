<?php
include_once("ActivityAPI.php");
include_once("LocationAPI.php");
include_once("DimensionValueAPI.php");
include_once("IncidentActivityAPI.php");
include_once("IncidentCauseAPI.php");
include_once("BodyPartAPI.php");
include_once("FootwearAPI.php");
include_once("NoiseAPI.php");
include_once("WeatherAPI.php");
include_once("AnimalAPI.php");
include_once("ActivityAPI.php");
include_once("ClientAPI.php");
include_once("QolScoreValueAPI.php");
include_once("ContactAPI.php");
include_once("IncidentAPI.php");
include_once("ActivityDetailAPI.php");
include_once("ObservationAPI.php");
include_once("AllergyDetailAPI.php");
include_once("ClientSpecialcondDetailAPI.php");
include_once("AidDetailAPI.php");
include_once("IncidentBodypartAPI.php");
include_once("SiteConfigurationAPI.php");
include_once("AidAPI.php");

class LoginAPI extends ControllerBase {
    protected $tableName = "User";
    protected $listFields = "u.*, c.firstName as firstName, c.lastName as lastName";
	protected $oneToOne = array(
	    'contactID' => array(
	        'tableName' => 'ContactValue',
	        'updateFields' => array('firstName', 'lastName'),
            'flatten' => true
	    )
	        
	);

	protected function prepareListQuery($q) {
        $q->from("User u, u.ContactValue c");
    }
	
    
	protected function dimension(){
		//grab the dimension values from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
			->from('SystemRef s')
			->where("s.refType = 'dimension'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		
		
		//Check for existing record
		$q2 = Doctrine_Query::create()->select('d.orgID')
			->from('DimensionValue d')
			->where("d.orgID = ?", $this->getOrgID());
		$q2->execute();
		
		if ($result2 = $q2->execute(array(), Doctrine::HYDRATE_ARRAY)) {
			
		} else {
			
			//insert values into the dimension table
			foreach ($result as $key => $value){
				//return $key."-".$value['name'];
				
				//insert into dimension value table
				$dimension = new DimensionValue();
				$dimension->orgID = $this->getOrgID();
				$dimension->dimensionName = $value['name'];
				$dimension->isActive = 1;
				$dimension->rTime = $this->getDateFormat();
				$dimension->rUser = $this->getUserID();
				$dimension->save();
			}			
		}
	}
	
	/**
      * @remotable
      */
	protected function qolScore(){
		//grab the qolscore from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
			->from('SystemRef s')
			->where("s.refType = 'qolscore'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);

		//Check for existing record
		$q2 = Doctrine_Query::create()->select('q.orgID')
			->from('QolScoreValue q')
			->where("q.orgID = ?", $this->getOrgID());
		$q2->execute();
		
		if ($result2 = $q2->execute(array(), Doctrine::HYDRATE_ARRAY)) {
			
			
		} else {
		//insert values into the qolscore table
			foreach ($result as $key => $value){
				//return $key."-".$value['name'];
				
				//insert into qolscore value table
				$qolScore = new QolScoreValue();
				$qolScore->score = $value['name'];
				$qolScore->orgID = $this->getOrgID();
				$qolScore->isActive = 1;
				$qolScore->rTime = $this->getDateFormat();
				$qolScore->rUser = $this->getUserID();
				$qolScore->save();
			}
		}
	}
	
	protected function getPermissions($userRoleID) {
		$q = Doctrine_Query::create()->select('page.ID pageId, page.name pageName, p._create, p._update, p._delete, p._read, p._lock')->from("Permission p, p.RolePermission rp, p.PageRef page");
		$q->where('rp.userRoleId = ?', $userRoleID);
		$temp = $q->execute(array(), Doctrine::HYDRATE_ARRAY);

		$permissions = array();
		foreach($temp as $permissionInfo) {
			$locked = $permissionInfo['_lock'] != '0';
			$permissions[$permissionInfo['pageName']] = array(
				'create' => !$locked && $permissionInfo['_create'] == '1',
				'update' => !$locked && $permissionInfo['_update'] == '1',
				'delete' => !$locked && $permissionInfo['_delete'] == '1',
				'read' => !$locked && $permissionInfo['_read'] == '1'
			);
		}
		
		return $permissions;
	}
		
	/**
      * @remotable
      * @formHandler
      */
	public function doLogin($params) {
		$userName = $params['login'];
		$isDesktop = false;
		if(isset($params['isdesktop'])){
			$isDesktop = true;
		}

		$this->setSessionValue('isDesktop', $isDesktop);

		$q = Doctrine_Query::create()->select("u.*")
									 ->from("User u")
									 ->where('u.login = ?', $userName)
									 ->andWhere('u.isActive = ?', 1);
        $user = $q->fetchOne();

		if(isset($params['password'])) {
			$success = $user != null && $user->password == $this->generateHash($params['password']);
		} else {
			$success = $user != null && $user->devicePin == $params['devicePin'];
		}
		
		if($success) {
			
			//detect environments and set debug: 0:false/debug off 1:true/debug on
			$fullPath = $_SERVER["REQUEST_URI"];
			if(stristr($fullPath, "uat")){
	        	$userSession->debug = 1;
			} elseif(stristr($fullPath, "moqoldWeb")) {
	        	$userSession->debug = 1;
			} else{
	        	$userSession->debug = 0;
			} 
		
			$this->setSessionValue('user', $user->ID);
			$this->setSessionValue('userRole', $user->userRoleID);
			$this->setSessionValue('contactID', $user->contactID);

			$userSession = new UserSession();
			$userSession->userID = $user->ID;
			$userSession->hostIP = $this->getRealIpAddr();
			$userSession->userAgent = $_SERVER['HTTP_USER_AGENT'];
			//$userSession->refererName = -- useless in AJAX apps
			$userSession->startTime = $this->getDateFormat();
			$userSession->endTime = $userSession->startTime;
			$userSession->save();
			$this->setSessionValue('sessionId', $userSession->ID);
		}

		return $this->isLoggedIn($isDesktop);
	}

	private function getPageInfo() {
		$q = Doctrine_Query::create()->from("PageRef");
		$q->orderBy("setupOrder");
		return $q->execute(array(), Doctrine::HYDRATE_ARRAY);
	}
	
	private function getContactValue($id) {
		$q = Doctrine_Query::create()->select("c.firstName, c.lastName")->from("ContactValue c")->where("c.ID = ?", $id);
		$array = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		
		$array = $array[0];
		unset($array["ID"]);
		
		return $array;
	}
	
	private function getRealIpAddr()
	{
		if (!empty($_SERVER['HTTP_CLIENT_IP']))   //check ip from share internet
		{
		  $ip=$_SERVER['HTTP_CLIENT_IP'];
		}
		elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //to check ip is pass from proxy
		{
		  $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
		}
		else
		{
		  $ip=$_SERVER['REMOTE_ADDR'];
		}
		return $ip;
	}

	/**
      * @remotable
      */
	public function doLogout() {
        //$user = $this->getCurrentUser();
        //$orgID = $user->orgID;
        $CI = get_instance();
        $CI->session->sess_destroy();
		return array("success" => true);
	}
	
	/**
      * @remotable
	  * @formHandler
      */
	public function doLogoutForm($params) {
        return $this->doLogout();
	}
	
	/**
      * @remotable
      */
	public function setWizardStep($params) {
        $user = $this->getCurrentUser();
		$user->lastSetupOrder = $params->setupOrder;
		$user->save();
	}
	
	/**
      * @remotable
      * @formHandler
      */
	public function doForgot($params) {
		//will pass 'email'
		//get the password
		$email = $params['email'];
		
		//get login info from email
		
		
		//generate randon token
		$token = uniqid (rand (),false);
		
		//store the token string and time 
		$q = Doctrine_Manager::getInstance()->getCurrentConnection();
		$result = $q->execute("UPDATE `user` SET `token` = '$token' WHERE `user`.`email` = '$email'");
		
		//get login from email
		$q = Doctrine_Query::create()->select('u.login, u.email, u.isActive')
			->from('User u')
		  ->where('u.email = ?', $email);
			
			
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		//check to see if the user exists otherwise don't process the email to change password
		foreach ($result as $key => $value){
			  $login = $value['login'];
			  $isActive = $value['isActive'];
		}

		if($result && $isActive > 0){
			
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
			
	            
			//Subject
			$subject = "mOQOLD || Forgot Password.";
			
			//Message 
			$message = "Your login is ".$login." and ";	
			$message .= "below is the link to reset your current password. Please click on the link and you'll be prompted to change your password.<br><br>"; 	
			
			$message .= "<a href='";
			$message .= $host;
			$message .= "index.html#Forgot|t=$token";
			$message .= "'>";
			$message .= $host;
			$message .= "index.html#Forgot|t=$token";
			$message .= "</a>";
			
			try
			{
				$this->sendMail($params['email'], $subject, $message);
			} catch (Exception $e) {
				return array(
					"success" => false,
					"msg" => "An error occured while sending mail."
				);
			}
	
			return array("success" => true, "msg" => "An email has been sent to your account to reset your password.");
				
		} else {
			$email = "";
			$isActive = 0;

			foreach ($result as $key => $value){
			  $isActive = $value['isActive'];
			  $email    = $value['email'];
			}
			
			if(empty($email)) {
				return array("success" => false, "msg" => "We cannot find the account associated with the email address you provided.");		
			} elseif ($isActive == 0){
				return array("success" => false, "msg" => "You have not activated your account. Please activate your account before logging into account.");
			} 
			
		}
		
	}
	
	/**
      * @remotable
      * @formHandler
      */
	public function resetPassword($params){
	       
		//email
		$token = $params['t'];
		
		//get the token from the database 
		$q = Doctrine_Query::create()->select('u.token, u.tokenTime')
			->from('User u')
			->where("u.token = '$token'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		
		//insert values into the location table
		foreach ($result as $key => $value){
			//check the url token against the database token
			if ($value['token'] == $token) {
			        
				$password = $this->generateHash($params['password']);
				$q = Doctrine_Manager::getInstance()->getCurrentConnection();
				$result = $q->execute("UPDATE `user` SET `password` = '$password' WHERE `user`.`token` = '$token'");
				//$q->getSqlQuery();
				//exit();
				return array("success" => true, "msg" => "Password updated successfully, Click login to log into the system.");
				
			} else {
				
				return array("success" => false, "msg" => "The tokens do not match.");
			}
		}
		
		
	}
	
	
	/**
      * @remotable
      */
	public function isLoggedIn($isDesktop = false) {
		$user = $this->getCurrentUser();
		$success = is_object($user);
		$permissions = false;
		$pageRef = $this->getPageInfo();
		$setupOrder = 0;
		$contactValue = array();
		$login = null;
		$contactID = null;
		$orgID = null;
		$CI = get_instance();
		
		//loading all the data
		$rec->ID = $orgID;
		$locationAPI = new LocationAPI();
		$activityAPI = new ActivityAPI();
		$siteSpecificAPI = new SiteConfigurationAPI();
		$contactAPI = new ContactAPI();
		$dimensionAPI = new DimensionValueAPI();
		$incidentActivityAPI = new IncidentActivityAPI();
		$incidentCauseAPI = new IncidentCauseAPI();
		$bodyPartAPI = new BodyPartAPI();
		$footwearAPI = new FootwearAPI();
		$noiseAPI = new NoiseAPI();
		$weatherAPI = new WeatherAPI();
		$animalAPI = new AnimalAPI();
		$clientAPI = new ClientAPI();
		$contactAPI = new ContactAPI();
		$incidentAPI = new IncidentAPI();
		$activityDetailAPI = new ActivityDetailAPI();
		$observationAPI = new ObservationAPI();
		$allergyAPI = new AllergyDetailAPI();
		$conditionAPI = new ClientSpecialcondDetailAPI();
		$residentAidAPI = new AidDetailAPI();
		$residentInjuryAPI = new IncidentBodypartAPI();
		$qolScores = new QolScoreValueAPI();
		$aidAPI = new AidAPI();
		$returnValue = array();
		if ($success) {
			$contactValue = $this->getContactValue($user->contactID);
			$contactID = $user->contactID;
			$role = $this->getSessionValue("userRole");
			$setupOrder = $role == 1 ? $user->lastSetupOrder : 999;
			$permissions = $this->getPermissions($role);
			$orgID = $user->orgID;
			$login = $user->login;
			
		}

		$returnValue = array("success" => $success,"permissions" => $permissions, "orgID" => $orgID, "pageRef" => $pageRef, "setupOrder" => $setupOrder, "contactValue" => $contactValue, "login" => $login, "contactID" => $contactID, "loggedUID" => $this->getUserID(), "sessionTimeOut" => $CI->session->sess_expiration);
		

		if($success && !$isDesktop) {
			$returnValue["LocationList"] = $locationAPI->listAll($rec);
			$returnValue["ActivityValueList"] = $activityAPI->listAll($rec);
			$returnValue["SiteSpecific"] = $siteSpecificAPI->listAll($rec);
			$returnValue["UserList"] = $contactAPI->listAll($rec);
			$returnValue["DimensionList"] = $dimensionAPI->listAll($rec);
			$returnValue["IncidentActivityList"] =$incidentActivityAPI->listAll($rec);
			$returnValue["IncidentCauseList"] =$incidentCauseAPI->listAll($rec);
			$returnValue["FootwearList"] = $footwearAPI->listAll($rec);
			$returnValue["NoiseList"] = $noiseAPI->listAll($rec);
			$returnValue["WeatherList"] = $weatherAPI->listAll($rec);
			$returnValue["AnimalList"] = $animalAPI->listAll($rec);
			$returnValue["ResidentList"] = $clientAPI->listAll($rec);
			$returnValue["StaffList"] = $contactAPI->listAll($rec);
			$returnValue["IncidentList"] = $incidentAPI->listAll($rec);
			$returnValue["ActivityList"] = $activityDetailAPI->listAll($rec);
			$returnValue["ObservationList"] = $observationAPI->listAll($rec);
			$returnValue["AllergyList"] = $allergyAPI->listAll($rec);
			$returnValue["ConditionList"] = $conditionAPI->listAll($rec);
			$returnValue["ResidentAidList"] = $residentAidAPI->listAll($rec);
			$returnValue["ResidentInjuryList"] = $residentInjuryAPI->listAll($rec);
			$returnValue["BodyPartList"] = $bodyPartAPI->listAll($rec);
			$returnValue["QOLScoreList"] = $qolScores->listAll($rec);

			$rec->type ="aid";
			$returnValue["AidList"] = $aidAPI->listAll($rec);

		}
		return $returnValue;
	}
	

	/**
	  * @remotable
	  * @formHandler
	  */
	public function isLoggedInForm() {
		return $this->isLoggedIn();
	}
	
	/**
      * @remotable
      * @formHandler
      */
	public function doConfirm($params) {
		//login
		$login = $params["login"];
		$email = $params["email"];
		
		$qConfirm = Doctrine_Query::create()->select("u.isActive")
									 ->from("User u")
									 ->where("u.login = ?", $login);
		
		$userConfirm = $qConfirm->fetchOne();
        

        if($userConfirm['isActive'] == 1){
        	return array("success" => false, "msg" => "You've already confirmed your account.");
        } else {

			$q = Doctrine_Query::create()->select("u.*")
										 ->from("User u")
										 ->where("u.login = ?", $login);
	        $user = $q->fetchOne();
	        $success = $user != null && $user->password == $this->generateHash($params['password']);
	        
			if($success) {
				$q = Doctrine_Query::create()
					->update("User u")
					->set("u.isActive", "1")
					->where("u.login = ?", $login);
				$q->execute();
				$this->setSessionValue('user', $user->ID);
				$this->setSessionValue('userRole', $user->userRoleID);
				$this->setSessionValue('contactID', $user->contactID);
	
				$this->currentUser = $user;
	
				$this->dimension();	
				$this->qolScore();
				
				return $this->isLoggedIn();
			} else {
				return array("success" => false, "msg" => "The account details you have entered does not match our records.");
			}
        }
	}
}