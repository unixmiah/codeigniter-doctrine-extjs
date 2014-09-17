<?php
class UserRoleAPI extends ControllerBase {
	protected $tableName = 'UserRole';	
	protected $updateFields = array("roleName", "roleDesc");

	protected function prepareListQuery($q) {
        $q->from("UserRole u");
    }

	 public function saveForm($a) {
		
	 }


	protected function getPermissionsForRole($roleID){
		$q = Doctrine_Query::create()->select(" p.permissionName");
		$q->from("Permission p, p.RolePermission rp, p.PageRef page");
		$q->where("p.pageID = page.id ");
		$q->andWhere("rp.userRoleID =?", $roleID);
		$q->where("p.ID = rp.permissionID ");
		$temp = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		//print_r($temp);
		return $temp;

	 }

	 
	 protected function getAvailablePages(){
		 $q = Doctrine_Query::create()->select("name ");
		 $q->from("PageRef");
		 $temp = $q->execute(array(), Doctrine::HYDRATE_ARRAY);
		 return $temp;
	 }


	 /**
     * @remotable
     */
	 public function getPermissionsByRole($roleID){

	   $selectedPermissionsTemp = $this->getPermissionsForRole($roleID);
	   $selectedPermissions = array();
	   foreach($selectedPermissionsTemp as $key => $value){
		//$key is another array.
		$selectedPermissions[$value['permissionName']] = $value['ID'];
	   }

	   //print_r($selectedPermissions);

	   $availablePermissionsTemp = $this->getAvailablePages();
	   $availablePermissions = array();
	    foreach($availablePermissionsTemp as $key => $value){
		//$key is another array.
		$availablePermissions[$value['name']] = $value['ID'];
	   }
	   //print_r($availablePermissions);
	   $resultArray = array();
	   // Create a return array with pageName as key and value as new array with all the values
	   foreach($availablePermissions as $key => $value){
	   		//$mergedValue = $this->mergePermission($this->getMatchingKeys($selectedPermissions, $key));
			$resultArray[$key] = $this->mergePermission($this->getMatchingKeys($selectedPermissions, $key), $key);
	   }
	   print_r($resultArray);

	 }


	 protected function getMatchingKeys($source, $searchKey){
			$resultArray = array();
			foreach($source as $key => $value){
				if( strstr($key, '_', true) == $searchKey) {
				$resultArray[$key] = $value;
				}
			}
			print_r($resultArray);
			return $resultArray;
	 }


	 protected function mergePermission($source, $skey){
		$create = $update = $read = $delete = $lock = false;

			if(array_key_exists ( $skey + "_lock", $source)) {
			 return array("_create" => false ,
						  "_update" => false ,
						  "_read" => false ,
						  "_delete" => false ,
						  "_lock" => true
						  );

			} elseif(array_key_exists ( $skey + "_all", $source)){
			 return array("_create" => true ,
						  "_update" => true ,
						  "_read" => true ,
						  "_delete" => true ,
						  "_lock" => false,
						  );
			 } else {
				foreach($source as $key => $value){
					$perName = strstr($key, '_', false);
					print_r($perName);
					switch($perName) {
				
						case "create" : $create = true; break;
						case "update" : $update = true; break;
						case "read"   : $read = true; break;
						case "delete" : $delete = true; break;
				
					}

				}

				return array("_create" => $create ,
							 "_update" =>$update ,
							 "_read" => $read ,
							 "_delete" => $read ,
							  "_lock" => false,
							  );
			 }

	 }
}