<?php

class IncidentAPI extends ControllerBase {
	protected $tableName = 'IncidentDetail';
	protected $updateOrgId = true;
	protected $pageName = 'Incident';
	protected $listFields = "i.*, a.name as IncidentActivityName, f.name as footwearName, ic.name as incidentCauseName, c.firstName as clientFirstName, c.lastName as clientLastName, l.locationName as locationName, cv.firstName as witnessFirstName, cv.lastName as witnessLastName, notifyParty.name notifyPartyName";
	protected $updateFields = array("clientID", "incidentTime", "locationID", "witnessInd", "witnessUserID", "incidentActivityID", "incidentCauseID", "footwearID", "note", "isinER", "notifyPartyID", "isHospitalized");

	protected function prepareListQuery($q) {
		$q->from("IncidentDetail i, i.IncidentActivityValue a, i.FootwearValue f, i.IncidentCauseValue ic, i.Client c, i.LocationValue l, i.ContactValue cv, i.SystemRef notifyParty");
		$q->where("orgID = ?", $this->getOrgID());
	}
	
	/**
	  * @remotable
	  * @formHandler
	  */
	public function saveForm($a) {
		//$this->setupOneToOne($a);

		$a["incidentSplitDate"] = date("Y-m-d", strtotime($a["incidentSplitDate"]));
		$date = strtotime($a["incidentSplitDate"]." ".$a["incidentSplitTime"]);
		$a["incidentTime"] = date("Y-m-d H:i:s", $date);
		$return = parent::saveForm($a);
		if(isset($return['data'])) {
			$data = $return["data"];
		
			$ts = strtotime($data["incidentTime"]);
			$data["incidentSplitDate"] = date("Y-m-d", $ts);
			$data["incidentSplitTime"] = date("g:ia", $ts);
		
			$return["data"] = $data;
		}
		return $return;
	}
	
	/**
     * @remotable
     */
	public function loadForm($params){
		//$this->setupOneToOne($params);
		$return = parent::loadForm($params);
		$data = $return["data"];
		$ts = strtotime($data["incidentTime"]);
		$data["incidentSplitDate"] = date("Y-m-d", $ts);
		$data["incidentSplitTime"] = date("g:ia", $ts);
		$return["data"] = $data;
		return $return;
	}

	public function setupOneToOne($a) {
		if(isset($a['isMobile'])) {
			$this->$oneToMany = array(
				'aidID' => array('tableName' => 'AidDetail', 'col' => 'name')
			);
		}
	}
}
