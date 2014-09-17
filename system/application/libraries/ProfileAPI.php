<?php

class ProfileAPI extends ControllerBase {
	protected $tableName = "User";
	protected $pageName = "Profile";
	protected $updateOrgId = true;
    protected $updateFields = array('password', 'email', 'rUser', 'rTime');
	protected $oneToOne = array(
	   		  'contactID' => array(
	        	'tableName' => 'ContactValue',
	       		'updateFields' => array('firstName', 'lastName', 'email', "address1", "address2", "city", "state", "zip", "phoneNumber", "cellNumber", 'rUser', 'rTime'),
            	'flatten' => true
	    )
	);
	
	protected function getLoadFormID() {	
		return $this->getUserID();
	}
	
	public function doPasswordCheck($params){
		$userID = $this->getUserID();
		$q = Doctrine_Query::create()->select('u.password')
    	                        ->from('User u')
    	                        ->where("ID = $userID");                    
   		$q->execute();
		return $q->fetchOne();
   		return $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		//if ($params->curPassword == )
	}
	
	protected function prepareListQuery($q) {
        $q->from("User u, u.ContactValue c");
		$q->where("u.orgID = ?", $this->getOrgID());
    }
	
	/**
     * @remotable
     * @formHandler
     */
    public function saveForm($a) {
		//do current password validation here and update $a Array
		if(strlen($a["curr_password"]) > 0) {
			$hashedPass = $this->generateHash($a["curr_password"]);
			$currPass = $this->doPasswordCheck("");
			if ($hashedPass == $currPass->password) {
				$a["password"] = $a["new_password"];
			} else {
				return array("success" => false, "msg" => "The current password you have entered does not match our records.");
			}
		}
		return parent::saveForm($a);
	}
}
