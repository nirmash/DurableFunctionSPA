var checkStatusURI = "";
var DurableOutput = null;
var handle = null;
var diabled = false;

function MapReduceIt() {
    var EndPointUri = $("#endpoint").val();
    $("#endpoint").attr("disabled", "disabled");
    $("#ExecuteDurable").attr("disabled", "disabled");

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
    if (curStatus !== null ) {
        if (curStatus["ExecutionStarted:ScanUrls"] === 1) {
            $("#callFunction").html('<i class="fas fa-check-circle"></i>')
        } 

        if (curStatus["TaskCompleted:GetUriList"] === 1) {
            $("#getUrlListStatus").html('<i class="fas fa-check-circle"></i>')
        }

        if (curStatus["TaskScheduled:undefined"]) {
            $("#scanUrlsScheduled").html(curStatus["TaskScheduled:undefined"])
        }

        if (curStatus["TaskCompleted:ScanUrl"]) {
            $("#scanUrlsCompleted").html(curStatus["TaskCompleted:ScanUrl"])
        }

        if (curStatus["ExecutionCompleted:Completed"] === 1) {
            $("#scanUrlsScheduled").html(0);
        }
    }
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

