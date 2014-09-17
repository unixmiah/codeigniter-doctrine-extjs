<?php
class AnimalAPI extends ControllerBase {
	protected $tableName = 'AnimalValue';
	protected $updateOrgId = true;
	protected $updateFields = array('orgID','animalName','description','isActive');
	protected $pageName = 'Animal';
	
	protected function prepareListQuery($q) {
		$q->from("AnimalValue a");
		$q->where("a.isActive = 1 AND orgID = ?", $this->getOrgID());
			
	}
	
	/**
      * @remotable
      */
	public function defaultAnimalSetup(){
		
		//grab the weather values from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
			->from('SystemRef s')
			->where("s.refType = 'animal'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		
		//insert values into the animal table
		foreach ($result as $key => $value){
			//return $key."-".$value['name'];
			
			//insert into animal value table
			$animal = new AnimalValue();
			$animal->orgID = 16;
			$animal->animalName = $value['name'];
			$animal->isActive = 1;
			$animal->rTime = date("d/m/y : H:i:s", time());
			$animal->rUser = $this->getUserID();
			$animal->save();
		}
	}
	
}