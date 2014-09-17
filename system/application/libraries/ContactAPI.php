<?php

class ContactAPI extends ControllerBase {
	protected $tableName = 'ContactValue';
	protected $updateOrgId = true;
	protected $updateFields = array("colorCode", "orgID", "firstName", "lastName", "address1", "address2", "city", "state", "zip", "email", "relation", "isRedFlag", "type", "title", "phoneNumber", "cellNumber", "startDate", "inActiveDate");
	protected $listFields = "c.*, s.refType as refType, s.name as name, CONCAT_WS(', ', lastName, firstName) fullName";
    protected $pageName = 'Contact';
    
	
	protected function prepareListQuery($q) {
        $q->from("ContactValue c, c.SystemRef s");
        $orgID = $this->getOrgID();
    	$q->andWhere("c.orgID = ?", $orgID);
    	$q->andWhere('(c.inActiveDate >= CURDATE() OR c.inActiveDate IS NULL OR c.inActiveDate = "0000-00-00")');
    	//echo $q->getSqlQuery();
	}
	
	protected function applyCustomFilters($query, $data) {
		if (isset($data->type)) {
			$type = $data->type;
			$query->where("type = ?", $type);
			//am passing type = 'Vendor' but 'Vendor' may be different
		}
    }
}

