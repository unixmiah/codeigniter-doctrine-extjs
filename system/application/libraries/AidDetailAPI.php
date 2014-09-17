<?php
class AidDetailAPI extends ControllerBase {
	protected $tableName = "AidDetail";
	protected $updateFields = array("clientID", "incidentID", "name");
	protected $listFields = "a.*";
	protected $pageName = "Client";
	protected $updateOrgId = true;
	
	protected function prepareListQuery($q) {
		$q->from("AidDetail a");
		$q->where("orgID = ?", $this->getOrgID());
	}
	
	protected function applyCustomFilters($query, $data) {
		if (isset($data->clientID)) {
			$query->where("a.clientID = ?", $data->clientID);
		}
		if (isset($data->incidentID)) {
			$query->where("a.incidentID = ?", $data->incidentID);
		}
    }
}
?>