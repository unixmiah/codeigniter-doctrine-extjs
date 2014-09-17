<?php
class PhysicianContactAPI extends ControllerBase {
	protected $tableName = "PhysicianContact";
	protected $updateOrgId = true;
	protected $listFields = "p.*";
	protected $updateFields = array('firstName', 'lastName', "company", "address1", "address2", "city", "zip", "state", 'phoneNumber', 'cellNumber', 'email');
	protected $pageName = "Client";
	
	protected function prepareListQuery($q) {
		$q->from("PhysicianContact p");
		$q->where("orgID = ?", $this->getOrgID());
	}
}