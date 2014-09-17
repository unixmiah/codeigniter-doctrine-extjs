<?php
class LocationAPI extends ControllerBase {
	protected $tableName = 'LocationValue';
	protected $updateOrgId = true;
	protected $updateFields = array('orgID','locationName','abbrName', 'isActive', "colorCode");
	protected $pageName = 'Location';
	
	protected function prepareListQuery($q) {
        $q->from("LocationValue l");
        $orgID = $this->getOrgID();
        $q->where("l.isActive = 1 AND orgID = ?", $orgID);
    }
         
	/**
      * @remotable
      */	
	public function defaultLocationSetup(){
		
		//grab the location values from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
			->from('SystemRef s')
			->where("s.refType = 'location'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		
		//insert values into the location table
		foreach ($result as $key => $value){
			//return $key."-".$value['name'];
			
			//insert into location value table
			$location = new LocationValue();
			$location->orgID = 16;
			$location->locationName = $value['name'];
			$location->isActive = 1;
			$location->rTime = date("d/m/y : H:i:s", time());
			$location->rUser = $this->getUserID();
			$location->save();
		}
	}
         
}