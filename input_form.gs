function registerSSByFormData(data) {

  Logger.log("data = %s", data);

  var datasheet = SpreadsheetApp.openById('1E2VMlYvO-8XFrT9nI7xKI5TNWTvUlJtuOavnwtoO-FI').getSheetByName('input');
  var now = new Date();

  var i = datasheet.getLastRow() + 1;
  datasheet.getRange(i,  1).setValue(data[ 1]);
  datasheet.getRange(i,  2).setValue(data[ 2]);
  datasheet.getRange(i,  3).setValue(data[ 3]);
  datasheet.getRange(i,  4).setValue(data[ 4]);
  datasheet.getRange(i,  5).setValue(data[ 5]);
  datasheet.getRange(i,  6).setValue(data[ 6]);
  datasheet.getRange(i,  7).setValue(data[ 7]);
  datasheet.getRange(i,  8).setValue(data[ 8]);
  datasheet.getRange(i,  9).setValue(data[ 9]);
  datasheet.getRange(i, 10).setValue(data[10]);
  datasheet.getRange(i, 11).setValue(data[11]);
  datasheet.getRange(i, 12).setValue(Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss'));
  datasheet.getRange(i, 13).setValue(i); // 企画no
  result = true;

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
  url = "https://script.google.com/macros/s/AKfycbzGwsn2XHNP5Pt2A3q9_rGy0pTJR06eLqeG3lT9Th5kuNmFwYc/exec?schedule_number="+schedule_number

  var response = UrlFetchApp.fetch(url);
  Logger.log(response)
  var json_out　=　JSON.parse(response);
  Logger.log("[get_Schedule]:"+json_out)
  Logger.log(json_out["候補日1"])
  return json_out
}