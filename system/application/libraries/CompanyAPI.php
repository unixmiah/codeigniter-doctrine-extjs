<?php
class OrgInfoAPI extends ControllerBase {
	protected $tableName = 'Company';
	protected $listFields = "c.*";
	protected $updateFields = array('name', 'desc', 'address', 'city', 'zip', 'state', 'phone');
	protected $pageName = 'Company';
	protected $blobFields = array('logo');

	protected function prepareListQuery($q) {
		$q->from("Org o");
		$q->where("orgID = ?", $this->getOrgID());
	}
	
	protected function getLoadFormID() {
		return $this->getOrgID();
	}
}