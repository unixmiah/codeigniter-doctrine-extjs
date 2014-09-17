<?php

class ActivityAPI extends ControllerBase {
	protected $tableName = 'ActivityValue';
	protected $updateFields = array('orgID', 'activityName', 'description', 'abbrName', 'dimensionID', 'isActive');
	protected $listFields = "a.*, d.dimensionName as dimensionName";
	protected $pageName= 'Activity';
	protected $updateOrgId = true;

	
	protected function prepareListQuery($q) {
        $q->from("ActivityValue a, a.DimensionValue d");
        $orgID = $this->getOrgID();
        $q->where("orgID = ?", $orgID);
    }
    
	public function defaultActivitySetup(){
		
		//grab the location values from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
			->from('SystemRef s')
			->where("s.refType = 'activity'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		
		//insert values into the activity table
		foreach ($result as $key => $value){
			//return $key."-".$value['name'];
			
			//insert into activitiy value table
			$activity = new ActivityValue();
			$activity->orgID = 16;
			$activity->activityName = $value['name'];
			$activity->isActive = 1;
			$activity->rTime = date("d/m/y : H:i:s", time());
			$activity->rUser = $this->getUserID();
			$activity->save();
		}
	}
}

