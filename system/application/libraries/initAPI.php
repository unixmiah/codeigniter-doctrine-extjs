<?php
  /**
   * @name         initAPI
   * @since        2/3/2011
   * @todo
   * @version     1.0.1
   */

class initAPI extends ControllerBase {

	
	public function noise(){
		//grab the noise values from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
			->from('SystemRef s')
			->where("s.refType = 'noise'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		
		
		//Check for existing record
		$q2 = Doctrine_Query::create()->select('n.orgID')
			->from('NoiseValue n')
			->where("n.orgID = ?", $this->getOrgID());
		$q2->execute();
		
		if ($result2 = $q2->execute(array(), Doctrine::HYDRATE_ARRAY)) {
			
		} else {
			//insert values into the noise table
			foreach ($result as $key => $value){
				//return $key."-".$value['name'];
				
				//insert into noise value table
				$noise = new NoiseValue();
				$noise->orgID = $this->getOrgID();
				$noise->noiseName = $value['name'];
				$noise->isActive = 1;
				$noise->rTime = $this->getDateFormat();
				$noise->rUser = $this->getUserID();
				$noise->save();
			}
			 
		}		
	}
	
	
	public function location(){
		//grab the location values from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
			->from('SystemRef s')
			->where("s.refType = 'location'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		
		
		//Check for existing record
		$q2 = Doctrine_Query::create()->select('l.orgID')
			->from('LocationValue l')
			->where("l.orgID = ?", $this->getOrgID());
		$q2->execute();
		
		if ($result2 = $q2->execute(array(), Doctrine::HYDRATE_ARRAY)) {
			 
		} else {
			//insert values into the location table
			foreach ($result as $key => $value){
				//return $key."-".$value['name'];
				
				//insert into location value table
				$location = new LocationValue();
				$location->orgID = $this->getOrgID();
				$location->locationName = $value['name'];
				$location->isActive = 1;
				$location->rTime = $this->getDateFormat();
				$location->rUser = $this->getUserID();
				$location->save();
			}
			
			
		}
	}
	
	public function activity(){
		//grab the activity values from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
			->from('SystemRef s')
			->where("s.refType = 'activity'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		
		//Check for existing record
		$q2 = Doctrine_Query::create()->select('a.orgID')
			->from('ActivityValue a')
			->where("a.orgID = ?", $this->getOrgID());
		$q2->execute();
		
		if ($result2 = $q2->execute(array(), Doctrine::HYDRATE_ARRAY)) {
			 
		} else {
		
			//insert values into the activity table
			foreach ($result as $key => $value){
				//return $key."-".$value['name'];
				
				//insert into activitiy value table
				$activity = new ActivityValue();
				$activity->orgID = $this->getOrgID();
				$activity->activityName = $value['name'];
				$activity->isActive = 1;
				$activity->rTime = $this->getDateFormat();
				$activity->rUser = $this->getUserID();
				$activity->save();
			}
		}
	}
	
	

	public function weather(){
		//grab the weather values from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
			->from('SystemRef s')
			->where("s.refType = 'weather'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		
		//Check for existing record
		$q2 = Doctrine_Query::create()->select('w.orgID')
			->from('WeatherValue w')
			->where("w.orgID = ?", $this->getOrgID());
		$q2->execute();
		
		if ($result2 = $q2->execute(array(), Doctrine::HYDRATE_ARRAY)) {

		} else {
		
		
			//insert values into the activity table
			foreach ($result as $key => $value){
				//return $key."-".$value['name'];
				
				//insert into activitiy value table
				$weather = new WeatherValue();
				$weather->orgID = $this->getOrgID();
				$weather->weatherName = $value['name'];
				$weather->isActive = 1;
				$weather->rTime = $this->getDateFormat();
				$weather->rUser = $this->getUserID();
				$weather->save();
			}
							
		}	
	}
	
	
	
	public function animal(){
		//grab the animal values from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
			->from('SystemRef s')
			->where("s.refType = 'animal'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		
		
		//Check for existing record
		$q2 = Doctrine_Query::create()->select('a.orgID')
			->from('AnimalValue a')
			->where("a.orgID = ?", $this->getOrgID());
		$q2->execute();
		
		if ($result2 = $q2->execute(array(), Doctrine::HYDRATE_ARRAY)) {
			
		} else {
				
			//insert values into the animal table
			foreach ($result as $key => $value){
				//return $key."-".$value['name'];
				
				//insert into animal value table
				$animal = new AnimalValue();
				$animal->orgID = $this->getOrgID();
				$animal->animalName = $value['name'];
				$animal->isActive = 1;
				$animal->rTime = $this->getDateFormat();
				$animal->rUser = $this->getUserID();
				$animal->save();
			}
				
		}		
	}
	
	
	public function bodypart(){
		//grab the $bodypart values from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
			->from('SystemRef s')
			->where("s.refType = 'bodypart'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		
		
		//Check for existing record
		$q2 = Doctrine_Query::create()->select('b.orgID')
			->from('BodyPartValue b')
			->where("b.orgID = ?", $this->getOrgID());
		$q2->execute();
		
		if ($result2 = $q2->execute(array(), Doctrine::HYDRATE_ARRAY)) {
			
		} else {
		
			//insert values into the $bodypart table
			foreach ($result as $key => $value){
				//return $key."-".$value['name'];
				
				//insert into $bodypart value table
				$bodypart = new BodyPartValue();
				$bodypart->name = $value['name'];
				$bodypart->rTime = $this->getDateFormat();
				$bodypart->rUser = $this->getUserID();
				$bodypart->orgID = $this->getOrgID();
				$bodypart->save();
			}
				
		}
	}
	
	
	

	public function injurecondition(){
		//grab the $injurecondition values from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
			->from('SystemRef s')
			->where("s.refType = 'injurecondition'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		
		//Check for existing record
		$q2 = Doctrine_Query::create()->select('i.orgID')
			->from('InjureConditionValue i')
			->where("i.orgID = ?", $this->getOrgID());
		$q2->execute();
		
		if ($result2 = $q2->execute(array(), Doctrine::HYDRATE_ARRAY)) {
			 
		} else {
		
		
			//insert values into the $injurecondition table
			foreach ($result as $key => $value){
				//return $key."-".$value['name'];
				
				//insert into $injurecondition value table
				$injurecondition = new InjureConditionValue();
				$injurecondition->name = $value['name'];
				$injurecondition->rTime = $this->getDateFormat();
				$injurecondition->rUser = $this->getUserID();
				$injurecondition->orgID = $this->getOrgID();
				$injurecondition->save();
			}
							
		}
	}
	
	
	
	public function footwear(){
		//grab the $footwear values from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
			->from('SystemRef s')
			->where("s.refType = 'footwear'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		
		//Check for existing record
		$q2 = Doctrine_Query::create()->select('f.orgID')
			->from('FootwearValue f')
			->where("f.orgID = ?", $this->getOrgID());
		$q2->execute();
		
		if ($result2 = $q2->execute(array(), Doctrine::HYDRATE_ARRAY)) {
		
		} else {
				
			//insert values into the $footwear table
			foreach ($result as $key => $value){
				//return $key."-".$value['name'];
				
				//insert into $footwear value table
				$footwear = new FootwearValue();
				$footwear->name = $value['name'];
				$footwear->rTime = $this->getDateFormat();
				$footwear->rUser = $this->getUserID();
				$footwear->orgID = $this->getOrgID();
				$footwear->save();
			}
						
		}
	}
	
	

	public function incident(){
		//grab the $incident values from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
			->from('SystemRef s')
			->where("s.refType = 'incidentactivity'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		
		//Check for existing record
		$q2 = Doctrine_Query::create()->select('i.orgID')
			->from('IncidentActivityValue i')
			->where("i.orgID = ?", $this->getOrgID());
		$q2->execute();
		
		if ($result2 = $q2->execute(array(), Doctrine::HYDRATE_ARRAY)) {
			 
		} else {		
		
			//insert values into the $incident table
			foreach ($result as $key => $value){
				//return $key."-".$value['name'];
				
				//insert into $incident value table
				$incident = new IncidentActivityValue();
				$incident->name = $value['name'];
				$incident->rTime = $this->getDateFormat();
				$incident->rUser = $this->getUserID();
				$incident->orgID = $this->getOrgID();
				$incident->save();
			}
							
		}
	}
	
			
	public function incidentCause(){
		//grab the $incidentCause values from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
			->from('SystemRef s')
			->where("s.refType = 'incidentcause'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		
		//Check for existing record
		$q2 = Doctrine_Query::create()->select('i.orgID')
			->from('IncidentCauseValue i')
			->where("i.orgID = ?", $this->getOrgID());
		$q2->execute();
		
		if ($result2 = $q2->execute(array(), Doctrine::HYDRATE_ARRAY)) {
			
		} else {		
		
		
			//insert values into the $incidentCause table
			foreach ($result as $key => $value){
				//return $key."-".$value['name'];
				
				//insert into $incidentCause value table
				$incidentCause = new IncidentCauseValue();
				$incidentCause->name = $value['name'];
				$incidentCause->rTime = $this->getDateFormat();
				$incidentCause->rUser = $this->getUserID();
				$incidentCause->orgID = $this->getOrgID();
				$incidentCause->save();
			}
								
		}
	}
	
	/**
	  * @remotable
	  */
	public function execInit(){
		echo $this->noise();
		echo $this->location();
		echo $this->activity();
		echo $this->weather();
		echo $this->animal();
		echo $this->bodypart();
		echo $this->injurecondition();
		echo $this->footwear();
		echo $this->incident();
		echo $this->incidentCause();
        $user = $this->getCurrentUser();
		$user->lastSetupOrder = 999;
		$user->save();
	}
}

//$init = new initAPI();
/*
echo $init->noise();
echo $init->location();
echo $init->activity();
echo $init->weather();
echo $init->animal();
*/