<?php
class QolScoreValueAPI extends ControllerBase {
	protected $tableName = 'QolScoreValue';
	protected $pageName = "QolScoreValue";
	protected $updateOrgId = true;
	protected $updateFields = array('orgID','score','scoreDesc', 'isActive');
		
	protected function prepareListQuery($q) {
        $q->from("QolScoreValue q");
		$q->where("orgID = ?", $this->getOrgID());
		$q->orderBy("q.score DESC");
    }
    
    
    public function defaultQolScoreValue(){
		//grab the QOL values from the systemref table
		$q = Doctrine_Query::create()->select('s.name')
			->from('SystemRef s')
			->where("s.refType = 'qolscore'");
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		
		//insert values into the QOL table
		foreach ($result as $key => $value){
			//return $key."-".$value['name'];
			
			//insert into activitiy value table
			$qolScore = new QolScoreValue();
			$qolScore->score = $value['name'];
			$qolScore->scoreDesc = $value['scoreDesc'];
			$qolScore->orgID = 16;
			$qolScore->isActive = 1;
			$qolScore->rTime = date("d/m/y : H:i:s", time());
			$qolScore->rUser = $this->getUserID();
			$qolScore->save();
		}
	}
}	