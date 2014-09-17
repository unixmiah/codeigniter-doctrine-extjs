<?php
class WeatherAPI extends ControllerBase {
	protected $tableName = 'WeatherValue';
	protected $updateFields = array('orgID','weatherName','description','isActive');
	protected $pageName = 'Weather';
	protected $updateOrgId = true;	
	
	protected function prepareListQuery($q) {
        $q->from("WeatherValue w");
        $q->where("w.isActive = 1 and orgID = ?", $this->getOrgID());
    }
         
	public function defaultWeatherSetup(){
		
		//grab the weather values from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
			->from('SystemRef s')
			->where("s.refType = 'weather'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		
		//insert values into the activity table
		foreach ($result as $key => $value){
			//return $key."-".$value['name'];
			
			//insert into activitiy value table
			$weather = new WeatherValue();
			$weather->orgID = 16;
			$weather->weatherName = $value['name'];
			$weather->isActive = 1;
			$weather->rTime = date("d/m/y : H:i:s", time());
			$weather->rUser = $this->getUserID();
			$weather->save();
		}
	}
         
}