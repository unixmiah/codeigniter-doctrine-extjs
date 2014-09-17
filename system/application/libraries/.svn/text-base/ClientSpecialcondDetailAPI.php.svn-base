<?php
class ClientSpecialcondDetailAPI extends ControllerBase {
	protected $tableName = "ClientSpecialcondDetail";
	protected $updateFields= array("clientID", "recDate", "title", "description");
	protected $listFields = "c.*";
	protected $pageName = "Client";
	protected $updateOrgId = true;

	protected function prepareListQuery($q) {
		$q->from("ClientSpecialcondDetail c");
		$q->where("orgID = ?", $this->getOrgID());
	}

	protected function applyCustomFilters($query, $data) {
		if (isset($data->clientID)) {
			$clientID = $data->clientID;
			$query->where("c.clientID = '$clientID'");
		}
	}
}
