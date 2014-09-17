<?php
class EmergencyContactAPI extends ControllerBase {
	protected $tableName = "EmergencyContact";
	protected $updateOrgId = true;
	protected $listFields = "e.*";
	protected $updateFields = array('firstName', 'lastName', "address1", "address2", "city", "zip", "state", 'phoneNumber', 'cellNumber', 'email', "relation", "contactOrder");
	protected $pageName = "Client";
	

	 protected function prepareListQuery($q) {
	 	$q->from("EmergencyContact e");
		$q->where("orgID = ?", $this->getOrgID());
	 }
}