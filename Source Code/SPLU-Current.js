    var YUCATA_PLAY_LOGGER_FOR_BGG_VERSION = "0.11.2";

    //Check if they aren't on a BGG site and alert them to that fact.
    if(window.location.host.slice(-17)!="boardgamegeek.com" &&  window.location.host.slice(-17)!="videogamegeek.com" && window.location.host.slice(-11)!="rpggeek.com" && window.location.host.slice(-6)!="bgg.cc" && window.location.host.slice(-10)!="geekdo.com"){
      alert("You must be on a BGG website to run YucataPlayLoggerForBGG.");
      throw new Error("You aren't on a BGG site.");
    }
    //Check if they are on a page that gives issues.  Specifically break on anything containing the polyfill script.
    var tmpScripts = document.getElementsByTagName('script');
    for (s=0; s<tmpScripts.length; s++) {
      if(tmpScripts[s].src.includes("polyfill") || window.location.pathname.substr(0,11)=="/boardgame/") {
        if (!confirm("YucataPlayLoggerForBGG probably doesn't function properly on this page.\r\n\r\nTry running from your Subscriptions page.\r\n\r\nClick OK to try running YucataPlayLoggerForBGG anyways.")){
          throw new Error("Incompatible page.");
        } else {
          break;
        }
      }
    }
    //Check if SPLU is already open, throw an error if not
    if(document.getElementById('SPLUwindow')){throw new Error("YucataPlayLoggerForBGG Already Running");} else {
      // Load styles:
      var style=document.createElement('style');
      style.type='text/css';
      style.innerHTML =
        '.file_drop_zone { background-color: lightgrey; border: 5px solid blue; width: 360px; height: 100px; padding: 1em 1em 1em 2em; margin-bottom: 0.5em; font-size: 2em; }' +
        '.progress_indicator { position: relative; display: inline-block; overflow: hidden; margin-bottom: 1em; width: 360px; height: 10px; }' +
        '#progress_indicator__progress { position: absolute; background-color: green; width: 360px; height: 10px; right: 100% }' +
        '.progress_indicator__border { position: absolute; border: 3px solid black; width: 360px; height: 10px; }' +
        '#log_area { resize: both; overflow: auto; max-height: 500px; background-color: #FFF; padding: 0.4em; }' +
        '.log_entry_type { color: black;}' +
        '.log_entry_type--info { color: blue;}' +
        '.log_entry_type--ok { color: green;}' +
        '.log_entry_type--warning { color: yellow; background-color: grey;}' +
        '.log_entry_type--error { color: red;}' +
        '#saveMultipleGamePlaysBtn { border:2px solid green;padding:5px 4px;border-radius:5px;background-color:lightGrey; color:black; }' +
        '#stop_processing_btn { border:2px solid red;padding:5px 4px;border-radius:5px;background-color:lightGrey; color:black;margin-left:0.2em; visibility:hidden; }' +
        '#activity_indicator { display: inline-block; vertical-align: top; margin-left: 0.5em; }' +
        '.program_version_id { float: right; font-size: 0.8em; margin-top: 0.8em; }';


      document.getElementsByTagName('head')[0].appendChild(style);
    }
    var LoggedInAs="";
    //var LoggedInAs = document.getElementsByClassName('menu_login')[0].childNodes[3].childNodes[1].innerHTML;
    //Check if the user is logged in to BGG, throw an error if not
    //if(LoggedInAs==""){alert("You aren't logged in.");throw new Error("You aren't logged in.");}

    // This is NOT the Play Logger version Id !!
    var SPLUversion="5.8.1"; // This is NOT the Play Logger version Id !!
    // This is NOT the Play Logger version Id !!

    var SPLU={};
    resetSettings();
    var SPLUplayId="";

    var NumOfPlayers=0;
    var PlayerCount=0;
    var LocationList=true;
    var PlayerList=true;
    
    tmp=new Date();
    var SPLUtodayDate=new Date(tmp.setMinutes(tmp.getMinutes()-tmp.getTimezoneOffset()));
    var SPLUtoday=SPLUtodayDate.toISOString().slice(0,10);
    var SPLUtodayDateZero=new Date(SPLUtoday);
    var SPLUgameID=0;
    var SPLUgameTitle="";
    var SPLUprevGameID=-1;
    var ExpansionsToLog=0;
    var SPLUwinners=[];
    var SPLUwinnersNoreenText="";
    var SPLUwinnersScores=[];
    var SPLUlocationCount=0;
    var SPLUcurrentFilter="All";
    var SPLUcurrentGroup="";
    var SPLUcalendar="";
    var SPLUfamilyList="";
    var SPLUfamilyID="-1";
    var SPLUexpansionsLoaded=false;
    var SPLUexpansionsFromFavorite=[];
    var SPLUfamilyLoaded=false;
    var SPLUplays={};
    var SPLUplay={};
    var SPLUobjecttype="";
    var SPLUplaysPage=1;
    var SPLUplayData={};
    var SPLUplayFetch={};
    var SPLUplayFetchFail=0;
    var SPLUplaysFiltersCount=0;
    var SPLUedit={};
    var SPLUlistOfPlays=[];
    var SPLUhistoryOpened=0;
    var SPLUlastGameSaved="";
    var SPLUcurrentPlayShown="";
    var SPLUdateToday="";
    var SPLUdateYesterday="";
    var SPLUdateDayBefore="";
    var SPLUcopyContinue=true;
    var SPLUcopyID="0";
    var SPLUcopySelectedAll=false;
    var SPLUcopyCopied=0;
    var SPLUcopyTotal=0;
    var SPLUtimeouts={};
    var SPLUwindowHeight=0;
    var SPLUplaysListTab="filters";
    var SPLUplayer={};
    // var SPLUdragDiv="";
    var SPLUdragSourceDiv = null;
    var SPLUfavoritesPlayers=[];
    var SPLUfavoritesEditing="";
    var SPLUzeroScoreStats=false;
    var SPLUstatLocationSort="location";
    var SPLUstatLuckSort="-count";
    var SPLUstatWinsSort="-wins";
    var SPLUstatWinsByGameSort="-average";
    var SPLUstatWinsByGamePlayer="";
    var SPLUstatGameList="game";
    var SPLUstatGameDaysSince="days";
    var SPLUstatGameDuration="high";
    var SPLUcopyMode=false;
    var SPLUcombine=false;  //Temp variable, see getStatsGameDetails
    var SPLUsearchResults={};
    var SPLUsearchResultsLength=20;
    var SPLUi18n={};
    var SPLUi18nList={};
    var SPLUimageData={};
    var SPLUrank="empty";

    var SPLUqueue = [];
    var SPLUqueueFails = [];
    var SPLUqueueRunning = false;
    var SPLUqueueSaveAfter = false;
    var SPLUqueueFetchImageCount = 0;

  async function fetchDataJSON(url, options) {
    var response = await fetch(url, options);
    console.log("fetchDataJSON() - response: ", response);
    var data = await response.json();
    console.log("fetchDataJSON() - data: ", data);
    var tmpReturn = {"response":response, "data":data };
    return tmpReturn;
  }
  
  async function runQueue(){
    if (SPLUqueue.length == 0){
      //Queue is empty, return
      console.log("runQueue() - Queue is empty, return.");
      SPLUqueueRunning = false;
      if (SPLUqueueSaveAfter) {
        window.setTimeout(saveSettings(SPLUi18n.StatusFinished),5000);
        SPLUqueueSaveAfter=false;
      }
      return false;
    } else if (SPLUqueueRunning){
      //Queue is already running, return
      console.log("runQueue() - Queue is already running, return.");
      return false;
    } else {
      SPLUqueueRunning = true;
      console.log("runQueue() - Queue has "+SPLUqueue.length+" items in it, running.");
      tmpQueue = SPLUqueue.shift();
      if (tmpQueue.attempt >= 2) {
        //Too many failed attempts, move queue item to SPLUqueueFails
        console.log("runQueue() - Too many failed attempts, moving to SPLUQueueFails");
        tmpQueue.finish(tmpQueue);
        SPLUqueueFails.push(tmpQueue);
        window.setTimeout(function(){SPLUqueueRunning=false;runQueue();}, 2000);
        return false;
      } else {
        tmpQueue.attempt++;
        console.log("runQueue() - Attempt: "+tmpQueue.attempt);
        var tmpReturn = await tmpQueue.action(tmpQueue.arguments);
        console.log("runQueue() - tmpReturn: ", tmpReturn);
        if (tmpReturn.response.status == "200") { 
          //return await tmpReturn.json()
          //return await tmpReturn;
          console.log("runQueue() - Success, removing from queue, do something");
          tmpQueue.response = tmpReturn.response;
          tmpQueue.data = tmpReturn.data;
          tmpQueue.finish(tmpQueue);
        } else {
        //Update to check for other status messages and handle properly, like 202 for queued/retry later
          console.log("runQueue() - Not a 200 status, moving to end of queue, do something");
          tmpQueue.response = tmpReturn.response;
          tmpQueue.data = tmpReturn.data;
          SPLUqueue.push(tmpQueue);
        }
      }
    }
    console.log("runQueue() - Run again in 2 seconds");
    window.setTimeout(function(){SPLUqueueRunning=false;runQueue();}, 2000);
  }

    
  function initSPLU(){
    NumOfPlayers=0;
    PlayerCount=0;
    SPLUhistoryOpened=0;
    tmpSPLU=document.createElement('div');
    tmpSPLU.id="SPLUmain";
    tmpSPLU.style.fontSize="0.75em";
    //document.body.appendChild(tmpSPLU);
    bggdiv=document.getElementsByClassName("global-body-content")[0];
    bggdiv.appendChild(tmpSPLU);
    tmpDiv=document.createElement('div');
    tmpDiv.id="SPLU.popText";
    tmpDiv.style.visibility="hidden";
    tmpDiv.style.zIndex="577";
    tmpDiv.style.position="absolute";
    tmpDiv.style.backgroundColor="#f2ffa3";
    tmpDiv.style.border="1px Solid Black";
    tmpDiv.style.padding="3px";
    document.getElementById("SPLUmain").appendChild(tmpDiv);

    var style=document.createElement('style');
    style.type='text/css';
    style.id="BRstyle";
    style.innerHTML='.SPLUheader{height:32px; border:1px solid blue; padding:0px 5px;} .SPLUheaderClose{float:right; margin-right:-6px; margin-top:-4px;} .SPLUrows{vertical-align:bottom;} .BRbutn{border:1px dotted green;padding:0px 2px;} .BRcells{display:table-cell; padding-right:10px; padding-bottom:10px;} .SPLUplayerCells{display:table-cell;} .SPLUsettingAltRows{background-color: #80E086;} .SPLUbuttons{border:2px solid blue;padding:2px 4px;border-radius:5px;background-color:lightGrey;color:black;} .SPLUfavoritesGridItems{display:inline-block; width:100px; padding:3px; margin:5px;vertical-align:top;}';
    document.getElementsByTagName('head')[0].appendChild(style);
    
    var BRlogMain=document.createElement('div');
    BRlogMain.id='BRlogMain';
    BRlogMain.setAttribute("style","display:table; position: absolute; z-index: 1565; border-radius:15px;");
    bggMB=document.getElementById("mainbody");
    BRlogMain.style.top=self.pageYOffset+"px";
    var BRlogRow=document.createElement('div');
    BRlogRow.id='BRlogRow';
    BRlogRow.setAttribute("style","display:table-row;");
      
    var BRlogDiv=document.createElement('div');
    BRlogDiv.id='SPLUwindow';
    BRlogDiv.setAttribute("style","display:table-cell; background-color: #A4DFF3; padding: 13px;border:2px solid blue;border-radius:15px; box-shadow:10px 10px 5px #888;position:relative;");
    
    tmpDiv=document.createElement('div');
    tmpHTML= '<div id="closeButton" style="position:absolute;top:-2px;right:0px;">' +
      '<a href="javascript:{void(0);}" onClick="javascript:{hidePopText();BRlogMain.parentNode.removeChild(BRlogMain);}" style="border-bottom:2px solid blue;border-left:2px solid blue;padding:0px 10px;border-bottom-left-radius:5px;border-top-right-radius:15px;background-color:lightGrey;font-size:large;font-weight:900;color:red;">X</a>' +
      '</div>';
    tmpDiv.innerHTML+=tmpHTML;
    BRlogDiv.appendChild(tmpDiv);

    var BRlogForm=document.createElement('form');
    BRlogForm.id='SPLUform';
    BRlogForm.name='SPLUform';
    BRlogDiv.appendChild(BRlogForm);
    
    tmp=new Date();
    SPLUtodayDate=new Date(tmp.setMinutes(tmp.getMinutes()-tmp.getTimezoneOffset()));
    SPLUtempDate=SPLUtodayDate;
    todayText=SPLUtempDate.toUTCString().slice(0,3);
    SPLUdateToday=SPLUtempDate.toISOString().slice(0,10);
    SPLUtempDate.setTime(SPLUtempDate.getTime()-86400000);
    yesterdayText=SPLUtempDate.toUTCString().slice(0,3);
    SPLUdateYesterday=SPLUtempDate.toISOString().slice(0,10);
    SPLUtempDate.setTime(SPLUtempDate.getTime()-86400000);
    daybeforeText=SPLUtempDate.toUTCString().slice(0,3);
    SPLUdateDayBefore=SPLUtempDate.toISOString().slice(0,10);
    
    todayText=SPLUi18n['Calendar'+todayText];
    yesterdayText=SPLUi18n['Calendar'+yesterdayText];
    daybeforeText=SPLUi18n['Calendar'+daybeforeText];
    
    var tmpDiv=document.createElement('div');
    var tmpHTML='<div style="display:table;">' +
      '</div>' +
    '</div>' +
    '</div>' +
  '</div>' +
    '<div style="display:table; margin-top:15px;">' +

      '<div>' +
        '<div class="file_drop_zone" ondrop="fileDropHandler(event);" ondragover="fileDragOverHandler(event);">Yucata Play File Drop Zone</div>' +
      '</div>' +

      '<div class="progress_indicator">' +
        '<div id="progress_indicator__progress"></div>' +
        '<div class="progress_indicator__border"></div>' +
      '</div>' +
      '<div id="activity_indicator">/</div>' +

      '<div>' +
        '<div class="BRcells">' +
          '<div>' +
            '<input id="saveMultipleGamePlaysUpload" type="file" />' +
          '</div>' +
        '</div>' +
        '<div class="BRcells">' +
          '<div>' +
            '<a href="javascript:{void(0);}" onClick="javascript:{saveMultipleGamePlays();}" id="saveMultipleGamePlaysBtn" ><i class="fa_SP fa_SP-check display:block" style="color: rgb(33, 177, 45); vertical-align: middle; text-align: center; text-shadow: 1px 1px 1px rgb(20, 92, 6); font-style: italic; font-size: 1.65em; transform: translate(-3.5px, -1px) rotate(-13deg);"></i>Add Plays to BGG</a>' +
            '<a href="javascript:{void(0);}" onClick="javascript:{stopProcessing();}" id="stop_processing_btn">Stop</a>' +
          '</div>' +
        '</div>' +
        '<div class="BRcells" id="SPLUeditPlayDiv" style="display:none;">' +
          '<div>' +
            '<a href="javascript:{void(0);}" onClick="javascript:{saveGamePlay(\'edit\');}" style="border:2px solid blue;padding:5px 4px;border-radius:5px;background-color:lightGrey; color:black;" id="EditGamePlayBtn" onMouseOver="makeSentence();" onMouseOut="hideSentence();"><span style="" class="fa_SP-stack"><i class="fa_SP fa_SP-pencil display:block fa_SP-stack-2x fa_SP-flip-horizontal" style="font-size: 1.6em; text-align: center; text-shadow: 0px 0px 0px; transform: rotate(271deg); color: rgb(176, 115, 4);"></i><i class="fa_SP fa_SP-check display:block" style="color: rgb(33, 177, 45); vertical-align: middle; text-align: center; font-style: italic; font-size: 1.65em; opacity: 0.89; text-shadow: 1px 0px 0px rgb(20, 92, 6); transform: translate(-2.5px, 3px) rotate(-13deg);"></i></span>'+SPLUi18n.MainButtonSubmitEdits+'</a>' +
          '</div>' +
        '</div>' +
        '<div class="BRcells" id="SPLUdeletePlayDiv" style="display:none;">' +
          '<div>' +
            '<a href="javascript:{void(0);}" onClick="javascript:{deleteGamePlay();}" style="border:2px solid blue;padding:5px 5px;border-radius:5px;background-color:lightGrey; color:black;" id="DeleteGamePlayBtn";><i class="fa_SP fa_SP-trash display:block" style="text-align: center; font-size: 1.6em; vertical-align: middle; transform: translate(0px, -1px);"></i></a>' +
          '</div>' +
        '</div>' +
        '<div class="BRcells">' +
          '<div id="SPLUexpansionResults"></div>' +
        '</div>' +
      '</div>' +

      '<div>' +
        '<div id="log_area">' +
        '<span id="log__placeholder">Either drop your file with the yucata plays into to box above or select it via<br>the file selector and then click the button!</span>' +
        '</div>' +
      '</div>' +

      '<div class="program_version_id">version ' + YUCATA_PLAY_LOGGER_FOR_BGG_VERSION +
      '</div>' +



    '</div>' +
    '<div style="display:table;">' +
      '<div style="display:table-row;">' +
        '<div class="BRcells">' +
          '<div id="SPLU.SummaryTextField" style="max-width:400px;">' +
        '</div>' +
      '</div>' +
    '</div>' +
    '</div>';
    tmpDiv.innerHTML+=tmpHTML;
    BRlogForm.appendChild(tmpDiv);
    
    BRlogRow.appendChild(BRlogDiv);
    BRlogMain.appendChild(BRlogRow);
    document.getElementById('SPLUmain').insertBefore(BRlogMain,document.getElementById('SPLUmain').firstChild);
  }
  
  function fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }

  function resetSettings(){
    SPLU.Settings={
      "i18n": "en",
      "DateField":{"Visible":true,"Reset":true},
      "LocationField":{"Visible":true,"Reset":true},
      "LocationList":{"Visible":true,"Reset":true},
      "QuantityField":{"Visible":true,"Reset":true},
      "DurationField":{"Visible":true,"Reset":true},
      "IncompleteField":{"Visible":true,"Reset":true},
      "NoWinStatsField":{"Visible":true,"Reset":true},
      "CommentsField":{"Visible":true,"Reset":true,"Width":"315px","Height":"110px"},
      "GameField":{"Visible":true},
      "PlayerList":{"Visible":true},
      "PlayerNameColumn":{"Visible":true,"Reset":false},
      "PlayerUsernameColumn":{"Visible":true,"Reset":false},
      "PlayerColorColumn":{"Visible":true,"Reset":false},
      "PlayerPositionColumn":{"Visible":true,"Reset":true},
      "PlayerScoreColumn":{"Visible":true,"Reset":true},
      "PlayerRatingColumn":{"Visible":true,"Reset":true},
      "PlayerWinColumn":{"Visible":true,"Reset":true},
      "PlayerNewColumn":{"Visible":true,"Reset":true},
      "SummaryTextField":{"Visible":true},
      "PopUpText":{"Visible":true},
      "WinComments":{"Visible":false},
      "DomainButtons":{"Visible":false},
      "ExpansionQuantity":{"Value":"0"},
      "ExpansionDetails":{"Include":true},
      "ExpansionComments":{"Visible":false},
      "ExpansionLinkParent":{"Enabled":false},
      "SortPlayers":{"Order":"none"},
      "SortGroups":{"Order":"none"},
      "PlayerFilters":{"Visible":false},
      "PlayerGroups":{"Visible":false},
      "TwitterField":{"Enabled":false,"Visible":false,"Reset":true},
      "ExpansionWinStats":{"Enabled":false},
      "DefaultPlayer":{"Name":"-blank-"},
      "DefaultLocation":{"Name":"-blank-"},
      "Favorites":{"ThumbSize":"tallthumb"},
      "FetchPlayCount":{"Enabled":false}
    };
  }

  function fetchSaveData(){
    //document.getElementById("BRresults").innerHTML="Fetching save data.";
    //window.setTimeout(function(){ document.getElementById("BRresults").innerHTML=""; }, 900);
    var tmp="";
    var oReq = new XMLHttpRequest();
    oReq.onload = function(){
      tmp=JSON.parse(this.response);
      //tmp=this.responseXML;
      //if(tmp.getElementsByTagName('comments').length==0){
      //if(tmp.plays[0].comments.value.length==0){
      if(tmp.plays[0]===undefined){
        if(false){
          window.setTimeout(function(){fetchSaveData();},250);
          return;
        }else{
          SPLU = {
            "Version":SPLUversion,
            "Favorites":{ },
            "FavoritesOrder":[],
            "Locations":{
              0: { "Name": "Location1" }
            },
            "Players":{
              0: { "Name": "Player1", "Username": "Username1", "Color": "Color1" }
            },
            "Filters":{},
            "Groups":{}
          };
          resetSettings();
          tmpPlay = {
            "action":"save",
            "ajax":"1",
            "comments":JSON.stringify(SPLU),
            "objectid":"98000",
            "objecttype":"thing",
            "playdate":"1452-04-15",
            "quantity":"0",
            "twitter":"false"
          };
          xmlhttp=new XMLHttpRequest();
          xmlhttp.onload=function(){
            //var tmp2="";
            //var oReq2 = new XMLHttpRequest();
            //oReq2.onload = function(){
              //tmp2=this.responseXML;
              SPLUplayId=JSON.parse(xmlhttp.response).playid;
              //SPLUplayId=tmp2.getElementsByTagName("play")[0].id;
              fetchLanguageFileQ("en");
            //};
            //oReq2.open("get", "/xmlapi2/plays?username="+LoggedInAs+"&mindate=1452-04-15&maxdate=1452-04-15&id=98000", true);
            //oReq2.send();
          };
          xmlhttp.open("POST","/geekplay.php",true);
          xmlhttp.setRequestHeader("Content-type","application/json;charset=utf-8");
          xmlhttp.setRequestHeader("Accept","application/json, text/plain, */*");/**/
          xmlhttp.send(JSON.stringify(tmpPlay));
          //xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
          //xmlhttp.send("version=2&objecttype=thing&objectid=98000&action=save&quantity=0&comments="+fixedEncodeURIComponent(JSON.stringify(SPLU))+"&playdate=1452-04-15&B1=Save");
        }
      }else{
        SPLU=JSON.parse(tmp.plays[0].comments.value);
        //Check for invalid data
        SPLUplayId=tmp.plays[0].playid;
        SPLUremote=SPLU;
        fetchLanguageFileQ("en");
      }
      SPLUremote=SPLU;
    };
    oReq.timeout = 1000;
    oReq.ontimeout = function (e) {
      //Timed out fetching Sooty plays
      console.log("Timed out fetching Sooty plays, retrying in 5 seconds");
      //document.getElementById("BRresults").innerHTML="Timed out fetching save data, retrying in 5 seconds.";
      window.setTimeout(function(){ fetchSaveData(); }, 5000);
    };
    oReq.open("get","/geekplay.php?action=getplays&ajax=1&currentUser=true&objecttype=thing&pageID=1&showcount=10&objectid=98000&maxdate=1452-04-15&mindate=1452-04-15",true);
    //oReq.open("get", "/xmlapi2/plays?username="+LoggedInAs+"&mindate=1452-04-15&maxdate=1452-04-15&id=98000", true);
    oReq.send();
  }
  async function fetchLanguageFileQ(lang) {
    //Call this function to add the item to the queue
    console.log('fetchLanguageFileQ('+lang+')');
    SPLUqueue.push({
      "action":fetchLanguageFile, 
      "arguments":{"language":lang},
      "direction":"fetch",
      "data":"",
      "response":"",
      "attempt":0,
      "finish":fetchLanguageFileFinish
    });
    runQueue();
  }
  async function fetchLanguageFile(tmpArgs) {
    //This function is called by runQueue() when processing the queue item
    console.log("fetchLanguageFile() - ", tmpArgs);
    try {
        var url = "https://yucata-de.github.io/YucataPlayLoggerForBGG/Source%20Code/i18n/".concat(tmpArgs.language, ".json");
        var options = {};  //Setting headers here seems to trigger CORS
        return await fetchDataJSON(url, options);
    } catch(e) {
      //This shows on bad URLs?
        console.log("catcherror", e); 
    }
  }
  function fetchLanguageFileFinish(tmpObj){
    //This function is called by runQueue() when the item was processed successfully?
    console.log("fetchLanguageFileFinish() - ", tmpObj);
    //window.testObj=tmpObj;
    SPLUi18n=tmpObj.data;
    initSPLU();
    //window.setTimeout(function(){initSPLU();},500);
  }
  function saveSooty(statusID, statusLoading, statusSuccess, onloadFunction){
    console.log("saveSooty()");
    tmpSettings=JSON.stringify(SPLUremote);
    console.log("Settings Size: "+tmpSettings.length);
    //Check if their settings will overflow the 64KB comment limit on BGG.
    if(tmpSettings.length>65500){
      alert("Your saved settings are using too much space to be saved: "+tmpSettings.length+" bytes.\nPlease delete a favorite and try again.");
      document.getElementById(statusID).innerHTML="<img style='vertical-align:bottom;padding-top:5px;' src=''><span style='background-color:red;color:white;font-weight:bold;'>"+SPLUi18n.StatusErrorOccurred+"</span>";
    } else {
      xmlhttp=new XMLHttpRequest();
      xmlhttp.open("POST","/geekplay.php",true);
      xmlhttp.onload=function(responseJSON){
        console.log("SaveSooty() onload()");
        if(responseJSON.target.status==200){
          ////Should really just fix boot order rather than testing this////
          if(document.getElementById(statusID)==null){
            console.log(statusSuccess);
          }else{
            document.getElementById(statusID).innerHTML=statusSuccess;
          }
          onloadFunction();
        }else{
          document.getElementById(statusID).innerHTML="<img style='vertical-align:bottom;padding-top:5px;' src=''><span style='background-color:red;color:white;font-weight:bold;'>"+SPLUi18n.StatusErrorCode+": "+responseJSON.target.status+"</span>";
        }
      };
      if(document.getElementById(statusID)==null){
        console.log(statusLoading);
      }else{
        document.getElementById(statusID).innerHTML=statusLoading;
      }
      xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      xmlhttp.send("version=2&objecttype=thing&objectid=98000&playid="+SPLUplayId+"&action=save&quantity=0&comments="+fixedEncodeURIComponent(tmpSettings)+"&playdate=1452-04-15&B1=Save");
    }
  }
  function clearSearchResult() {
    SPLUexpansionsLoaded=false;
    SPLUfamilyLoaded=false;
  }
  function hidePopText(){
    document.getElementById('SPLU.popText').style.visibility="hidden";
  }

  var SPLUuser={};
  var oReq=new XMLHttpRequest();
  oReq.onload=function(responseJSON){
    console.log(responseJSON.target.status+"|"+responseJSON.target.statusText);
    if(responseJSON.target.status==200){
      console.log("result 200 fetching user");
      SPLUuser=JSON.parse(responseJSON.target.responseText);
      LoggedInAs=SPLUuser.username;
      if(!SPLUuser.loggedIn){
        alert("You aren't logged in.");
        throw new Error("You aren't logged in.");
      }else{
        fetchSaveData();
      }
    }else{
      console.log("other status code, can't determine user");
      alert("Can't determine who you are.  Reload, Login if needed and try again.");
      throw new Error("Can't determine user.");
    }
  };
  oReq.open("get","/api/users/current",true);
  oReq.send();


function saveMultipleGamePlays(file) {

  function getLoggedInUser() {
    var SPLUuser = {};
    var oReq = new XMLHttpRequest();
    oReq.onload = function(responseJSON){
      console.log(responseJSON.target.status+"|"+responseJSON.target.statusText);
      if (responseJSON.target.status==200){
        console.log("result 200 fetching user");
        var oUser = JSON.parse(responseJSON.target.responseText);
        bggLoggedInUser = oUser.username;
        if (!oUser.loggedIn){
          alert("You aren't logged in.");
          throw new Error("You aren't logged in.");
        } else {
          // Continue:
          addToLog(getLogEntry("Reading all your BGG play logs (to prevent the creation of double log entries) ... "));
          getOldPlaysNextPage();
        }
      } else {
        console.log("other status code, can't determine user");
        alert("Can't determine who you are.  Reload, Login if needed and try again.");
        throw new Error("Can't determine user.");
      }
    };
    oReq.open("get","/api/users/current",true);
    oReq.send();
  }

  function getOldPlaysNextPage() {
    xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.boardgamegeek.com/xmlapi2/plays?username=" + bggLoggedInUser + "&page=" + iPage + "&" + ((new Date()).getTime())); // time parameter to bypass browser cache
    xhr.onreadystatechange = handleGetOldPlaysReadystatechange;
    if (iTooManyRequestsError > TOO_MANY_REQUESTS_ERROR_THRESHOLD) {
      iTooManyRequestsError = 1;
      setTimeout(function(){
          console.log("Requesting users old plays - page " + iPage);
          xhr.send();
        }, TOO_MANY_REQUESTS_ERROR_TIMEOUT);
    } else {
      setTimeout(function(){
          console.log("Requesting users old plays - page " + iPage);
          xhr.send();
        }, DEFAULT_TIMEOUT_BETWEEN_REQUESTS);
    }
  }

  function handleGetOldPlaysReadystatechange() {
    var i;
    if (xhr.readyState === 4) {
      // Parse the XML response:
      var res = parseXml(xhr.responseText);
      var iTotalPlays = Number(res.childNodes[0].getAttribute('total'));
      var iPlaysRead = Math.min(Number(res.childNodes[0].getAttribute('page') * 100), iTotalPlays);
      incrementProgressIndicator(100 * iPlaysRead / iTotalPlays);
      incrementActivityIndicator();
      if (res.childNodes[0].childNodes.length === 1) {
        // Last (empty) page received
        incrementProgressIndicator(100);
        if (!file) {
          var x = document.getElementById("saveMultipleGamePlaysUpload");
          var txt ='';
          if ('files' in x) {
            if (x.files.length == 0) {
              txt = "Select one or more files.";
            } else {
              for (i = 0; i < x.files.length; i++) {
                txt += "<br><strong>" + (i+1) + ". file</strong><br>";
                file = x.files[i];
                if ('name' in file) {
                  txt += "name: " + file.name + "<br>";
                }
                if ('size' in file) {
                  txt += "size: " + file.size + " bytes <br>";
                }
              }
            }
            console.log(txt);
          }
        }
        if (file) {
          log_startProcessing(file);
          var read = new FileReader();
          read.readAsBinaryString(file);
          read.onloadend = function(){
              yucataPlays = JSON.parse(read.result).data;
              saveNewGamePlays(0);
          };
        } else {
          addToLog(getLogEntry("Select a file containing the Yucata plays !", LOG_ENTRY_TYPE.ERROR));
          stopProcessing();
        }
      } else {
        for (i = 0; i < res.childNodes[0].childNodes.length; i++) {
          if (res.childNodes[0].childNodes[i].nodeType !== 1 || res.childNodes[0].childNodes[i].getAttribute('location') !== "yucata.de") {
            continue;
          }
          var sComment = res.childNodes[0].childNodes[i].childNodes[3].getInnerHTML();
          var urlStartIndex = sComment.indexOf("https://www.yucata.de/en/Game/");
          if (urlStartIndex === -1) {
            continue;
          }
          var gameIdStartIndex = sComment.indexOf("/", urlStartIndex + 30);
          if (gameIdStartIndex === -1) {
            continue;
          }
          gameIdStartIndex += 1;
          var gameIdEndIndexs = sComment.indexOf(" ", gameIdStartIndex);
          var sGameId;
          if (gameIdEndIndexs === -1) {
            sGameId = sComment.slice(gameIdStartIndex);
          } else {
            sGameId = sComment.slice(gameIdStartIndex, gameIdEndIndexs);
          }
          var gameId = Number(sGameId);
          if (aOldYucataGameIds.indexOf(gameId) !== -1) {
            addToLog(getLogEntry("Yucata play " + gameId + " : Found several BGG play logs with this yucata game id.", LOG_ENTRY_TYPE.ERROR));
            continue;
          }
          aOldYucataGameIds.push(gameId);
        }
        iPage++;
        iTooManyRequestsError++;
        if (doStop !== true) {
          getOldPlaysNextPage();
        } else {
          doStop = false;
        }
      }
    }
  }
  function getDateString(date) {
    var iMonth = date.getMonth() + 1;
    var iDay = date.getDate();
    return date.getFullYear() + '-' + (iMonth < 10 ? '0' + iMonth : iMonth) + '-' + (iDay < 10 ? '0' + iDay : iDay);
  }
  function saveNewGamePlays(oldYucataGameIdsIndex) {
    if (oldYucataGameIdsIndex >= yucataPlays.length) {
      log_finishProcessing(file);
      stopProcessingButtonHide();
      return;
    }
    incrementActivityIndicator();
    incrementProgressIndicator(100 * (oldYucataGameIdsIndex + 1) / yucataPlays.length);
    var oYucataPlay = yucataPlays[oldYucataGameIdsIndex];
    var iBggGameId = yucataGameType2BggId(oYucataPlay.GameTypeId);
    if (iBggGameId === -1) {
      addToLog(getYucataPlayLogEntry(oYucataPlay.GameId, oYucataPlay.GameTypeName, "Cannot map Yucata GameType " + oYucataPlay.GameTypeId + " to BGG game id. Mapping not defined yet? Contact yucata.de admin !   ('" + oYucataPlay.CustomGameName + "')", LOG_ENTRY_TYPE.ERROR));
      if (doStop !== true) {
        setTimeout(function(){ saveNewGamePlays(oldYucataGameIdsIndex + 1); }, 10); // user setTimeout so progress indicator can be updated
      } else {
        doStop = false;
      }
    } else if (aOldYucataGameIds.indexOf(oYucataPlay.GameId) !== -1) {
      addToLog(getYucataPlayLogEntry(oYucataPlay.GameId, oYucataPlay.GameTypeName, "Already logged   ('" + oYucataPlay.CustomGameName + "')", LOG_ENTRY_TYPE.INFO));
      if (doStop !== true) {
        setTimeout(function(){ saveNewGamePlays(oldYucataGameIdsIndex + 1); }, 10); // user setTimeout so progress indicator can be updated
      } else {
        doStop = false;
      }
    } else {
      addToLog(getYucataPlayLogEntry(oYucataPlay.GameId, oYucataPlay.GameTypeName, "Creating new log entry   ('" + oYucataPlay.CustomGameName + "')", LOG_ENTRY_TYPE.OK));
      var aPlaydata = [];
      aPlaydata.push([ 'playdate', getDateString(new Date(Number(oYucataPlay.FinishedOn.slice(6, -2)))) ]);
      aPlaydata.push([ 'dateinput', getDateString(new Date()) ]);
      aPlaydata.push([ 'quantity', 1 ]);
      aPlaydata.push([ 'location', 'yucata.de' ]);
      aPlaydata.push([ 'objectid', iBggGameId ]);
      aPlaydata.push([ 'objecttype', 'thing' ]);
      aPlaydata.push([ 'comments', 'https://www.yucata.de/en/Game/' + oYucataPlay.GameTypeName + '/' + oYucataPlay.GameId ]);
      var aUserNames = [];
      oYucataPlay.Opponents.forEach(function(opponent, opponentIdx) {
        aUserNames.push(opponent.Login);
      });
      saveNewBggPlay(aPlaydata, aUserNames, oldYucataGameIdsIndex);
    }
  }

  function saveNewBggPlay(aPlaydata, aUserNames, oldYucataGameIdsIndex) {
    var querystring = "";
    aPlaydata.forEach(function(dataTuple, dataTupleIdx){
      querystring += '&' + dataTuple[0] + '=' + encodeURIComponent(dataTuple[1]);
    });
    aUserNames.forEach(function(userName, userNameIdx){
      querystring += '&players[' + (userNameIdx + 1) + '][name]=' + encodeURIComponent(userName);
      querystring += '&players[' + (userNameIdx + 1) + '][username]=' + encodeURIComponent(userName);
    });
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST","/geekplay.php", true);
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = parseXml(xhr.responseText);
        console.log(res);
        if (doStop !== true) {
          setTimeout(function(){ saveNewGamePlays(oldYucataGameIdsIndex + 1); }, 1000); // Limit play logging frequence in order not to trouble the BGG server
        } else {
          doStop = false;
        }
      }
    };
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.setRequestHeader("Accept","application/json, text/plain, */*");/**/
    xmlhttp.send('ajax=1&action=save&version=2' + querystring);
  }

  // Get XML parser (browser dependent):
  var parseXml;
  if (typeof window.DOMParser != "undefined") {
      parseXml = function(xmlStr) {
          return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
      };
  } else if (typeof window.ActiveXObject != "undefined" &&
         new window.ActiveXObject("Microsoft.XMLDOM")) {
      parseXml = function(xmlStr) {
          var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
          xmlDoc.async = "false";
          xmlDoc.loadXML(xmlStr);
          return xmlDoc;
      };
  } else {
      throw new Error("No XML parser found");
  }

  // First get all plays already registered:
  var TOO_MANY_REQUESTS_ERROR_THRESHOLD = 15;
  var TOO_MANY_REQUESTS_ERROR_TIMEOUT = 10000; // ms
  var DEFAULT_TIMEOUT_BETWEEN_REQUESTS = 2000; // ms
  var progressIndicatorSpan;
  var gotLastPage = false;
  var iPage = 1;
  var iTooManyRequestsError = 1;
  var aOldYucataGameIds = [];
  var xhr;
  var bggLoggedInUser = "";

  stopProcessingButtonShow();
  getLoggedInUser();


  function yucataGameType2BggId(yucataGameType) {
    switch (yucataGameType) {
      case 301: // 7 Steps
        return  161537;
      case 90: // A Few Acres of Snow
        return 79828;
      case 41: // Alchemist
        return 27385;
      case 340: // Ali Baba
        return 233960;
      case 88: // Antike Duellum
        return 104955;
      case 334: // Argo
        return 17450;
      case 36: // Arkadia
        return 25643;
      case 43: // Arktia
        return 35674;
      case 42: // Aronda
        return 35546;
      case 97: // At the Gates of Loyang
        return 39683;
      case 306: // Atacama2
      case 315: // Atacama3
        return 144587;
      case 91: // Atlantida
        return 100374;
      case 38: // Atoll
        return 34221;
      case 16: // Atta Ants
        return 8128;
      case 125: // Attika
        return 8051;
      case 151: // Automobiles
        return 180680;
      case 13: // Awale
        return 2448;
      case 32: // Balloon Cup
        return 5716;
      case 70: // Bangkok Klongs
        return 82424;
      case 387: // Beta Colony
        return 235533;
      case 59: // Black Friday
        return 39242;
      case 380: // Bonfire
        return 304420;
      case 321: // Bruges
        return 136888;
      case 147: // Cacao
        return 171499;
      case 104: // Call To Glory
        return 124590;
      case 63: // Campaign Manager 2008
        return 46255;
      case 85: // Can't Stop
        return 41;
      case 9: // Captn W. Kidd
        return 11765;
      case 21: // Carcassonne H&G
      case 141: // Carcassonne H&G2
        return 4390;
      case 150: // Carcassonne South Seas
        return 147303;
      case 40: // Carolus Magnus
        return 481;
      case 329: // Carpe Diem
        return 245934;
      case 98: // Carson City
      case 143: // Carson City2
        return 39938;
      case 326: // Carson City Cards
        return 248117;
      case 338: // Castle Rampage
        return 256569;
      case 349: // Chakra
        return 267378;
      case 5: // Chinagold
        return 13928;
      case 120: // City Blocks
        return 138195;
      case 332: // Claim It
        return 26162;
      case 50: // ConHex
        return 10989;
      case 390: // CuBirds
        return 245476;
      case 30: // Down Under
        return 32154;
      case 73: // Dragonheart
        return 66171;
      case 117: // Drako
        return 102237;
      case 53: // Egizia
        return 58421;
      case 94: // El Grande
        return 93;
      case 74: // Era of Inventions
        return 79282;
      case 78: // Famiglia
        return 81453;
      case 130: // Fantasy Dice Battles
        return 158947;
      case 44: // Fearsome Floors
        return 7805;
      case 372: // Fields of Arle
        return 159675;
      case 52: // Finca
        return 40628;
      case 76: // Firenze
        return 75449;
      case 310: // First Class
        return 206941;
      case 343: // Forum Trajanum
        return 244049;
      case 81: // Founding Fathers
        return 37358;
      case 7: // Four in a row
        return 2719;
      case 112: // Glen More
        return 66362;
      case 23: // Gobang & Gomoku
      case 358: // Gobang & Gomoku2
        return 11929;
      case 360: // Grand Austria Hotel
        return 182874;
      case 327: // Ground Floor
        return 255659;
      case 140: // Guildhall
        return 132372;
      case 11: // Hacienda
      case 312: // Hacienda2
        return 19100;
      case 355: // Hadara
        return 269144;
      case 89: // Hawaii
        return 106217;
      case 138: // Helios
        return 154182;
      case 157: // Hellas
        return 207330;
      case 15: // Hexxagon
        return 19914;
      case 18: // Hey, thats my fish
        return 8203;
      case 155: // Hunters and Scouts
        return 161530;
      case 307: // Imhotep
        return 191862;
      case 330: // Imhotep-Duel
        return 255674;
      case 47: // Industrial Waste
        return 2476;
      case 384: // Innovation
        return 63888;
      case 108: // Jaipur
        return 54043;
      case 20: // Just 4 Fun
        return 17534;
      case 56: // Just 4 Fun Colours
        return 66590;
      case 3: // Kahuna
        return 394;
      case 48: // Kamisado
        return 38545;
      case 17: // Kanaloa
        return 4330;
      case 128: // Kashgar
        return 143175;
      case 357: // Key Harvest
        return 29839;
      case 84: // King of Siam
        return 29937;
      case 367: // Kraftwagen
        return 171879;
      case 313: // La Granja
        return 146886;
      case 156: // La Granja No Siesta
        return 195528;
      case 1337: // La Isla
        return 154246;
      case 149: // Las Vegas
        return 117959;
      case 311: // Lemminge
      case 361: // Lemminge2
        return 153004;
      case 352: // Lift Off
        return 260757;
      case 302: // Lords of War
        return 135215;
      case 374: // Lost Ruins of Arnak
        return 312484;
      case 362: // Lorenzo
        return 203993;
      case 75: // Luna
        return 70512;
      case 153: // Macao
        return 55670;
      case 336: // Machi Koro
        return 143884;
      case 373: // Magnastorm
        return 257067;
      case 57: // Maori
        return 40425;
      case 22: // Masons
        return 21791;
      case 385: // Monster Baby Rescue
        return 282131;
      case 8: // Morris
        return 3886;
      case 378: // Mottainai
        return 175199;
      case 101: // Mount Drago
        return 89918;
      case 377: // Murano
        return 163413;
      case 318: // Mystic Vale
        return 194607;
      case 139: // Nations: The Dice Game
        return 157809;
      case 111: // Nauticus
        return 144415;
      case 136: // Navegador
        return 66589;
      case 366: // On the Underground
        return 281152;
      case 51: // One-Eye
        return 40234;
      case 324: // Oracle of Delphi
        return 193558;
      case 31: // Oregon
        return 31497;
      case 14: // Othello
        return 2389;
      case 135: // Packet Row
        return 144492;
      case 346: // Pandoria
        return 248167;
      case 158: // Pax Porfiriana
        return 128780;
      case 80: // Pergamon
        return 90040;
      case 132: // Polis
        return 69779;
      case 33: // Pompeii
        return 13004;
      case 25: // Ponte del Diavolo
        return 27172;
      case 131: // Port Royal
        return 156009;
      case 379: // PragaCaputRegni
        return 308765;
      case 320: // Puerto Rico (Cards)
        return 166669;
      case 328: // QANGO
        return 200632;
      case 72: // R-Eco
        return 15290;
      case 303: // Race
        return 202375;
      case 323: // Rajas of the Ganges
        return 220877;
      case 363: // RajasDice
        return 318553;
      case 93: // Rapa Nui
        return 103132;
      case 102: // Rattus
        return 42452;
      case 344: // Red7
        return 161417;
      case 34: // Richelieu
        return 5795;
      case 58: // Roll through the Ages
        return 37380;
      case 4: // Rose King
      case 146: // Rose King2
        return 201;
      case 127: // Russian Railroads
      case 142: // Russian Railroads2
        return 144733;
      case 27: // Saint Petersburg
        return 9217;
      case 359: // Saint Petersburg2
        return 156943;
      case 123: // Santa Cruz
        return 118610;
      case 87: // Santiago de Cuba
        return 104347;
      case 28: // Schotten Totten
        return 372;
      case 121: // Schweinebande
        return 64675;
      case 314: // Sekigahara
        return 25021;
      case 61: // Shanghaien
        return 34320;
      case 45: // Six
        return 20195;
      case 113: // Skyline
        return 121423;
      case 309: // Snowdonia
        return 119432;
      case 79: // Sobek
        return 67185;
      case 86: // Space Mission
        return 105199;
      case 154: // Spexxx
        return 150580;
      case 345: // Steamrollers
        return 182704;
      case 77: // Sticky Fingers
        return 58329;
      case 49: // Stone Age
        return 34635;
      case 291: // Storm
        return 279332;
      case 26: // Sudoku Moyo
        return 31117;
      case 35: // Tally Ho!
        return 908;
      case 103: // Targi
        return 118048;
      case 319: // Terra Mystica
        return 120677;
      case 126: // The Castles of Burgundy
        return 84876;
      case 304: // The Castles of Burgundy (Cards)
        return 191977;
      case 331: // The Great City of Rome
        return 258466;
      case 92: // The Hanging Gardens
        return 34707;
      case 109: // The Palaces of Carrara
        return 129948;
      case 60: // The Speicherstadt
        return 66505;
      case 144: // The Voyages of Marco Polo
        return 171623;
      case 82: // Thunderstone
        return 53953;
      case 55: // Thurn and Taxis
        return 21790;
      case 106: // To Court the King
        return 21632;
      case 83: // Torres
        return 88;
      case 347: // Transatlantic
        return 163805;
      case 364: // Triad
        return 251722;
      case 54: // Trias
        return 4249;
      case 129: // Twin Tin Bots
        return 126239;
      case 71: // Two by Two
        return 66608;
      case 39: // Tyrus
        return 10520;
      case 308: // Ulm
        return 191876;
      case 350: // Underwater Cities
        return 247763;
      case 342: // VOLT
        return 211454;
      case 317: // Valletta
        return 218920;
      case 24: // Vikings
      case 383: // Vikings2
        return 27173;
      case 351: // Villagers
        return 241724;
      case 99: // Vinci
        return 60;
      case 110: // Völuspá
        return 128554;
      case 115: // Völuspá Expansion
        return 128554;
      case 354: // War Chest
        return 249259;
      case 134: // Way of the Dragon
        return 67609;
      case 37: // Yspahan
        return 22345;
      case 1: // Yucata
      case 300: // Yucata2
        return 434;
      case 382: // Zola
        return 331666;
      case 95: // Zooloretto the dice game
        return 117942;
      default:
        return -1;
    }
  }
}

function fileDropHandler(ev) {
  var file;

  //console.log('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    if (ev.dataTransfer.items.length > 1) {
      addToLog(getLogEntry("Drop only *one* file !", LOG_ENTRY_TYPE.ERROR));
      return;
    }
    // If dropped items aren't files, reject them
    if (ev.dataTransfer.items[0].kind === 'file') {
      file = ev.dataTransfer.items[0].getAsFile();
    }    
  } else {
    // Use DataTransfer interface to access the file(s)
    if (ev.dataTransfer.files.length > 1) {
      addToLog(getLogEntry("Drop only *one* file !", LOG_ENTRY_TYPE.ERROR));
      return;
    }
    file = ev.dataTransfer.files[0];
  }
  saveMultipleGamePlays(file);
}

function fileDragOverHandler(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}
var LOG_ENTRY_TYPE = {
  INFO: 0,
  OK: 1,
  WARNING: 2,
  ERROR: 3
};
function getYucataPlayLogEntry(yucataGamePlayId, GameTypeName, txt, logEntryType) {
  var placeholder = document.getElementById('log__placeholder');
  if (placeholder) {
    placeholder.parentNode.removeChild(placeholder);
  }
  var span;
  var log_area = document.getElementById("log_area");
  var result = document.createElement('div');
  span = document.createElement('span');
  span.innerHTML = "Yucata play ";
  result.append(span);
  var linkElement = document.createElement('a');
  linkElement.href = 'https://www.yucata.de/en/Game/' + GameTypeName + '/' + yucataGamePlayId;
  linkElement.innerHTML = yucataGamePlayId;
  result.append(linkElement);
  span = document.createElement('span');
  span.innerHTML = " : " + txt;
  result.append(span);
  result.classList.add('log_entry_type');
  if (logEntryType !== undefined) {
    result.classList.add(['log_entry_type--info', 'log_entry_type--ok', 'log_entry_type--warning', 'log_entry_type--error'][logEntryType]);
  }
  return result;
}
function getLogEntry(txt, logEntryType) {
  var placeholder = document.getElementById('log__placeholder');
  if (placeholder) {
    placeholder.parentNode.removeChild(placeholder);
  }
  var log_area = document.getElementById("log_area");
  var elem = document.createElement('div');
  elem.innerHTML += txt;
  elem.classList.add('log_entry_type');
  if (logEntryType !== undefined) {
    elem.classList.add(['log_entry_type--info', 'log_entry_type--ok', 'log_entry_type--warning', 'log_entry_type--error'][logEntryType]);
  }
  return elem;
}
function addToLog(elem) {
  log_area.prepend(elem);
}
function log_startProcessing(file) {
  addToLog(getLogEntry('Start processing yucata play file "' + file.name + ' (' + file.size + ' bytes) ...'));
}
function log_finishProcessing(file) {
  addToLog(getLogEntry('Finished processing yucata play file "' + file.name + ' (' + file.size + ' bytes) ...'));
}
var PROGRESS_INDICATOR_CHAR = ['/', '-', '&#92;', '|', ''];
function incrementActivityIndicator() {
  var elem = document.getElementById("activity_indicator");
  var currIdx = PROGRESS_INDICATOR_CHAR.indexOf(elem.innerHTML);
  elem.innerHTML = PROGRESS_INDICATOR_CHAR[currIdx + 1];
}
function incrementProgressIndicator(percent) {
  var elem = document.getElementById("progress_indicator__progress");
  elem.style.right = (100 - percent) + "%";
}
var doStop;
function stopProcessing() {
  doStop = true;
  stopProcessingButtonHide();
}
function stopProcessingButtonShow() {
  var elem = document.getElementById("stop_processing_btn");
  elem.style.visibility = 'visible';
}
function stopProcessingButtonHide() {
  var elem = document.getElementById("stop_processing_btn");
  elem.style.visibility = 'hidden';
}
