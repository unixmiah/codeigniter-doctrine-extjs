<?php

class Direct extends Controller {

	function Direct()
	{
		parent::Controller();
		$this->load->library('extdapi');
		$this->load->library('extdcacheprovider', array('filePath' => 'cache/api_cache.txt'));
	}
	
	function api($output = true)
	{
		$this->extdapi->setRouterUrl('index.php/direct/router'); // default
		$this->extdapi->setCacheProvider($this->extdcacheprovider);
		$this->extdapi->setNamespace('Ext.app');
		$this->extdapi->setDescriptor('Ext.app.REMOTING_API');
		$this->extdapi->setDefaults(array(
		    'autoInclude' => true,
		    'basePath' => 'libraries'
		));
		
		
		$this->extdapi->add(
			array(
				'PermissionsAPI',
				'UserAPI',
                'ActivityAPI',
				'LoggerAPI',
				'LoginAPI',
				'SignUpAPI',
				'HandHeldUsabilityAPI',
			    'OrgInfoAPI',
			    'NoiseAPI',
			    'AnimalAPI',
				'WeatherAPI',
				'LocationAPI',
				'SystemRefAPI',
				'MessageAPI',
				'RedFlagAPI',
			    'ProfileAPI',
				'ActivityDetailAPI',
				'DimensionValueAPI',
				'SiteConfigurationAPI',
				'ContactAPI',
			    'ObservationAPI',
				'ActivityArchiveAPI',
				'ClientAPI',
				'EmergencyContactAPI',
			    'IncidentAPI',
				'AidAPI',
				'BodyPartAPI',
				'FootwearAPI',
				'IncidentActivityAPI',
				'IncidentCauseAPI',
				'InjuryAPI',
				'PhysicianContactAPI',
				'initAPI',
				'UserRoleAPI',
				'ContactTypeAPI',
				'QolScoreValueAPI',
				'CalendarAPI',
				'UsabilityAPI',
				"ClientSpecialcondDetailAPI",
				"AllergyDetailAPI",
				"AidDetailAPI",
				"ReportsAPI",
				"ActivitySummaryAPI",
				"IncidentBodypartAPI",
				"InjureConditionValueAPI",
				"OrgReportAPI",
				"PhotoAPI"
			)
		);

		//$this->session->set_userdata(array('ext-direct-state' => $this->extdapi->getState()));
		if($output) $this->extdapi->output();
	}
	
	function router()
	{
		if(!$this->session->userdata('ext-direct-state')) {
			$this->api(false);
		}
		$this->load->library('extdrouter', array('api' => $this->extdapi));
		$this->extdrouter->dispatch();
		$this->extdrouter->getResponse(true);
	}
}

