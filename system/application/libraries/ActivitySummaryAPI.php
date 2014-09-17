<?php
class ActivitySummaryAPI extends ControllerBase {
	protected $tableName = "ActivityDetail";
	protected $pageName = "Calendar";
	
	/**
      * @remotable
      */
	public function getSummary($params) {
		if (!isset($params->ID)) {
			return false;
		}
		$id = $params->ID;
		$q = Doctrine_Query::create()->select('activityID,actDtlStime,actDtlEtime')->from('ActivityDetail')->where('ID = ?', $id);
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		$activityDetail = $result[0];
		
		$q = Doctrine_Query::create()->select('activityName')->from('ActivityValue')->where('ID = ?', $activityDetail["activityID"]);
		$q->execute();
		$result = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		$activityDetail["activityName"] = $result[0]["activityName"];
		
		$start_ts = strtotime($activityDetail["actDtlStime"]);
		$activityDetail["actDtlStime"] = date("F j Y g:ia", $start_ts);
		
		$end_ts = strtotime($activityDetail["actDtlEtime"]);
		$activityDetail["actDtlEtime"] = date("g:ia", $end_ts);
		
		$return = (object) array();
		$return->total = array(count($activityDetail));
		$return->success = true;
		$return->items = $activityDetail;
		
		return $return;
	}
}
?>