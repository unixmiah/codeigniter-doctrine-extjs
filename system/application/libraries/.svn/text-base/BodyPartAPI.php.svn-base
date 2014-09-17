<?php
class BodyPartAPI extends ControllerBase {
	protected $tableName = "BodyPartValue";
	protected $updateOrgId = true;
	protected $updateFields = array("orgID", "name", "description");
	protected $pageName = "BodyPart";

	protected function prepareListQuery($q) {
		 
		$q->from("BodyPartValue b");
		$q->where("orgID = ?", $this->getOrgID());
	}
	/**
      * @remotable
      */
public function defaultBodyPartSetup(){
		
		//grab the weather values from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
			->from('SystemRef s')
			->where("s.refType = 'bodypart'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		
		//insert values into the bodypart table
		foreach ($result as $key => $value){
			//return $key."-".$value['name'];
			
			//insert into bodypart value table
			$bodypart = new BodyPartValue();
			$bodypart->orgID = 16;
			$bodypart->name = $value['name'];
			$bodypart->rTime = date("d/m/y : H:i:s", time());
			$bodypart->rUser = $this->getUserID();
			$bodypart->save();
		}
	}
}