<?php
class IncidentBodypartAPI extends ControllerBase {
	protected $tableName = "IncidentBodypartDetail";
	protected $updateOrgId = true;
	protected $updateFields = array("incidentDetailID","bodyPartID","injureConditionID");
	protected $listFields = "i.*, bodyParts.name bodyPart, injureCondition.name injureCondition";
	protected $pageName = "Incident";

	protected function prepareListQuery($q) {
		$q->from("IncidentBodypartDetail i, i.BodyPartValue bodyParts, i.InjureConditionValue injureCondition");
		$q->where("orgID = ?", $this->getOrgID());
	}

	protected function applyCustomFilters($query, $data) {
		if (isset($data->incidentDetailID)) {
			$query->where("incidentDetailID = ?", $data->incidentDetailID);
		}
    }
}