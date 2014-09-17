<?php

class PhotoAPI extends ControllerBase {
	
	public function execQuery($query, $isSelect=true){
		$q = Doctrine_Manager::getInstance()->getCurrentConnection();
		$query = $q->execute($query);
        if($isSelect) {
		    return $result = $query->fetchAll();
        }
	}

		    
	/**
     * @remotable
     */
	public function uploadImages($dataSet){
		foreach ($dataSet as $key => $value){
			//upload image
			if(isset($_POST['upload']) && $_FILES['userfile']['size'] > 0){
				$fileName = $_FILES['userfile']['name'];
				$tmpName  = $_FILES['userfile']['tmp_name'];
				$fileSize = $_FILES['userfile']['size'];
				$fileType = $_FILES['userfile']['type'];
				
				$fp      = fopen($tmpName, 'r');
				$content = fread($fp, filesize($tmpName));
				$content = addslashes($content);
				fclose($fp);
				
				if(!get_magic_quotes_gpc())
				{
				    $fileName = addslashes($fileName);
				}
							
				$query = "INSERT INTO `photo_detail` (tag, ext, photo) ".
				"VALUES ('$fileName', '$fileType', '$data')";
				
				//process insert query
				$this->execQuery($query);
				//return uplaod successful message
				//echo "<br>File $fileName uploaded<br>";
			} 
			
		}	    
	} 
		
	
	
	/**
     * @remotable
     * @formHandler
     */
    public function getImagesForMobileActivity($data){
        return $this->getImagesForActivity($data);
    }
    
    /**
     * @remotable
     * @formHandler
     */
    public function getImagesForMobileObservation($data){
        return $this->getImagesForObservation($data);
    }
    
	/**
     * @remotable
     */
	public function getImagesForActivity($data){
       if(is_object($data)) {
            if (isset($data->activityID)) {
                $actID = $data->activityID;
            }
       } else {
            if (isset($data["activityID"])) {
                $actID =  $data['activityID'];
             }
       }
     
        $query="SELECT `ID`, `tag`, `ext` FROM `photo_detail` WHERE `actDetailID` =  $actID";
        $result = $this->execQuery($query);	
		$values = array();
        $count = count($result);
        if($count > 0) {
            foreach ($result as $key => $value){
			    if (empty($result)) {
		    	    $data=file_get_contents("images/noImageAvailable.gif");
		  	    } else {
		  		    $ID  = $value['ID'];
		  		    $tag = $value['tag'];
		  		    $storedUrl[] =  array("ID"=>$ID , "tag"=>"".$tag , "url"=>"thumbnail.php?type=ACT&id=".$ID);
		  	    }
		    }
        
            $values['success'] = true;
            $values['items'] = $storedUrl;
        } else {
            $values['success'] = false;
            $values['items'] = array();
        }
				
		return ($values);
	}

	/**
     * @remotable
     */
	public function getImagesForObservation($data){
     
     if(is_object($data)) {
            if (isset($data->observationID)) {
                 $obvID = $data->observationID;
            }
       } else {
            if (isset($data["observationID"])) {
                 $obvID =  $data['observationID'];
             }
       }
       
        $query="SELECT `ID`, `tag`, `ext` FROM `photo_detail` WHERE `observDetailID` =  $obvID";
        $result = $this->execQuery($query);	
		$values = array();
        $count = count($result);
        if($count > 0) {
            foreach ($result as $key => $value){
			    if (empty($result)) {
		    	    $data=file_get_contents("images/noImageAvailable.gif");
		  	    } else {
		  		    $ID  = $value['ID'];
		  		    $tag = $value['tag'];
		  		    $storedUrl[] =  array("ID"=>$ID , "tag"=>"".$tag , "url"=>"thumbnail.php?type=OBV&id=".$ID);
		  	    }
		    }
        
            $values['success'] = true;
            $values['items'] = $storedUrl;
        } else {
            $values['success'] = false;
            $values['items'] = array();
        }
				
		return ($values);
    }   
	
	
    
    /**
     * @remotable
     */
    public function blobToImage($blob, $ext){
    	$tempDir = 'tempImg/';
    	$imagename = rand(0,125);
    	
	    // in my case, file names are not unique, so I add the id
    	$filename = $basedir . $imagename . $ext;
    	file_put_contents($filename, $blob);
    	echo 'done dumping ' . $filename ."\n";
 
    }
    
    /**
     * @remotable
     */	
    public function prepEmail($email, $tag, $ext, $photo){
    	
	    //Grab the BLOB from DB and convert it into a temp file and after sending the 
		//email attachment delete the file
		$tempDir = 'tmpImg/';
		//$imagename = rand(0,125);
		$imagename = $tag; 
		$filename = $tempDir . $imagename .'.'. $ext;
		file_put_contents($filename, $photo);
    	
		
		$file = $filename;
		$file_size = filesize($file);
		$handle = fopen($file, "r");
		$content = fread($handle, $file_size);
		fclose($handle);
		$content = chunk_split(base64_encode($content));
		$uid = md5(uniqid(time()));
		$name = basename($file);
	    
		$from_name = "mOQOLD";
		$from_mail = "support@moqold.com";
		$message   = "Hope you got the attachment";
		$replyto   = "support@moqold.com";
		$subject   = "mOQOLD Patient Snapshots";
	    
		$header = "From: ".$from_name." <".$from_mail.">\r\n";
		$header .= "Reply-To: ".$replyto."\r\n";
		$header .= "MIME-Version: 1.0\r\n";
		$header .= "Content-Type: multipart/mixed; boundary=\"".$uid."\"\r\n\r\n";
		$header .= "This is a multi-part message in MIME format.\r\n";
		$header .= "--".$uid."\r\n";
		$header .= "Content-type:text/plain; charset=iso-8859-1\r\n";
		$header .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
		$header .= $message."\r\n\r\n";
		$header .= "--".$uid."\r\n";
		$header .= "Content-Type: application/octet-stream; name=\"".$filename."\"\r\n"; // use different content types here
		$header .= "Content-Transfer-Encoding: base64\r\n";
		$header .= "Content-Disposition: attachment; filename=\"".$filename."\"\r\n\r\n";
		$header .= $content."\r\n\r\n";
		$header .= "--".$uid."--";
	    
		if (mail($email, $subject, $message, $header)) {
		  
			return array("success"=>true, "msg"=> "Message Sent to " .$email." successfully");
		  
		  	//remove the file from the filesystem after the attachment sent
		  	unlink($filename);
		  
		} else {
		  	return array("success"=>false, "msg"=> "Sorry, the message could not be sent. Please try again.");
		}
    }
    
	/**
     * @remotable
     */
	public function emailAttachment($photoID, $actDetailID, $obvDetailID){
		
		if(isset($obvDetailID) && $obvDetailID > 0){
			//Grab ClientID from the obv table by the obv id
			$query = "SELECT `clientID` FROM `observ_detail` WHERE `ID` = $obvDetailID";
			$result = $this->execQuery($query, $isSelect=true);
			$clientID = $result[0]['clientID'];
			
			//Grab the first emergency contact id by the client id
			$query = "SELECT `firstEContactID` FROM `client` WHERE `ID` = $clientID";
			$result = $this->execQuery($query, $isSelect=true);
			$emgContID = $result[0]['firstEContactID'];
			
			//Grab the email address of the first emergency contact id
			$query = "SELECT `email` FROM `emergency_contact` WHERE `ID` = $emgContID";
			$result = $this->execQuery($query, $isSelect=true);
			$email = $result[0]['email'];
			
			if(empty($email)){return array("success"=>false, "msg"=> "Sorry, no email address was found.");}
			
			$query = "SELECT `tag`, `ext`, `photo`,`ID` FROM `photo_detail` WHERE `ID` = $photoID";	
			$result = $this->execQuery($query, $isSelect=true);
			$tag = $result[0]['tag'];
			$ext = $result[0]['ext'];
			$photo = $result[0]['photo'];
				
			if ($this->prepEmail($email, $tag, $ext, $photo)) {

				return array("success"=>true, "msg"=> "Message Sent to " .$email." successfully");

			} else {
				return array("success"=>false, "msg"=> "Sorry, the message could not be sent. Please try again.");
			}
				
		}
		
		if(isset($actDetailID)){
			foreach($actDetailID as $key => $value){
				
			        //$photoID = $value[0];
			        $email = $value;
				
				$query = "SELECT `tag`, `ext`, `photo`,`ID` FROM `photo_detail` WHERE `ID` = $photoID";	
				$result = $this->execQuery($query, $isSelect=true);
				$tag = $result[0]['tag'];
				$ext = $result[0]['ext'];
				$photo = $result[0]['photo'];

				if ($this->prepEmail($email, $tag, $ext, $photo)) {

					return array("success"=>true, "msg"=> "Message Sent to " .$email." successfully");

				} else {
					return array("success"=>false, "msg"=> "Sorry, the message could not be sent. Please try again.");
				}

			}
		}

		
		
		
	   }
		
	/**
     * @remotable
     */
	public function deleteImage($id){		
		$query = "DELETE FROM photo_detail WHERE ID = $id";
		$result = $this->execQuery($query, false);	
		return array("success"=>true);	
	}
    
    /**
     * @remotable
     */
	public function reNameTagForImage($pid, $newVal){
        if(isset($pid) && isset($newVal)){
		    $query="UPDATE photo_detail SET `tag` = '$newVal' WHERE ID = $pid";
		    $result = $this->execQuery($query, false);	
		    return array("success"=>true);
        }
	}
    
    /**
     * @remotable
     */
	public function assignToObservation($phid, $observID) {
    
        if(isset($phid) && isset($observID)){
		        $query="update `photo_detail` set `observDetailID`=$observID , `actDetailID`=null where `ID` = $phid";
		        $result = $this->execQuery($query, false);	
		        return array("success"=>true,"photoid"=>$phid, "observationid"=> $observID);
           }
    
	}
}	
?>