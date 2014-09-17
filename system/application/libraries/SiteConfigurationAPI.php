<?php

class SiteConfigurationAPI extends ControllerBase {
	protected $tableName = 'SiteSpecificValue';
	protected $updateFields = array("clientTerm", "nameDisplay", "preferenceInd");
	protected $listFields = "s.*";
	protected $pageName = 'SiteConfiguration';
	protected $keyField = "orgID";
	protected $updateOrgId = true;
	
	protected function prepareListQuery($q) {
		$q->from("SiteSpecificValue s");
		$q->where("orgID = ?", $this->getOrgID());
	}
	
	protected function getLoadFormID($params) {
		return $this->getOrgID();
	}
	
	/**
	  * @remotable
	  * @formHandler
	  */
	public function saveForm($a) {
		$return = parent::saveForm($a);
		if (isset($a["colorCode"])) {
			$user = $this->getSessionValue("contactID");
			$q = Doctrine_Query::create()
				->update("ContactValue c")
				->set("c.colorCode", "?", $a["colorCode"])
				->where("c.ID = ?", $user);
			$q->execute();
			$return["data"]["colorCode"] = $a["colorCode"];
		}
		return $return;
	}
	
	/**
	  * @remotable
	  */
	public function listAll($a) {
		$return = parent::listAll($a);
		if (!isset($return["items"])) {
			return $return;
		}
		$items = $return["items"];
		
		$user = $this->getSessionValue("contactID");
		
		for ($i = 0; $i < count($items); $i++) {
			$items[$i]["colorCode"] = $this->getUserColorCode($user);
		}
		$return["items"] = $items;
		return $return;
	}
	
	protected function getUserColorCode($id) {
		$q = Doctrine_Query::create()->select('c.colorCode')->from("ContactValue c");
		$q->where('c.ID = ?', $id);
		$data = $q->fetchOne();
		
		$colorCode = $data->colorCode;
		
		if ($colorCode == "") {
			$colorCode = "FA7166";
		}
		
		return $colorCode;
	}
}