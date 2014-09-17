<?php
class IncidentActivityAPI extends ControllerBase {
	protected $tableName = "IncidentActivityValue";
	protected $updateOrgId = true;
	protected $updateFields = array("orgID", "name");
	protected $pageName = "IncidentActivity";

	protected function prepareListQuery($q) {
		$q->from("IncidentActivityValue i");
		$q->where("orgID = ?", $this->getOrgID());
	}
}