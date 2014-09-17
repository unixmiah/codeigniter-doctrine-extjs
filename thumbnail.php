<?php
define("BASEPATH", "TRUE");	
  include ("system/application/config/database.php");
  $conn = mysql_connect($db['default']['hostname'], $db['default']['username'], $db['default']['password']);
  mysql_select_db($db['default']['database'], $conn);
  $id = $_REQUEST['id'];
  $type = $_REQUEST['type'];
  $dbQuery = "";
  // Check if ID exists
  if(!is_numeric($id)) die("No image with the ID: ".$id);
  // Get data from database
  	switch($type) {
			case 'ORG': 
				$dbQuery = "select 'gif' as ext, `logo` as image,LENGTH(logo) as imgSize from `org` where `ID` = $id";
				break;
			case 'CLI':
				$dbQuery = "select 'gif' as ext ,`selfPic` as image, Length(selfPic) as imgSize from `client` where `ID` = $id";
				break;
			case 'ACT':
				$dbQuery = "select  `ext` as ext, `photo` as image, Length(photo) as imgSize from `photo_detail` where `ID` = $id";
				break;
			case 'OBV':
				$dbQuery = "select `ext` as ext, `photo` as image, Length(photo) as imgSize from `photo_detail` where `ID` = $id";
				break;
		}
		 $data = null;
  if($dbQuery === ""){
	$data=file_get_contents("images/noImageAvailable.gif");
  } else {
	  $result = mysql_query($dbQuery, $conn);
	  $row = mysql_fetch_assoc($result);
	  $data = null;
	  if (empty($row['imgSize'])) {
		$data=file_get_contents("images/noImageAvailable.gif");
	  } else {
			$data = base64_decode($row['image']);

		 if ($type === 'ACT' || $type === 'OBV') {  //todo: temp fix need to have a real solution
			 // not encoded
			$data = $row['image'];
		}

	  }
  }
   header("Content-type: image/gif");
    echo $data;