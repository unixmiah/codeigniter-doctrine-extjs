<?php
class IncidentCauseAPI extends ControllerBase {
	protected $tableName = "IncidentCauseValue";
	protected $updateOrgId = true;
	protected $updateFields = array("orgID", "name", "description");
	protected $pageName = "IncidentCause";

	protected function prepareListQuery($q) {
		$q->from("IncidentCauseValue i");
		$q->where("orgID = ?", $this->getOrgID());
	}
}