<?php

//Run defaultNoiseSetup
$noise = new NoiseAPI();
echo $noise->defaultNoiseSetup();

//Run defaultLocationSetup
$location = new LocationAPI();
echo $location->defaultLocationSetup();

//Run defaultActivitySetup
$activity = new ActivityAPI();
echo $activity->defaultActivitySetup();

//Run defaultWeatherSetup
$weather = new WeatherAPI();
echo $weather->defaultWeatherSetup();

//Run defaultAnimalSetup
$animal = new AnimalAPI();
echo $animal->defaultAnimalSetup();

//Run dimensionDimensionSetup
$dimension = new DimensionValueAPI();
echo $dimension->defaultDimensionSetup();

//Run dimensionQolScoreValue
include "QolScoreValueAPI.php";
$qolScore = new QolScoreValueAPI();
echo $qolScore->defaultQolScoreValue();

