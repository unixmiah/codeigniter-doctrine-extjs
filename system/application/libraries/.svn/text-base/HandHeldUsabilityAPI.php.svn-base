<?php
class HandHeldUsabilityAPI extends ControllerBase {
	protected $tableName = "HandheldUsabilityLog";
	protected $updateFields = array("orgID","sessionID","actionName", "actionDuration", "rTime", "rUser", "actionStime", "actionEtime");
	protected $updateAuditInfo = false;

	protected function getLoadFormID($a) {
		return 0;
	}

	protected function hasPermission($permissionType) {
		return true;
	}

	/**
	 * @remotable
	 * @formHandler
	 */
	public function HandheldUsabilityLog($params){

	  //Parse Log data, decode JSON data into a workable array
	  $logData = json_decode($params['logData'], TRUE);
	  	  
	  //Doctrine connection string
	  $q = Doctrine_Manager::getInstance()->getCurrentConnection();

          //orgID
	  $orgID = $this->getOrgID();

	  //rUser
	  $rUser = $this->getUserID();

	  //rTime
	  $rTime = date("Y-m-d : H:i:s", time());
	  
	  $logSize = sizeof($logData) - 1;
	  for ($i = 0; $i <= $logSize; $i++) {

	      //Session ID
	      $sessionID = $logData[$i]['sessionID'];

       	      //Action Name 
	      $actionName = $logData[$i]['actionName'];
		
	      //Action Duration: if there is no value set it to 0.00
	      //Sometimes the time is too short to record 
    	  if(isset($logData[$i]['actionDuration'])){
				$actionDuration = floatval($logData[$i]['actionDuration']);
	      }else{
	          $actionDuration = 0.00;	
	      }
	      
	      //Device ID: currently its null but give it a value of 0 if none is present
	      $deviceID = 0;
	      
	      //Action Start Time
	      $actionStime = date("Y-m-d H:i:s", strtotime($logData[$i]['actionStime']));

	      //Action End Time
	      $actionEtime = date("Y-m-d H:i:s", strtotime($logData[$i]['actionEtime']));

	      $result = $q->execute("INSERT INTO `handheld_usability_log` (`orgID`, `sessionID`, `actionName`, `actionDuration`, `rTime`, `rUser`, `deviceID`, `actionStime`, `actionEtime`) VALUES ('$orgID', '$sessionID', '$actionName', '$actionDuration', NOW( ), '$rUser', '$deviceID', '$actionStime', '$actionEtime')");  
	  }

	  return array("success" => true);

	}
}