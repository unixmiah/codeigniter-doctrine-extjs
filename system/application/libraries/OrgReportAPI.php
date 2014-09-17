<?php

class OrgReportAPI extends ControllerBase {
	protected $tableName = "User";
	protected $listFields= "u.*";
	protected $updateOrgId = true;
	protected $pageName = 'OrgReport';
	
	
	
protected function prepareListQuery($q) {
        $q->from("User u");
		$q->where("orgID = ?", $this->getOrgID());
    }
	
}