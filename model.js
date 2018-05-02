var checkStatusURI = "";
var DurableOutput = null;
var handle = null;
var diabled = false;
var keys;

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

        keys = Object.keys(curStatus);
        
        if (keys[0]) {
            $("#task0").html(keys[0])
        }
        if (keys[1]) {
            $("#task1").html(keys[1])
        }
        if (keys[2]) {
            $("#task2").html(keys[2])
        }
        if (keys[3]) {
            $("#task3").html(keys[3])
        }

        if (curStatus["ExecutionStarted:ScanUrls"] === 1) {
            $("#callFunction").html('<i class="fas fa-check-circle"></i>')
        } else {
            $("#callFunction").html('<i class="fas fa-ellipsis-h"></i>')
        }

        if (curStatus["TaskCompleted:GetUriList"] === 1) {
            $("#getUrlListStatus").html('<i class="fas fa-check-circle"></i>')
        } else {
            $("#getUrlListStatus").html('<i class="fas fa-ellipsis-h"></i>')
        }

        if (curStatus["TaskScheduled:undefined"]) {
            $("#scanUrlsScheduled").html(curStatus["TaskScheduled:undefined"])
        }

        if (curStatus["TaskCompleted:ScanUrl"]) {
            $("#scanUrlsCompleted").html(curStatus["TaskCompleted:ScanUrl"])
        }

        if (curStatus["ExecutionCompleted:Completed"] === 1) {
            $("#scanUrlsScheduled").html('<i class="fas fa-check-circle"></i>');
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

