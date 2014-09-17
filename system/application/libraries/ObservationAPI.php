<?php
class ObservationAPI extends ControllerBase {
	protected $tableName = 'ObservDetail';
	protected $listFields = "o.*, client.firstName clientFirstName, client.lastName clientLastName, pDimensions.dimensionName pDimensionName, sDimensions.dimensionName sDimensionName";
	protected $updateFields = array("clientID", "actDetailID", 'scrBest', 'scrWorst', 'scrMost', "pDimensionID", "sDimensionID", "participationLevel", "clientNotes", "notes");
	protected $pageName = 'Observation';
	protected $updateOrgId = true;
	
	protected function prepareListQuery($q, $dateNeeded) {
        $q->from("ObservDetail o, o.Client client, o.DimensionValue pDimensions, o.DimensionValue_4 sDimensions");
		$q->where("o.orgID = ?", $this->getOrgID());
    }
	
	protected function applyCustomFilters($query, $data) {
		if (isset($data->actDetailID)) {
			$query->where("o.actDetailID = ?", $data->actDetailID);
		}
    }
    


    /**
      * @remotable
      */
    public function listAll($a) {

    	if (isset($a->dateNeeded)){
    		$dateNeeded = $a->dateNeeded;
    	} else {
    		$dateNeeded = "null";
    	}

    	if ($this->getSessionValue('isDesktop') == 1){
    		$prev = parent::listAll($a);
		return $prev;
    	}else {
    		if($dateNeeded == "null"){

    			//Current date
    			$currentDate = date("Y-m-d");
    			//Get week range from given date
    			$weekRange = $this->getWeekRange($currentDate, $start=true);
    			$weekRange = explode("|", $weekRange);
    			$startDate = $weekRange[0];
    			$endDate   = $weekRange[1];


    		}else{

    			//Current date
    			$dateNeeded = explode("T", $dateNeeded);
    			//Get week range from given date
    			$currentDate = $dateNeeded[0];

    			//Get week range from given date
    			$weekRange = $this->getWeekRange($currentDate, $start=true);
    			$weekRange = explode("|", $weekRange);
    			$startDate = $weekRange[0];
    			$endDate   = $weekRange[1];

    		}

    		$orgID = $this->getOrgID();

    		$query = "SELECT * FROM observ_detail AS obs
		WHERE obs.actDetailID IN
        (SELECT id FROM activity_detail where
          actDtlStime >= '$startDate' and
          actDtlEtime <= '$endDate' and orgId= $orgID
        )";

    		$q = Doctrine_Manager::getInstance()->getCurrentConnection();
    		$result = $q->execute($query);
    		$result = $result->fetchAll();


    		$total = sizeof($result);

    		$newRes = array();

    		foreach($result as $key => $value){
    			$newRes[] = $value;
    		}


    		$this->response['total'] = $total;
    		$this->response['success'] = true;
    		if($this->response['total'] > 0) {
    			$this->response['items'] = $newRes;
    		}else{
    			$this->response['items'] = array();
    		}
    		return $this->response;
    	}
    }
}
