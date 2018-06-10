function registerSSByFormData(data) {

  Logger.log("data = %s", data);

  var datasheet = SpreadsheetApp.openById('1E2VMlYvO-8XFrT9nI7xKI5TNWTvUlJtuOavnwtoO-FI').getSheetByName('input');
  var now = new Date();
  var now_str = Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');

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
  datasheet.getRange(i, 10).setValue(now_str);
  datasheet.getRange(i, 11).setValue(data[10]); // 企画no
  
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
  datasheet.getRange(i, 13).setValue(data[11]); // store_name  
  result = true;

  // 候補日、締切日の送信
  post_Schedule(data[10], data[6], data[7], data[8], data[9])
  
  var update_data = [[data[2], type, "スケジュール"+data[10], data[11],"集合場所"+data[10] ,now_str, data[10], data[1]]];
  // plan_name, type, schedule, store_name, gather, update_date, plan_number, user_name
  update(update_data, data[10])　//data sheetの更新
  Logger.log("finish to update")
  // lineへの通知
  post_SendLine(data[1], data[2], data[6], data[7], data[8], data[9])
  // user_name, plan_name, candidate_date1, candidate_date2, candidate_date3,　dead_line
  Logger.log("finish to send line")
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

function　update (update_data, plan_number) {
  var datasheet = SpreadsheetApp.openById('1E2VMlYvO-8XFrT9nI7xKI5TNWTvUlJtuOavnwtoO-FI').getSheetByName('data');
  plan_number = Number(plan_number)

  var cols = update_data[0].length;
  Logger.log("cols: "+cols);
  Logger.log(plan_number+1);
  datasheet.getRange(plan_number+1,2,1,cols).setValues(update_data)
}

function post_SendLine(user_name, plan_name, candidate_date1, candidate_date2, candidate_date3,　dead_line){
  var url = "https://script.google.com/macros/s/AKfycbyYF9YMvMyRi4BIIVlDo68vNKWqgaZCUedOJvob8qkrI2M-FQs/exec"

  var payload = {
    "user_name" : user_name,
    "plan_name" : plan_name,
    "candidate_date1" : candidate_date1,
    "candidate_date2" : candidate_date2,
    "candidate_date3" : candidate_date3,
    "dead_line": dead_line
  };

  var options = {
    "method" : "POST",
    "payload" : payload
  };
  Logger.log("start_fetch")
  var response = UrlFetchApp.fetch(url, options);
  Logger.log("[post_SendLine]: response: "+response)
}