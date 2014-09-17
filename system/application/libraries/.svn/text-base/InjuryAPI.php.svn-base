<?php
class InjuryAPI extends ControllerBase {
	protected $tableName = "InjureConditionValue";
	protected $updateOrgId = true;
	protected $updateFields = array("name", "description");
	protected $pageName = "Injury";

	protected function prepareListQuery($q) {
		$q->from("InjureConditionValue i");
		$q->where("orgID = ?", $this->getOrgID());
	}
}