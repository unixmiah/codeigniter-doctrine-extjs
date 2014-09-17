<?php

class ReportsAPI extends ControllerBase {
        /**
     * @remotable
     */
    public function listAll($params) {
                $orgID = $this->getOrgID();

                //detect environments
                $fullPath = $_SERVER["REQUEST_URI"];
                if(stristr($fullPath, "uat")){
                  $path = "uat";
                } elseif(stristr($fullPath, "moqoldWeb")) {
                  $path = "dev";
                } else{
                  $path = "";
                }

                $url = "http://moqold.com:8443/pentaho/content/reporting/reportviewer/report.html?solution=Reports&path=%2F&name=";

                $links = array();
                $links[] = array("ID" => 0,  "text" => "Individual OQOLD Primary Dimension; Daily Report",                                     "link" => $url."0DailyIndvActivityReport.prpt&locale=en_US#solution%253DReports%2526path%253D%25252F$path%2526name%253D0DailyIndvActivityReport.prpt%2526locale%253Den_US%2526orgId%253D".$orgID);
                $links[] = array("ID" => 1,  "text" => "Group OQOLD Participation; Daily Report",                                              "link" => $url."1DailyOrgActivityReport.prpt&locale=en_US#solution%253DReports%2526path%253D%25252F$path%2526name%253D1DailyOrgActivityReport.prpt%2526locale%253Den_US%2526orgId%253D".$orgID);
                $links[] = array("ID" => 2,  "text" => "Group Daily Schedule Report",                                                          "link" => $url."2DailyOrgScheduleReport.prpt&locale=en_US#solution%253DReports%2526path%253D%25252F$path%2526name%253D2DailyOrgScheduleReport.prpt%2526locale%253Den_US%2526orgId%253D".$orgID);
                $links[] = array("ID" => 3,  "text" => "Individual Activity Trend Report (New)",                                               "link" => $url."3IndvAct_Trend.prpt&locale=en_US#solution%253DReports%2526path%253D%25252F$path%2526name%253D3IndvAct_Trend.prpt%2526locale%253Den_US%2526orgId%253D".$orgID);   
                $links[] = array("ID" => 4,  "text" => "Individual OQOLD (Most) Frequency by Primary Dimension; Monthly Report",               "link" => $url."4IndividualActReportbyDimension.prpt&locale=en_US#solution%253DReports%2526path%253D%25252F$path%2526name%253D4IndividualActReportbyDimension.prpt%2526locale%253Den_US%2526orgId%253D".$orgID);
                $links[] = array("ID" => 5,  "text" => "Individual Top 10 Activity And Detail Report",                                         "link" => $url."5IndividualTop10ActivitDetailReport.prpt&locale=en_US#solution%253DReports%2526path%253D%25252F$path%2526name%253D5IndividualTop10ActivitDetailReport.prpt%2526locale%253Den_US%2526orgId%253D".$orgID);
                $links[] = array("ID" => 6,  "text" => "Individual by Day per Month Detail Report",                                            "link" => $url."6IndividualActivityDetailReport.prpt&locale=en_US#solution%253DReports%2526path%253D%25252F$path%2526name%253D6IndividualActivityDetailReport.prpt%2526locale%253Den_US%2526orgId%253D".$orgID);
                $links[] = array("ID" => 7,  "text" => "Individual OQOLD (Most, Best & Worst) Weekly Report",                                  "link" => $url."7IndividualWeeklyActivityReport.prpt&locale=en_US#solution%253DReports%2526path%253D%25252F$path%2526name%253D7IndividualWeeklyActivityReport.prpt%2526locale%253Den_US%2526orgId%253D".$orgID);
                $links[] = array("ID" => 8,  "text" => "Individual OQOLD (Best & Worst) Primary Dimension, Weekly per Month Report",           "link" => $url."8IndvMonthHiLow.prpt&locale=en_US#solution%253DReports%2526path%253D%25252F$path%2526name%253D8IndvMonthHiLow.prpt%2526locale%253Den_US%2526orgId%253D".$orgID);
                $links[] = array("ID" => 9,  "text" => "Individual OQOLD (Most) Primary Dimension, Weekly per Month Report",                   "link" => $url."9IndvMonthTrend.prpt&locale=en_US#solution%253DReports%2526path%253D%25252F$path%2526name%253D9IndvMonthTrend.prpt%2526locale%253Den_US%2526orgId%253D".$orgID);
                $links[] = array("ID" => 10, "text" => "Group OQOLD (Most) And # Participants by Primary Dimension; Monthly Report",           "link" => $url."10OrglActReportbyDimension.prpt&locale=en_US#solution%253DReports%2526path%253D%25252F$path%2526name%253D10OrglActReportbyDimension.prpt%2526locale%253Den_US%2526orgId%253D".$orgID);
                $links[] = array("ID" => 11, "text" => "Individual Red/Green Flag Report",                                                     "link" => $url."11redflagReportManual.prpt&locale=en_US#solution%253DReports%2526path%253D%25252F$path%2526name%253D11redflagReportManual.prpt%2526locale%253Den_US%2526orgId%253D".$orgID);

                //only for test account orgid 1
                if($this->getOrgID() == 1){
	               $links[] = array("ID" => 12, "text" => "Organization Desktop Usability Log",                                                "link" => $url."OrgUsabilityReport.prpt&locale=en_US#solution%253DReports%2526path%253D%25252F$path%2526name%253DOrgUsabilityReport.prpt%2526locale%253Den_US%2526orgId%253D".$orgID);
	               $links[] = array("ID" => 13, "text" => "Organization Handheld Usability Log",                                         	   "link" => $url."OrgHandheldUsability.prpt&locale=en_US#solution%253DReports%2526path%253D%25252F$path%2526name%253DOrgHandheldUsability.prpt%2526locale%253Den_US%2526orgId%253D".$orgID);
	            }
                
                
                $return = (object) array();
                $count = (string) count($links);
                $return->total = array($count);
                $return->success = true;
                $return->items = $links;

                return $return;
        }
}
?>
