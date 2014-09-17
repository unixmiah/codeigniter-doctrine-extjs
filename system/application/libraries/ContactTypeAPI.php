<?php
class ContactTypeAPI extends ControllerBase {
	protected $tableName = "SystemRef";
	protected $listFields = "s.*";
	protected function prepareListQuery($q) {
		$q->from("SystemRef s");
		$q->where("s.refType = 'contacttype'");

	}
}