var checkStatusURI = "";
var DurableOutput = null;
var handle = null;

function MapReduceIt() {
    var EndPointUri = $("#endpoint").val();

  $.post(EndPointUri, function (data) {
    checkStatusURI = data.statusQueryGetUri+"&showHistory=true";
    $("#statusUri").text(checkStatusURI);
    var iTimer = setInterval(DurableListen, 100);
    handle = iTimer;
  })
  return;
}

function DurableListen() {
  $.get(checkStatusURI, function (data) {
    RenderHeader(data);
    var curStatus = DataAgg(data);   
    RenderTable(curStatus);
    if (data.runtimeStatus == "Completed") {
        clearInterval(handle);
        return;
    }})
}

function RenderTable(curStatus){
    var HtmlStr = "<table>";
    for(var key in curStatus){
        HtmlStr+="<tr><td>";
        HtmlStr+=key+"</td><td>";   
        HtmlStr+=curStatus[key]+"</td></tr>";
    }
    HtmlStr += "</table>";
    $("#newtbl").html(HtmlStr);
}

function RenderHeader(data){
    $("#runtimeStatus").text(data.runtimeStatus);
    $("#input").text(data.input);
    $("#output").text(data.output);
}

function DataAgg(data){
    var funcCount = {};
    if(data.historyEvents==null)
        return null;
    for(ii=0; ii<data.historyEvents.length;ii++){
        var keyname = data.historyEvents[ii].EventType + ":" + (data.historyEvents[ii].FunctionName==null?data.historyEvents[ii].OrchestrationStatus : data.historyEvents[ii].FunctionName);
        if(funcCount[keyname] == null)
            funcCount[keyname] = 1;
        else
        funcCount[keyname]++;      
    }
    return funcCount;
}

