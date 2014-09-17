<?php

class RedFlagAPI extends ControllerBase {
	protected $tableName = 'RedFlagValue';
	protected $updateFields = array("scoreType", "scoreValue", "duration", "unit");
	protected $listFields = "r.*";
	protected $updateOrgId = true;
	protected $pageName = "RedFlag";
	
	protected function prepareListQuery($q) {
        $q->from("RedFlagValue r");
		$q->where("orgID = ?", $this->getOrgID());
    }
    
	protected function getLoadFormID($params) {
      	$q = Doctrine_Query::create()->select('ID')->from($this->tableName)->where('orgID = ?', $this->getOrgID());
		$data = $q->fetchOne();
		return $data == null ? 0 : $data->ID;			
	}

    protected function fetchChildren($obj, $returnValue) {
		$returnValue = parent::fetchChildren($obj, $returnValue);

      	$q = Doctrine_Query::create()->select('ID')->from('ContactValue')->where('orgID = ?', $this->getOrgID())->andWhere('isRedFlag = 1');
		$temp = $q->execute(array(), Doctrine::HYDRATE_NONE);
		$redFlags = array();
		foreach($temp as $id) {
			$redFlags[] = $id[0];
		}
		$returnValue['staffList'] = implode(',', $redFlags);
		return $returnValue;
	}

	
	/**
     * @remotable
     * @formHandler
     */
    public function saveForm($a) {
		//capture the param 'staffList' and loop through the array of IDs
		//echo $a['staffList'];
		
    	if(strlen($a['staffList'] > 0)) {
    		$orgID = $this->getOrgID();	
			$staff = $a['staffList'];
			
				$q = Doctrine_Manager::getInstance()->getCurrentConnection();
				$query = "UPDATE contact_value SET 
							isRedFlag =  CASE 
									When id in ($staff)  
										 THEN  1  
									Else 0
									end
						 WHERE orgID=$orgID";
				
				$result = $q->execute($query);
				
				//$q = Doctrine_Manager::getInstance()->getCurrentConnection();
				//$query = "UPDATE `contact_value` SET `isRedFlag` = '0' WHERE `orgID` = $orgID;";
				//$result = $q->execute($query);
				//$query = "UPDATE `contact_value` SET `isRedFlag` = '1' WHERE (`contact_value`.`ID` IN ($staff) AND `orgID` = $orgID);";
				//$result = $q->execute($query);

				//$q = Doctrine_Query::create()
    			//->update('ContactValue')
    			//->set('isRedFlag', 0)
    			//->where('ID NOT IN (' . $a['staffList'] . ')')
    			//->andWhere('orgID = '.$orgID.'');
    			//$q->execute();

			//echo $q->getSqlQuery();
    	}
        return parent::saveForm($a);
        
    }
}