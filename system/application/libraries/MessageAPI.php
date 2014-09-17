<?php

class MessageAPI extends ControllerBase {
	protected $tableName = 'message';
	protected $updateFields = array("orgID", "subject", "message", "mfrom", "mto", "expireDate");
	protected $listFields = "m.*";
	
	protected function prepareListQuery($q) {
		$dateToday 	= date("Y-m-d");
        $q->from("message m");
        $orgID = $this->getOrgID();
        $userID = $this->getUserID();
        $q->where("m.expireDate >= ?", $dateToday);
        $q->andWhere("m.orgID = ?", $orgID);
        $q->andWhere("(m.mto = ? OR m.mto = '')", $userID );
    }
    
    /**
    * @remotable
    * @formHandler
    */
   	public function saveForm($a) {
		$a['orgID'] = $this->getOrgID();
		$a['mfrom'] = $this->getUserName();
		return parent::saveForm($a);
	}
}

