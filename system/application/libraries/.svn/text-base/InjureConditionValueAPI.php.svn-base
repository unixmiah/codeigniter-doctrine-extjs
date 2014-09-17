<?php
class InjureConditionValueAPI extends ControllerBase {
	protected $tableName = "InjureConditionValue";
	protected $updateOrgId = true;
	protected $updateFields = array("name","description");
	protected $pageName = "Incident";

	protected function prepareListQuery($q) {
		$q->from("InjureConditionValue i");
		/*$orgID = $this->getOrgID();
		$q->where("orgID = $orgID");*/
	}
}