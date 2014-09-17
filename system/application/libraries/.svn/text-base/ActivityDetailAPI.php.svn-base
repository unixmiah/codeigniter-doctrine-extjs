<?php
class ActivityDetailAPI extends ControllerBase {
	protected $tableName = 'ActivityDetail';
	protected $updateOrgId = true;
	
	protected $updateFields = array(
		"activityID",
		"locationTypeID",
		"actDtlStime",
		"actDtlDuration",
		"actDtlEtime",
		"numParticipant",
		"numStaff",
		"numVolunteer",
		"noiseInd",
		"scheduleInd",
		"hasFriendFamily",
		"hasAnimal",
		"photoID",
		"isComplete",
		"noiseTypeID",
		"animalTypeID",
		"weatherTypeID",
		"audioID",
		"notes",
		"staffID"
	);
	protected $listFields = "a.*";

	protected $splitDateFields = array(
		"actDtlStime" => "start",
		"actDtlEtime" => "end"
	);
	
	protected function prepareListQuery($q, $dateNeeded) {
        $q->from("ActivityDetail a");
		$q->where("orgID = ?", $this->getOrgID());
		if($dateNeeded == "null"){
		  //Current date 
		  $currentDate = date("Y-m-d");
		  //Get week range from given date
		  $weekRange = $this->getWeekRange($currentDate, $start=true);
		  $weekRange = explode("|", $weekRange);
		  $startDate = $weekRange[0];
		  $endDate   = $weekRange[1];
		  $q->andWhere("actDtlStime >=?", $startDate);
		  $q->andWhere("actDtlEtime <=?", $endDate);
		} else {
		  //Current date 
		  $dateNeeded = explode("T", $dateNeeded);
		  //Get week range from given date
		  $currentDate = $dateNeeded[0];

		 //Get week range from given date
		  $weekRange = $this->getWeekRange($currentDate, $start=true);
		  $weekRange = explode("|", $weekRange);
		  $startDate = $weekRange[0];
		  $endDate   = $weekRange[1];
		
		  $q->andWhere("actDtlStime >=?", $startDate);
		  $q->andWhere("actDtlEtime <=?", $endDate); 
		}
    }

   /**
     * @remotable
     */
    public function loadForm($params){
    	$prevSet = parent::loadForm($params);
    	$data = $prevSet['data'];
    	if(!isset($data['atcRecurrID'])){return $prevSet;}
    	$atcRecurrID = $data['atcRecurrID'];
 		$data['rrule'] = $this->getCurrentRule($atcRecurrID);
		$prevSet['data'] = $data;
        return $prevSet;
    }
    
	protected function populateArray($dataset){
		$neededValues = array("numParticipant","hasFriendFamily","noiseInd","hasAnimal","numStaff","numVolunteer","noiseTypeID","animalTypeID","weatherTypeID");
		foreach($neededValues as $key) {
			if(!array_key_exists($key , $dataset)){
				$dataset[$key] = "";
			}
		}
		return $dataset;
	}

    public function createActivity($dataSet) {
		//some of the values are not comming suring the add, so we need to add them to make as full query.
		//$dataSet = $this->populateArray($dataSet);
		$orgID = $this->getOrgID(); 	
    	$rUser = $this->getUserID();
    	$q = Doctrine_Manager::getInstance()->getCurrentConnection();
		$queryExists = "select `ID`,`orgID`,`actDtlStime` from `activity_detail` where `orgID`='$orgID' and `actDtlStime` = '$dataSet[calCstartDate]'";
		$result = $q->execute($queryExists);
		$result = $result->fetchAll();
		if(empty($result)) {
				$query = "INSERT INTO `activity_detail` (`ID`, `orgID`, `activityID`, `locationTypeID`, 
					`actDtlStime`, `actDtlDuration`, `actDtlEtime`, `rTime`, `rUser`, `staffID`, `atcRecurrID`,
					 `numParticipant`,`hasFriendFamily`,`noiseInd`,`hasAnimal`,`numStaff`,`numVolunteer`,`noiseTypeID`,`animalTypeID`,`weatherTypeID`)
					VALUES (NULL , '$orgID', '$dataSet[activityID]', '$dataSet[locationTypeID]', 
					'$dataSet[calCstartDate]', '$dataSet[actDtlDuration]', '$dataSet[actDtlEtime]', NOW( ), 
					'$rUser', '$dataSet[staffID]', '$dataSet[atcRecurrID]', '$dataSet[numParticipant]','$dataSet[hasFriendFamily]','$dataSet[noiseInd]','$dataSet[hasAnimal]',
					'$dataSet[numStaff]','$dataSet[numVolunteer]','$dataSet[noiseTypeID]','$dataSet[animalTypeID]','$dataSet[weatherTypeID]')";
				$query = str_replace("''",'NULL', $query);
				$result = $q->execute($query);
		} else {
			$id = $result[0]['ID'];
			$updateQuery = "UPDATE `activity_detail` SET 
							`activityID` = '$dataSet[activityID]', 
							`locationTypeID` ='$dataSet[locationTypeID]', 
							`actDtlStime` ='$dataSet[calCstartDate]', 
							`actDtlDuration` ='$dataSet[actDtlDuration]', 
							`actDtlEtime` = '$dataSet[actDtlEtime]', 
							`rTime` = NOW( ), 
							`rUser` = '$rUser', 
							`staffID` = '$dataSet[staffID]', 
							`atcRecurrID` = '$dataSet[atcRecurrID]',
							`numParticipant` = '$dataSet[numParticipant]',
							`hasFriendFamily` = '$dataSet[hasFriendFamily]',
							`noiseInd` = '$dataSet[noiseInd]',
							`hasAnimal` = '$dataSet[hasAnimal]',
							`numStaff` = '$dataSet[numStaff]',
							`numVolunteer` = '$dataSet[numVolunteer]',
							`noiseTypeID` = '$dataSet[noiseTypeID]',
							`animalTypeID` = '$dataSet[animalTypeID]',
							`weatherTypeID` = '$dataSet[weatherTypeID]'
							 WHERE `ID`='$id'";
			$updateQuery = str_replace("''",'NULL', $updateQuery);
			$result = $q->execute($updateQuery);
		}
    }

	protected function getCurrentRule($id){
		if($id > 0 ){
			$q = Doctrine_Manager::getInstance()->getCurrentConnection();
			$result = $q->execute("SELECT `rrule` FROM `activity_recurr` WHERE ID = $id");
    		$result = $result->fetchAll();
			return $result[0][0];
		} 
	}

	protected function isExisitingRecord($params) {
         return ($params > 0);
    }

	protected function removeRecurrence($id) {
    	$q = Doctrine_Manager::getInstance()->getCurrentConnection();
		$query = "update `activity_detail` set `atcRecurrID` = NULL where `ID` = '$id'";
		return $q->execute($query);
	}

	protected function removeRecurrences($id){
		 $q = Doctrine_Manager::getInstance()->getCurrentConnection();
		//Remove all the events from the series which has observations.
		$removeEventWithObsevQuery = "update activity_detail set atcrecurrID = null where exists (
					select observ_detail.actDetailID from observ_detail 
							where observ_detail.actDetailID = activity_detail.ID) and `atcRecurrID` = '$id'";
		$result = $q->execute($removeEventWithObsevQuery);
		//delete all the events for this ID for re-creation
		$deleteEventsForthisRecurr = "delete from  `activity_detail`  where `atcRecurrID` = '$id'";
		$result = $q->execute($deleteEventsForthisRecurr);
		return $result;
	}
    
    public function actRecurr($dataSet) {
    	$rUser = $this->getUserID();
    	$q = Doctrine_Manager::getInstance()->getCurrentConnection();
		$rruledata = $dataSet['rrule'];
		$actRecurrId = $dataSet['atcRecurrID'];	
		//print_r("atcRecurrID :  " . $actRecurrId);
		if(!empty($actRecurrId)) {
			$result = $q->execute("UPDATE `activity_recurr` set `rRule` = '$rruledata' where `ID` = '$actRecurrId' ");
			return $dataSet;
		} else {
    		//Insert rrule into the table
			$result = $q->execute("INSERT INTO `activity_recurr` (`ID`, `rRule`, `rTime`, `rUser`) VALUES (NULL, '$rruledata', NOW(), $rUser)");
			//Get the last ID from the activity recurrance table 
			$result = $q->execute("SELECT MAX( ID ) FROM `activity_recurr` AS `Last_ID`");
			$result = $result->fetchAll();
			$dataSet['atcRecurrID'] = $result[0][0];
			$actRecurrId = $dataSet['atcRecurrID'];
			//Update activity detail table with the current activity recurrance ID
			$result = $q->execute("UPDATE `activity_detail` SET `rTime` = NOW( ), `rUser` = $rUser, `atcRecurrID` = $actRecurrId  WHERE `activity_detail`.`activityID` = $dataSet[activityID]");
    		return $dataSet;
    	}
    }

    /**
     * @remotable
     * @formHandler
     */
    public function saveForm($a) {
    	$_POST = $this->populateArray($_POST);
		$recordId = $this->getLoadFormID($a);
		//New record with no recurrence route to existing function from parent
		if($this->isExisitingRecord($recordId) == false && (!isset($a['rrule']) || $a['rrule'] == "")){
			// call parent method to update
			return parent::saveForm($a);
		} 

		//Existing record with no rrule 
		if($this->isExisitingRecord($recordId) ==  true && (!isset($a['rrule']) || $a['rrule'] == "")){
			return parent::saveForm($a);
		} 
				
		//Existing record with rrule 
		if($this->isExisitingRecord($recordId) == true && (isset($a['rrule']) || $a['rrule'] != "")){
			$exeResult = $this->removeRecurrences($a['atcRecurrID']);
			if(!$exeResult) {
				//if delete fails
				return array("success" => false);
			}
		}

		$rrule = $this->ical_rrule($a['rrule']);
		$a = $this->actRecurr($a);
    	if (isset($rrule['FREQ'])) {
			 if(!isset($rrule['INTERVAL'])){$rrule['INTERVAL'] = 1;}
				//is this BYDAY weekly with selected dates like MO,TU.
			if (array_key_exists('BYDAY', $rrule)) {
				return $this->processDatesByDay ($rrule);
			} else {
				return $this->processDates($rrule);
			 }
    	}
    }
    
	protected function processDatesByDay ($recurArray) {		
		$startDateStr = str_replace( '.', '/', $_POST['startDate'] . " " . $_POST['startTime'] );
		$start_Date = strtotime($startDateStr);
		$resultData = array();
		if(isset($recurArray['COUNT'])){
			$resultData = $this->getDatesByCount($startDateStr, $recurArray['BYDAY'], $recurArray['COUNT'], $recurArray['INTERVAL']);
		} else {
			$resultData = $this->getDatesByUntil($startDateStr, $recurArray['BYDAY'], $recurArray['UNTIL'], $recurArray['INTERVAL']);
		}
					
		foreach($resultData as $day){
				$tempStartDate = str_replace( '.', '/', date("Y-m-d", strtotime($day)). " " . $_POST['startTime'] );
				$tempEndDate= str_replace( '.', '/', date("Y-m-d", strtotime($day)) . " " . $_POST['endTime'] );
				$_POST['calCstartDate']=date("Y-m-d H:i:s", strtotime($tempStartDate));
				$_POST['actDtlEtime'] = date("Y-m-d H:i:s", strtotime($tempEndDate));
				$this->createActivity($_POST);		
		}

		$this->actRecurr($_POST); 
		return array("success" => true);  	
	}

	protected function processDates($recurArray){
		$now = strtotime("now");
		$now = date('Y-m-d h:i:s', $now);
		$splitDateTime = explode(" ", $now);
		$nowDate = $splitDateTime[0];
		$nowTime = $splitDateTime[1];
		
		$startDate = str_replace( '.', '/', $_POST['startDate'] . " " . $_POST['startTime'] );
		$endDate = str_replace( '.', '/', $_POST['startDate'] . " " . $_POST['endTime'] );
		$start_Date = strtotime($startDate);
		if(isset($recurArray['COUNT'])){
			$netInterVal = ($recurArray['INTERVAL'] * ($recurArray['COUNT'])) -$recurArray['INTERVAL'];
			if($recurArray['FREQ']=="WEEKLY"){
				$end_Date = strtotime($this->getDateFor(date(strtotime($startDate)), true, "DAILY" , $netInterVal*7));
			} else {
				$end_Date = strtotime($this->getDateFor(date(strtotime($startDate)), true, $recurArray['FREQ'] , $netInterVal));
			}
			
		} else {
			$end_Date = strtotime($this->getDateFor(date(strtotime($recurArray['UNTIL'])), true, "DAILY" , 1));
		}

		//now since we got the end date we need to just loop through the start and enddate
		//and add records.
		$t=0;

		while($start_Date < $end_Date){
			$setInterval = $recurArray['INTERVAL'] * ($t);
			$dates = $this->getDateFor(date($start_Date) , true, $recurArray['FREQ'] , $setInterval);
			$newEndDate = date("Y/m/d", $start_Date) . " ". $_POST['endTime'];
			$actDtEtime  = $this->getDateFor(date(strtotime($newEndDate)), true, $recurArray['FREQ'], $setInterval);
			$start_Date = ($recurArray['FREQ']=="WEEKLY") ? strtotime("+". $setInterval + 7 . " day", $start_Date) : strtotime("+". $setInterval." day", $start_Date);
			$t = ($t == 1) ? $t : $t+1;
			$_POST['calCstartDate']=$dates;
			$_POST['actDtlEtime'] = $actDtEtime;
			$this->createActivity($_POST);
		}
			//Insert a record into acitivity recurr table with rrule info
			$this->actRecurr($_POST); 
			return array("success" => true);  	
	}

	protected function getDateFor($curDate, $isForward=true, $freq="DAILY" , $interval=0){
		$hour = date("H", $curDate);
		$mins = date("i", $curDate);
		$secs = date("s", $curDate);
		$month = date("n", $curDate);
		$day = date("j", $curDate);
		$year = date("Y", $curDate);

		switch($freq) {
		case "DAILY":
				$day = ($isForward) ? $day+$interval : $day-$interval;
				break;
		case "WEEKLY":
				$interval = $interval*7;
				$day = ($isForward) ? $day+$interval : $day-$interval;
				break;
		case "MONTHLY":
				$month = ($isForward) ? $month+$interval : $month-$interval;
				break;
		case "YEARLY":
				$year = ($isForward) ? $month+$interval : $month -$interval;
			   break;
		}
		return date("Y-m-d H:i:s", mktime( $hour, $mins, $secs, $month, $day, $year));
	}

	protected function getDatesByCount($startDt, $bydayVal, $count, $interval){
		$resultArray = array();
		//SU,MO,TU,WE,TH,FR,SA
		$days = explode("," , $bydayVal);
		$counter = 0;
		$fsun = $fmon = $ftue = $fwed = $fthu = $ffri = $fsat = 0;
		$startDate = strtotime($startDt);
		while($counter < $count) {
			$curday = strtoupper(substr(date( "D" , $startDate), 0, -1));
			if (in_array($curday, $days)) {
				switch($curday) {
					case "SU" : 
							if(($fsun % $interval) == 0) {
								$resultArray[] = date("Y-m-d H:i:s",$startDate);
							}
							$fsun++; break;
					case "MO" : if(($fmon % $interval) == 0) {
									$resultArray[] = date("Y-m-d H:i:s",$startDate);
								}
								$fmon++; break;
					case "TU" : if(($ftue % $interval) == 0) {
									$resultArray[] = date("Y-m-d H:i:s",$startDate);
								}
								$ftue++; break;
					case "WE" : if(($fwed % $interval) == 0) {
									$resultArray[] = date("Y-m-d H:i:s",$startDate);
								}
								$fwed++; break;
					case "TH" : if(($fthu % $interval) == 0) {
									$resultArray[] = date("Y-m-d H:i:s",$startDate);
								}
								$fthu++; break;
					case "FR" : if(($ffri % $interval) == 0) {
									$resultArray[] = date("Y-m-d H:i:s",$startDate);
								}
								$ffri++; break;
					case "SA" : if(($fsat % $interval) == 0) {
									$resultArray[] = date("Y-m-d H:i:s",$startDate);
								}
								$fsat++; break;
				}
			}
			
			$startDate = strtotime( "+1 day", $startDate);
		    $counter = $counter +1;
		}
		return $resultArray;
	}


	protected function getDatesByUntil($startDt, $bydayVal, $endDt, $interval){
		$startDate = strtotime($startDt);
		$endDate = strtotime($endDt);
		$count = $endDate - $startDate; 
		$count =  round(($endDate - $startDate) / 86400) + 1;  // add 1 to include the start and end days into consideration
		return $this->getDatesByCount($startDt, $bydayVal, $count, $interval);
	}

	protected function applyCustomFilters($query, $data) {
		//get date range for week view
		if (isset($data->startDate) && isset($data->endDate)) {
			$start = date("Y-m-d H:i:s", strtotime($data->startDate));
			$end = date("Y-m-d H:i:s", strtotime($data->endDate));
			$query->where("a.actDtlStime >=  '$start' AND a.actDtlEtime <= '$end'");
		}
    }
    
	protected function deleteThisEvent($id){

    	//delete an event if they do not have any observation
    	$q = Doctrine_Query::create()->select("o.*")
									 ->from("ObservDetail o")
									 ->where('o.actDetailID = ?', $id);
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);			
		if ($result){
			$this->removeRecurrence($id);
			return array(
			'success' => false,
			'msg' => "You can't delete an event with Observation.");
		} else {
			//grab the activity 
			$q = Doctrine_Query::create()->select("a.*")
									 ->from("ActivityDetail a")
									 ->where('a.ID = ?', $id);
									 
			$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
			//insert activity into the activity_archive table for archiving data
			foreach($result as $key => $value){
				  foreach($value as $temp => $v){
					$value[$temp] = (empty($value[$temp])) ? 0 : $value[$temp];
				  }

				$q = Doctrine_Manager::getInstance()->getCurrentConnection();
				$result = $q->execute("INSERT INTO `activity_archive` (
																	`ID` ,
																	`orgID` ,
																	`activityID` ,
																	`locationTypeID` ,
																	`actDtlStime` ,
																	`actDtlDuration` ,
																	`actDtlEtime` ,
																	`numParticipant` ,
																	`numStaff` ,
																	`numVolunteer` ,
																	`noiseIND` ,
																	`hasFriendFamily` ,
																	`hasAnimal` ,
																	`scheduleIND` ,
																	`photoID` ,
																	`notes` ,
																	`isComplete` ,
																	`noiseTypeID` ,
																	`animalTypeID` ,
																	`weatherTypeID` ,
																	`audioID` ,
																	`rTime` ,
																	`rUser`)
				VALUES (NULL , '$value[orgID]', '$value[activityID]', '$value[locationTypeID]', 
				'$value[actDtlStime]', '$value[actDtlDuration]', '$value[actDtlEtime]', '$value[numParticipant]', 
				'$value[numStaff]', '$value[numVolunteer]', '$value[noiseInd]', '$value[hasFriendFamily]', 
				'$value[hasAnimal]', '$value[scheduleInd]', '$value[photoID]', '$value[notes]', '$value[isComplete]', 
				'$value[noiseTypeID]', '$value[animalTypeID]', '$value[weatherTypeID]', '$value[audioID]', NOW( ) , 
				'$value[rUser]')");
			}
			
			//grab the activity 
			$q = Doctrine_Query::create()->select("a.*")
									 ->from("ActivityDetail a")
									 ->where('a.ID = ?', $id);
									 
			$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
				
			//delete the activity from the activity_detail table 
			foreach($result as $key => $value){
				$q = Doctrine_Manager::getInstance()->getCurrentConnection();
				$result = $q->execute("DELETE FROM activity_detail WHERE ID = $id");
			}
			
			return array(
			'success' => true,
			'msg' => "Activity has been deleted.");						 
		}
		
	}

    /**
     * @remotable
     */
    public function deleteEvent($params){
		$params = (array)$params;
		$id = $params['ID'];
		if(array_key_exists("isSeriesDelete" , $params)){
			 //this is a series so we need to delete accordingly.
			 //Get the atcRecurrID from this ID
			$q = Doctrine_Manager::getInstance()->getCurrentConnection();
			$queryExists = "select `atcRecurrID` from `activity_detail` where `ID`=$id";
			$queryResult = $q->execute($queryExists);
			$queryResult = $queryResult->fetchAll();
			if(empty($queryResult)) {
					$result = $this->deleteThisEvent($params['ID']);
			} else {
					$recurID = $queryResult[0]['atcRecurrID'];
					//take all the IDs for this recurrence and delete it one by one.
					$queryIds = "select `ID` from `activity_detail` where `atcRecurrID` = $recurID";
					$queryResult = $q->execute($queryIds);
					$queryResult = $queryResult->fetchAll();
					if(!empty($queryResult)) {
						//print_r($queryResult);

						foreach($queryResult as $value){
							$this->deleteThisEvent($value['ID']);
						}

						return array(
							'success' => true,
							'msg' => "Activities with Observation will not be deleted.");	
					}
			}
		} else {

			$result = $this->deleteThisEvent($id);
		}
		return $result;  	
    }
}	