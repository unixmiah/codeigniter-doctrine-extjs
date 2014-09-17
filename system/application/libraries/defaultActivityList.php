<?php
class DefaultActivityListAPI extends ControllerBase {
    protected $tableName = "ActivityValue";
    protected $listFields = "a.ActivityName";
    

    protected function prepareListQuery($q) {
        $q->from("ActivityValue a");
        $q->where("a.orgID = 1");   
        
    }
}