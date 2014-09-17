<?
define("BASEPATH", "TRUE");
include ("system/application/config/database.php");
$conn = mysql_connect($db['default']['hostname'], $db['default']['username'], $db['default']['password']);
mysql_select_db($db['default']['database'], $conn);
$id = $_REQUEST['id'];

// Check if ID exists
if(!is_numeric($id)) die("No data with the ID: ".$id);

//required iCal entries
$ics_contents  = "BEGIN:VCALENDAR\n";
$ics_contents .= "VERSION:2.0\n";
$ics_contents .= "PRODID:mOQOLD\n";
$ics_contents .= "METHOD:PUBLISH\n";
$ics_contents .= "X-WR-CALNAME:Schedule\n";

# Change the timezone as well daylight settings if need be
$ics_contents .= "X-WR-TIMEZONE:America/New_York\n";
$ics_contents .= "BEGIN:VTIMEZONE\n";
$ics_contents .= "TZID:America/New_York\n";
$ics_contents .= "BEGIN:DAYLIGHT\n";
$ics_contents .= "TZOFFSETFROM:-0500\n";
$ics_contents .= "TZOFFSETTO:-0400\n";
$ics_contents .= "DTSTART:20070311T020000\n";
$ics_contents .= "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\n";
$ics_contents .= "TZNAME:EDT\n";
$ics_contents .= "END:DAYLIGHT\n";
$ics_contents .= "BEGIN:STANDARD\n";
$ics_contents .= "TZOFFSETFROM:-0400\n";
$ics_contents .= "TZOFFSETTO:-0500\n";
$ics_contents .= "DTSTART:20071104T020000\n";
$ics_contents .= "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\n";
$ics_contents .= "TZNAME:EST\n";
$ics_contents .= "END:STANDARD\n";
$ics_contents .= "END:VTIMEZONE\n";

// Get data from database
$query = "SELECT * FROM activity_value, activity_detail, location_value, activity_recurr
WHERE (activity_detail.locationTypeID = location_value.ID)  AND (activity_detail.atcRecurrID = activity_recurr.ID)
AND (activity_value.ID = activity_detail.activityID)
AND activity_detail.ID = $id";

$result = mysql_query($query, $conn);

while($schedule_details = mysql_fetch_assoc($result)){
	$id           		= $schedule_details['ID'];
	$splitStartDateTime = explode(" ", $schedule_details['actDtlStime']);
	$start_date    		= $splitStartDateTime[0];
	$start_time    		= $splitStartDateTime[1];

	$splitEndDateTime 	= explode(" ", $schedule_details['actDtlEtime']);

	$end_date      		= $splitEndDateTime[0];
	$end_time      		= $splitEndDateTime[1];

	$category      		= "Category"; //$schedule_details['Category'];

	$name          		= $schedule_details['activityName'];
	$location      		= $schedule_details['locationName'];
	$description   		= $schedule_details['description'];

	# Remove '-' in $start_date and $end_date
	$estart_date   = str_replace("-", "", $start_date);
	$eend_date     = str_replace("-", "", $end_date);

	# Remove ':' in $start_time and $end_time
	$estart_time   = str_replace(":", "", $start_time);
	$eend_time     = str_replace(":", "", $end_time);

	# Replace some HTML tags
	$name          = str_replace("<br>", "\\n",   $name);
	$name          = str_replace("&amp;", "&",    $name);
	$name          = str_replace("&rarr;", "-->", $name);
	$name          = str_replace("&larr;", "<--", $name);
	$name          = str_replace(",", "\\,",      $name);
	$name          = str_replace(";", "\\;",      $name);

	$location      = str_replace("<br>", "\\n",   $location);
	$location      = str_replace("&amp;", "&",    $location);
	$location      = str_replace("&rarr;", "-->", $location);
	$location      = str_replace("&larr;", "<--", $location);
	$location      = str_replace(",", "\\,",      $location);
	$location      = str_replace(";", "\\;",      $location);

	$description   = str_replace("<br>", "\\n",   $description);
	$description   = str_replace("&amp;", "&",    $description);
	$description   = str_replace("&rarr;", "-->", $description);
	$description   = str_replace("&larr;", "<--", $description);
	$description   = str_replace("<em>", "",      $description);
	$description   = str_replace("</em>", "",     $description);

	# Change TZID if need be
	$ics_contents .= "BEGIN:VEVENT\n";
	$ics_contents .= "DTSTART;TZID=America/New_York"     . $estart_date . "T". $estart_time . "\n";
	$ics_contents .= "DTEND:"       . $eend_date . "T". $eend_time . "\n";
	$ics_contents .= "DTSTAMP:"     . date('Ymd') . "T". date('His') . "Z\n";
	$ics_contents .= "LOCATION:"    . $location . "\n";
	$ics_contents .= "RRULE:"       . $schedule_details['rRule'] . "\n";
	$ics_contents .= "DESCRIPTION:" . $description . "\n";
	$ics_contents .= "SUMMARY:"     . $name . "\n";
	$ics_contents .= "UID:"         . $id . "\n";
	$ics_contents .= "SEQUENCE:0\n";
	$ics_contents .= "END:VEVENT\n";
}

$ics_contents .= "END:VCALENDAR\n";

# File to write the contents
$ics_file   = 'schedule.ics';

if (is_writable($ics_file)) {
	if (!$handle = fopen($ics_file, 'w')) {
		echo "Cannot open file ($ics_file)\n\n";

		exit;
	}

	# Write $ics_contents to opened file
	if (fwrite($handle, $ics_contents) === FALSE) {
		echo "Cannot write to file ($ics_file)\n\n";
		exit;
	}

	# echo "Success, wrote to <b>schedule.ics</b><br>\n\n";
	fclose($handle);

} else {
	echo "The file <b>$ics_file</b> is not writable\n\n";
}

header("Content-disposition: attachment; filename={$ics_file}"); //Tell the filename to the browser
header('Content-type: application/octet-stream'); //Stream as a binary file! So it would force browser to download
readfile($ics_file); //Read and stream the file
?>