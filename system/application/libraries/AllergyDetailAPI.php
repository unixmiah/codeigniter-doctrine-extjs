<?php
class AllergyDetailAPI extends ControllerBase {
	protected $tableName = "AllergyDetail";
	protected $updateFields = array("clientID", "allergyName");
	protected $listFields = "a.*";
	protected $pageName = "Client";
	protected $updateOrgId = true;
	
	protected function prepareListQuery($q) {
		$q->from("AllergyDetail a");
		$q->where("orgID = ?", $this->getOrgID());
	}
	
	protected function applyCustomFilters($query, $data) {
		if (isset($data->clientID)) {
			$clientID = $data->clientID;
			$query->where("a.clientID = '$clientID'");
		}
    }
}
?>