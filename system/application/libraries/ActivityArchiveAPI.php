<?php

class ActivityArchiveAPI extends ControllerBase {
	protected $tableName = 'ActivityArchive';
	protected $listFields = "a.*";
	protected $updateFields = array('numParticipant', 'numStaff', 'numVolunteer', 
									'noiseIND', 'hasFriendFamily', 'hasAnimal');
	
	protected function prepareListQuery($q) {
        $q->from("ActivityArchive a");
        //$q->where("a.isActive = 1");		
    }
}

