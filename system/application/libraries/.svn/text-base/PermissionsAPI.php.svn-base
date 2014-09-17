<?php
class PermissionsAPI extends ControllerBase {
	protected $tableName = 'Permission';	
	protected $updateFields = array("permissionName", "pageID", "_create", "_update", "_delete", "_read", "_lock");


	protected function prepareListQuery($q) {
        $q->from("Permission p");
		$q->orderBy("p.permissionName");
    }

	 /**
     * @remotable
     */
    public function delete($id){
		$this->response['success'] = true;
		$this->response['items'] = array();
		return $this->response;
	}
		 
}