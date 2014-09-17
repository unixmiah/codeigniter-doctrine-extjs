<?php
class AidAPI extends ControllerBase {
	protected $tableName = "AidDetail";
	protected $updateOrgId = true;
	protected $updateFields = array("orgID", "clientID", "incidentID", "name");
	protected $pageName = "Aids";

	protected function prepareListQuery($q) {
		$q->from("AidDetail a");
		$q->where("orgID = ?", $this->getOrgID());
	}
	/**
	 * @remotable
	 */
	public function defaultAidSetup(){

		//grab the weather values from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
		->from('SystemRef s')
		->where("s.refType = 'aid'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);

		//insert values into the activity table
		foreach ($result as $key => $value){
			//return $key."-".$value['name'];
				
			//insert into activitiy value table
			$aid = new AidDetail();
			$aid->orgID = 16;
			$aid->name = $value['name'];
			$aid->rTime = date("d/m/y : H:i:s", time());
			$aid->rUser = $this->getUserID();
			$aid->save();
		}
	}
	 
}
