<?php
require_once(dirname(__FILE__) . '/../../database/doctrine/Doctrine.php');
class docTest extends Controller {

	function docTest()
	{
		parent::Controller();	
	}
	
	function index()
	{
		spl_autoload_register(array('Doctrine', 'autoload'));
		$manager = Doctrine_Manager::getInstance();
		$conn = Doctrine_Manager::connection('mysql://root:root@localhost/moqold', 'doctrine');
		Doctrine::generateModelsFromDb('system/application/models', array('moqold'), array('generateTableClasses' => true));
		echo Doctrine::getPath();
	}
}
