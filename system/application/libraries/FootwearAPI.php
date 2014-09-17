<?php
class FootwearAPI extends ControllerBase {
	protected $tableName = "FootwearValue";
	protected $updateOrgId = true;
	protected $updateFields = array("orgID", "name");
	protected $pageName = "Footwear";

	protected function prepareListQuery($q) {
		$q->from("FootwearValue f");
		$q->where("orgID = ?", $this->getOrgID());
	}
	/**
	 * @remotable
	 */
	public function defaultFootwearSetup(){

		//grab the location values from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
		->from('SystemRef s')
		->where("s.refType = 'footwear'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);

		//insert values into the footwear table
		foreach ($result as $key => $value){
			//return $key."-".$value['name'];
				
			//insert into footwear value table
			$footwear= new FootwearValue();
			$footwear->orgID = 16;
			$footwear->name = $value['name'];
			$footwear->rTime = date("d/m/y : H:i:s", time());
			$footwear->rUser = $this->getUserID();
			$footwear->save();
		}
	}
}