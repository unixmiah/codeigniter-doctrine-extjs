<?php
class ClientAPI extends ControllerBase {
	protected $tableName = 'Client';
	protected $pageName = 'Client';
	protected $updateOrgId = true;
	protected $listFields = "c.*,
				p.firstName as PhysicianfirstName, p.lastName as PhysicianlastName, p.company as Physiciancompany,
					p.address1 as Physicianaddress1, p.address2 as Physicianaddress2, p.city as Physiciancity,
					p.zip as Physicianzip, p.state as Physicianstate, p.phoneNumber as PhysicianphoneNumber,
					p.cellNumber as PhysiciancellNumber, p.email as Physicianemail,
				fe.firstName as firstEcontactfirstName, fe.lastName as firstEcontactlastName, fe.relation as firstEcontactrelation,
					fe.address1 as firstEcontactaddress1, fe.address2 as firstEcontactaddress2, fe.city as firstEcontactcity,
					fe.zip as firstEcontactzip, fe.state as firstEcontactstate, fe.phoneNumber as firstEcontactphoneNumber,
					fe.cellNumber as firstEcontactcellNumber, fe.email as firstEcontactemail,
				se.firstName as secondEcontactfirstName, se.lastName as secondEcontactlastName, se.relation as secondEcontactrelation,
					se.address1 as secondEcontactaddress1, se.address2 as secondEcontactaddress2, se.city as secondEcontactcity,
					se.zip as secondEcontactzip, se.state as secondEcontactstate, se.phoneNumber as secondEcontactphoneNumber,
					se.cellNumber as secondEcontactcellNumber, se.email as secondEcontactemail, CONCAT_WS(', ', c.lastName, c.firstName) fullName";
					
	protected $updateFields = array('firstName', 'lastName', 'nickName', 'roomDesc', 'chkInDate', 'picID', 'gender',
									'birthDate', 'firstEContactID', 'secondEContactID', 'physicianContactID', 'assessDate',
									'hasAssessment', 'inactiveDate', 'hasSpecialCondInd', 'hasAllergyInd', 'characters',
									'familyHistory', 'education', 'workHistory', 'talentInterest', 'likeDislike', 'socialRelated','selfPic'
	);
	protected $blobFields = array('selfPic');

	protected $oneToOne = array(
		'physicianContactID' => array(
			'tableName' => 'PhysicianContact',
			'updateFields' =>array( 'orgID', 'firstName', 'lastName', 'company', 'address1', 'address2', 'city', 'zip', 'state', 'phoneNumber', 'cellNumber', 'email'),
			'flatten'=> 'Physician'
		),
		'firstEContactID' => array(
			'tableName' => 'EmergencyContact',
			'updateFields' =>array( 'orgID','firstName','lastName', 'address1', 'address2', 'city', 'zip', 'state', 'phoneNumber', 'cellNumber', 'email', 'relation', 'contactOrder'),
			'flatten'=> 'firstEcontact'
		),
		'secondEContactID' => array(
			'tableName' => 'EmergencyContact',
			'updateFields' =>array( 'orgID','firstName','lastName', 'address1', 'address2', 'city', 'zip', 'state', 'phoneNumber', 'cellNumber', 'email', 'relation', 'contactOrder'),
			'flatten'=> 'secondEcontact'
		)
	);
	

	protected function prepareListQuery($q) {
		$q->from("Client c, c.PhysicianContact p, c.EmergencyContact fe, c.EmergencyContact_3 se");
		$q->andWhere("orgID = ?", $this->getOrgID());
		$q->andWhere("(inactiveDate >= ? OR inactiveDate IS NULL)", date("Y-m-d", time()));
	}
	
	//protected function getLoadFormID() {	
	//	return $this->getUserID();
	//}
	
	/**
	  * @remotable
	  */
	public function listAll($a) {
		$return = parent::listAll($a);
		if (!isset($return["items"])) {
			return $return;
		}
		$items = $return["items"];
		for ($i = 0; $i < count($items); $i++) {
			$items[$i]["genderName"] = ($items[$i]["gender"] == 1) ? "male" : "female";
			$items[$i]["age"] = $this->calculateAge($items[$i]["birthDate"]);
		}
		$return["items"] = $items;
		return $return;
	}
	
    /**
     * @remotable
     * @formHandler
     */	
	protected function  calculateAge($birthDate) {
	  	if ($birthDate == "00-00-0000" OR "NULL" OR ""){
	    	return "0";
	  	} else {
		   $now = date("U");
		   $bday = strtotime($birthDate);
		   $diff = $now - $bday;
		   $age = floor($diff / 31536000); //31536000 = num seconds in a year
		   return $age;
	    } 
    }
	
}
