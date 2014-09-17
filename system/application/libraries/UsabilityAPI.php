<?php
class UsabilityAPI extends ControllerBase {
	protected $tableName = "DesktopUsabilityLog";
	
	/**
	  * @remotable
	  */
	public function updateUsabilityLog($params) {
		$pageName = $params->pageName;
		$pageId = $this->getPageID($pageName);

		$lastPage = $this->getSessionValue('currentPage');

		$now = $this->getDateFormat("Y-m-d H:i:s");

		if($lastPage) {
			$lastPage = Doctrine_Core::getTable('DesktopUsabilityLog')->find($lastPage);
			$lastPage->completeDate = $now;
			$lastPage->save();
		}

		$log = new DesktopUsabilityLog();
		$log->orgID = $this->getOrgID();
		$log->sessionID = $this->getSessionValue('sessionId');
		$log->pageID = $pageId;
		$log->startTime = $now;
		$log->completeDate = $now;
		$log->pageURL = $params->pageURL;
		$log->action = $params->action;
		$log->save();
		$this->setSessionValue("currentPage", $log->ID);
	}
}