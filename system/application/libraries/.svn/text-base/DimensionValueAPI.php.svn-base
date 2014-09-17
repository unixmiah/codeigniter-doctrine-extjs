<?php

class DimensionValueAPI extends ControllerBase {
	protected $tableName = 'DimensionValue';
	protected $updateFields = array("orgID", "dimensionName", "isActive", "colorCode");
	protected $listFields = "d.*";
	protected $pageName = "Dimension";
	
	protected function prepareListQuery($q) {
        $q->from("DimensionValue d");
		$orgID = $this->getOrgID();
        $q->where("d.orgID = ? AND d.isActive = 1", $orgID);
    }
    
	public function defaultDimensionSetup(){
		
		//grab the weather values from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
			->from('SystemRef s')
			->where("s.refType = 'dimension'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		
		//insert values into the activity table
		foreach ($result as $key => $value){
			//return $key."-".$value['name'];
			
			//insert into activitiy value table
			$dimension = new DimensionValue();
			$dimension->orgID = 16;
			$dimension->dimensionName = $value['dimensionName'];
			$dimension->colorCode = $value['colorCode'];
			$dimension->isActive = 1;
			$dimension->rTime = date("d/m/y : H:i:s", time());
			$dimension->rUser = $this->getUserID();
			$dimension->save();
		}
	}
	
}