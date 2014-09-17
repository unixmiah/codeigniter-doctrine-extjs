<?php
class OrgInfoAPI extends ControllerBase {
	protected $tableName = 'Org';
	protected $listFields = "o.*";
	protected $updateFields = array('orgName', 'orgDesc', 'address', 'city', 'zip', 'state', 'phone', 'orgType', 'logo', 'orgTwitterName', 'rUser');
	protected $pageName = 'OrgInfo';
	protected $blobFields = array('logo');

	protected function prepareListQuery($q) {
		$q->from("Org o");
		$q->where("orgID = ?", $this->getOrgID());
	}
	
	protected function getLoadFormID() {
		return $this->getOrgID();
	}
/*protected function getLoadFormID($params) {
      	$q = Doctrine_Query::create()->select('ID')->from($this->tableName)->where('ID = ?', $this->getOrgID());
      	
		$data = $q->fetchOne();
		return $data == null ? 0 : $data->ID;			
	}*/
	/**
	 * @remotable
	 */
	public function getTwitterUsername($param){
		$orgID = $this->getOrgID();
		$q = Doctrine_Query::create()->select('o.orgTwitterName')
		->from('Org o')
		->where("o.ID='".$orgID."'");

		$q->execute();
		return $q->execute(array(), Doctrine::HYDRATE_ARRAY);
	}

}