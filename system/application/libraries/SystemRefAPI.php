<?php
class SystemRefAPI extends ControllerBase {
	protected $tableName = 'SystemRef';
	
	protected function prepareListQuery($q) {
		$q->from("SystemRef s");
	}
	
	protected function applyCustomFilters($query, $data) {
		$type = $data->type;
		$query->where("s.refType = '$type'");
    }
}