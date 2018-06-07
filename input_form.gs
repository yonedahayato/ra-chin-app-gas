function registerSSByFormData(data) {

  Logger.log("data = %s", data);

  var datasheet = SpreadsheetApp.openById('1E2VMlYvO-8XFrT9nI7xKI5TNWTvUlJtuOavnwtoO-FI').getSheetByName('input');
  var now = new Date();

  var i = datasheet.getLastRow() + 1;
  datasheet.getRange(i,  1).setValue(data[ 1]); // user_name
  datasheet.getRange(i,  2).setValue(data[ 2]); // plan_name
  
  datasheet.getRange(i,  3).setValue(data[ 3]); // type_solo
  datasheet.getRange(i,  4).setValue(data[ 4]); // type_middle
  datasheet.getRange(i,  5).setValue(data[ 5]); // type_all
  
  datasheet.getRange(i,  6).setValue(data[ 6]); // candidate_date1
  datasheet.getRange(i,  7).setValue(data[ 7]); // candidate_date2
  datasheet.getRange(i,  8).setValue(data[ 8]); // candidate_date3
  datasheet.getRange(i,  9).setValue(data[ 9]); // deadline
  datasheet.getRange(i, 10).setValue(Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss'));
  datasheet.getRange(i, 11).setValue(data[10]); // 企画no
  
  Logger.log(data[3])
  if (data[3]){
    var type = "ソロ";
  }else if(data[4]){
    var type = "ミドル";
  }else if(data[5]){
    var type = "オール"
  }else{
    var type = "-"
  }
  datasheet.getRange(i, 12).setValue(type);
  
  result = true;

  // 候補日、締切日の送信
  post_Schedule(data[10], data[6], data[7], data[8], data[9])

  return {data: true};  
}

function getSelectListFromMasterSS() {
  var selectList = [];

  // マスタデータシートを取得
  var datasheet = SpreadsheetApp.openById('1E2VMlYvO-8XFrT9nI7xKI5TNWTvUlJtuOavnwtoO-FI').getSheetByName('user_master');
  // B列2行目のデータからB列の最終行までを取得 
  var lastRow = datasheet.getRange("B:B").getValues().filter(String).length - 1;
  Logger.log("lastRow = %s", lastRow);
  // B列2行目のデータからB列の最終行までを1列だけ取得 
  selectList = datasheet.getRange(2, 2, lastRow, 1).getValues();
  Logger.log("selectList = %s", selectList); 

  return {data: selectList};
}

function check_type(type_str, input_type_str){
  Logger.log("[check type]: type_str %s, input_type_str %s", type_str, input_type_str)
  if(type_str == input_type_str){
    Logger.log("checked");
    return "checked"
  }else {
    return ""
  }
}

function get_Schedule(schedule_number){
  var url = "https://script.google.com/macros/s/AKfycbzGwsn2XHNP5Pt2A3q9_rGy0pTJR06eLqeG3lT9Th5kuNmFwYc/exec?schedule_number="+schedule_number;

  var response = UrlFetchApp.fetch(url);
  Logger.log(response)
  var json_out　=　JSON.parse(response);
  Logger.log("[get_Schedule]:"+json_out)
  Logger.log(json_out["候補日1"])
  return json_out
}

function post_Schedule(schedule_number, candidate_date1, candidate_date2, candidate_date3, dead_line){
  var url = "https://script.google.com/macros/s/AKfycbzGwsn2XHNP5Pt2A3q9_rGy0pTJR06eLqeG3lT9Th5kuNmFwYc/exec";
  var payload = {
    "schedule_number" : schedule_number,
    "candidate_date1" : candidate_date1,
    "candidate_date2" : candidate_date2,
    "candidate_date3" : candidate_date3,
    "dead_line": dead_line
  };
  var options = {
    "method" : "POST",
    "payload" : payload
  };
  var response = UrlFetchApp.fetch(url, options);
  Logger.log("[post_Schedule]: response: "+response)
}