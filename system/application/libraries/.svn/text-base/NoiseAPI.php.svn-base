<?php
class NoiseAPI extends ControllerBase {
	protected $tableName = 'NoiseValue';
	protected $updateFields = array('orgID','noiseName','description','isActive');
	protected $pageName = 'Noise';
	protected $updateOrgId = true;
	
	protected function prepareListQuery($q) {
		$q->from("NoiseValue n");
		$q->where("n.isActive = 1 AND orgID = ?", $this->getOrgID());
	}
	
	/**
      * @remotable
      */	
	public function defaultNoiseSetup(){
		
		//grab the location values from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
			->from('SystemRef s')
			->where("s.refType = 'noise'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		
		//insert values into the noise table
		foreach ($result as $key => $value){
			//return $key."-".$value['name'];
			
			//insert into noise value table
			$noise = new NoiseValue();
			$noise->orgID = 16;
			$noise->noiseName = $value['name'];
			$noise->isActive = 1;
			$noise->rTime = date("d/m/y : H:i:s", time());
			$noise->rUser = $this->getUserID();
			$noise->save();
		}
	}
	
}
