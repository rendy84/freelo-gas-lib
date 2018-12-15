function libFreeloSetCredentials(username, apikey){
  var props = PropertiesService.getUserProperties();
  props.setProperty("user", username.toString());
  props.setProperty("key", apikey.toString());
}

function libFreeloGetCredentials() {
  var props = PropertiesService.getUserProperties();
  var user = props.getProperty("user");
  var key = props.getProperty("key");
  return {
    "username" : user,
    "apikey" : key
  };
}

function libFreeloAuthorizationHeader_() {
  var c = libFreeloGetCredentials();
  return "Basic " + Utilities.base64Encode(c.username + ":" + c.apikey);
}

function libFreeloGetProjects() {  
  var options = {};
  
  options.muteHttpExceptions = true;
  options.headers = {        
    "Authorization" : libFreeloAuthorizationHeader_()
  };  
  
  var data = [];
  var resp = UrlFetchApp.fetch("https://api.freelo.cz/v1/projects", options);
  
  if (resp.getResponseCode() == 200)
    data = JSON.parse(resp);
  
  return data;
}

function libFreeloCreateTask(projectId, tasklistId, name, content) {  
  var options = {};
  
  options.headers = {
    "Content-Type"  : "application/json",    
    "Authorization" : libFreeloAuthorizationHeader_()
  };
  
  options.muteHttpExceptions = true;
  options.method = "POST";
  options.payload = JSON.stringify({
    "name": name.toString(),
    "comment": {
      "content": content
    }
  });
  
  var data = [];
  var resp = UrlFetchApp.fetch("https://api.freelo.cz/v1/project/" + projectId + "/tasklist/" + tasklistId + "/tasks", options);
    
  if (resp.getResponseCode() == 200)
    data = JSON.parse(resp);
  
  return data;    
}