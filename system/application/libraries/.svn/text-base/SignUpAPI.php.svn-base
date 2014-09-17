<?php
class SignUpAPI extends ControllerBase {
	protected $tableName = "User";

	/**
      * @remotable
      * @formHandler
      */
	public function doSignup($params) {
		//check unique email address
		$q = Doctrine_Query::create()->select('u.email')
			->from('User u')
			->where('u.email = ?', $params['email']);
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);

		if (sizeof($result) > 0) {
			return array("success" => false, "msg" => "You're email address has already been registered. Please choose a different email address.");
		}
		
/*		
		foreach ($result as $key => $value) {
			if($value['email'] == $params['email']){
			}
		}
*/
		
		//check unique login
		$q = Doctrine_Query::create()->select('u.login')
			->from('User u')
			->where('u.login = ?', $params['login']);
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);

		
		if ($result){
				return array("success" => false, "msg" => "This login is already taken. Please use another login.");
		}
		
		//update org table
		$org = new Org();
		$org->orgName = $params['orgName'];
		$org->zip = $params['zip'];
		$org->rTime = date("Y-m-d : H:i:s", time());
		$org->save();
		//echo $org->ID;
		
		//update contact_value table 
		$contactValue = new ContactValue();
		$contactValue->orgID = $org->ID;
		$contactValue->firstName = $params['firstName'];
		$contactValue->lastName = $params['lastName'];
		$contactValue->email = $params['email'];
		$contactValue->type = "1";
		$contactValue->rTime = date("Y-m-d : H:i:s", time());
		$contactValue->save();
	
		
		//update user table
		$user = new User();
		$user->orgID = $org->ID;
		$user->login = $params['login'];
		$user->password = $params['password'];
		$user->email = $params['email'];
		$user->userRoleID = 1;
		$user->contactID = $contactValue->ID;
		$user->rUser = $user->ID;
		$user->rTime = date("Y-m-d : H:i:s", time());
		$user->save();
		
		
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
       
        
		$subject = "mOQOLD Activation Notification";
		
		$message = "Hello ";
		$message .= $params['firstName']." ".$params['lastName']." from mOQOLD,<br><br>";
		
		$message .= "Congratulations! Thank you for signing up to use the mOQOLD 
		             (<a href='http://www.moqold.com/moqoldWeb/index.html'>www.moqold.com</a>) site. 
		             Please note -you must complete this last step to activate 
		             your account and become a user of the website.<br><br>";
		
		$message .= "Please click on this link below:<br><a href='";
    	$message .= $host;
    	$message .= "index.html#Confirm'>".$host."index.html#Confirm</a><br><br>"; 
		
    	$message .= "You'll be asked to enter your email address and password, and 
    				then we will activate your account to allow you to start using 
    				the website. If you are unable to activate your account by clicking 
    				on the link above, please copy and paste the entire URL below into 
    				your web browser. Once the account has been activated, we recommend 
    				you flow the wizard if you are the first person in your organization 
    				using the site. ";
    	
    	$message .= "Do not reply to this automatically-generated email. If you have any 
    				questions or problems, please email us at 
    				<a href='mailto:support@moqold.com'>support@moqold.com</a>.<br><br>";
    	
    	$message .= "All the best,<br>mOQOLD Support Team<br><br>";
    	
    	//print the footer
    	$message .= "<hr size='2' color='#000000'><br>";
    	$message .= "<a href='http://www.moqold.com/moqoldWeb/index.html'>Home</a> | 
    	             <a href='http://www.moqold.com/moqoldWeb/index.html#Static|page=WhatIsmOQOLD'>What is mOQOLD?</a> |
    	             <a href='http://www.moqold.com/moqoldWeb/index.html#Static|page=Help'>Get Help </a> |
    	             <a href='http://www.moqold.com/moqoldWeb/index.html#Static|page=Security'>Privacy</a> |
    	             <a href='http://www.moqold.com/moqoldWeb/index.html#Static|page=Terms'>Terms of Use</a>";
    	
    	
		$this->sendMail($params['email'], $subject, $message);

		$this->currentUser = $user;

		
		return array("success" => true, "msg" => $message);
	}
}