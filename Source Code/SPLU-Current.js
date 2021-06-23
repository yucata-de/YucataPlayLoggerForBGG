// SPLU 5.8.1 Alpha/Beta/Current

    //Check if they aren't on a BGG site and alert them to that fact.
    if(window.location.host.slice(-17)!="boardgamegeek.com" &&  window.location.host.slice(-17)!="videogamegeek.com" && window.location.host.slice(-11)!="rpggeek.com" && window.location.host.slice(-6)!="bgg.cc" && window.location.host.slice(-10)!="geekdo.com"){
      alert("You must be on a BGG website to run YucataPlayLoggerForBGG.");
      throw new Error("You aren't on a BGG site.");
    }
    //Check if they are on a page that gives issues.  Specifically break on anything containing the polyfill script.
    let tmpScripts = document.getElementsByTagName('script');
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
      // Load javascript libs:
      function includeJs(jsFilePath) {
        var f = document.createElement("script");
        f.type = "text/javascript";
        f.src = jsFilePath;
        document.body.appendChild(f);
      }
      // includeJs("https://localhost:8888/Source Code/scripts/jquery-3.2.1.js");
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
        '#activity_indicator { display: inline-block; vertical-align: top; margin-left: 0.5em; }';


      document.getElementsByTagName('head')[0].appendChild(style);
    }
    
    var LoggedInAs="";
    //var LoggedInAs = document.getElementsByClassName('menu_login')[0].childNodes[3].childNodes[1].innerHTML;
    //Check if the user is logged in to BGG, throw an error if not
    //if(LoggedInAs==""){alert("You aren't logged in.");throw new Error("You aren't logged in.");}
    var SPLUversion="5.8.1";

    var SPLU={};
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

    let SPLUqueue = [];
    let SPLUqueueFails = [];
    let SPLUqueueRunning = false;
    let SPLUqueueSaveAfter = false;
    let SPLUqueueFetchImageCount = 0;
   
    //Insert FontAwesome CSS
    tmpLink=document.createElement('link');
    tmpLink.type="text/css";
    tmpLink.rel="stylesheet";
    tmpLink.href="https://yucata-de.github.io/YucataPlayLoggerForBGG/Source%20Code/font-awesome/css/font-awesome.min.577.css";
    document.getElementsByTagName("head")[0].appendChild(tmpLink);


  async function fetchDataJSON(url, options) {
    const response = await fetch(url, options);
    console.log("fetchDataJSON() - response: ", response);
    const data = await response.json();
    console.log("fetchDataJSON() - data: ", data);
    const tmpReturn = {"response":response, "data":data };
    return tmpReturn;
  }

  async function fetchDataCSV(url, options) {
    const response = await fetch(url, options);
    console.log("fetchDataCSV() - response: ", response);
    const data = await response.text();
    console.log("fetchDataCSV() - data: ", data);
    const tmpReturn = {"response":response, "data":data };
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
      let tmpQueue = SPLUqueue.shift();
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
        const tmpReturn = await tmpQueue.action(tmpQueue.arguments);
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

    //Insert code for SortableJS https://github.com/SortableJS/Sortable
    var sortscript=document.createElement('script');
    sortscript.type="text/javascript";
    sortscript.src='https://yucata-de.github.io/YucataPlayLoggerForBGG/Source%20Code/scripts/sortable.js';
    document.body.appendChild(sortscript);

    
    //Insert code for Pikaday calendar Copyright © 2014 David Bushell
    var pikscript=document.createElement('script');
    pikscript.type="text/javascript";
    pikscript.src='https://yucata-de.github.io/YucataPlayLoggerForBGG/Source%20Code/scripts/pikaday.js';
    document.body.appendChild(pikscript);
    var pikstyle=document.createElement("link");
    pikstyle.type="text/css";
    pikstyle.rel="stylesheet";
    pikstyle.href="https://yucata-de.github.io/YucataPlayLoggerForBGG/Source%20Code/scripts/pikaday.css";
    document.getElementsByTagName('head')[0].appendChild(pikstyle);

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
    tmpHTML= '<div id="closeButton" style="position:absolute;top:-2px;right:0px;">'
              +'<a href="javascript:{void(0);}" onClick="javascript:{hidePopText();BRlogMain.parentNode.removeChild(BRlogMain);}" style="border-bottom:2px solid blue;border-left:2px solid blue;padding:0px 10px;border-bottom-left-radius:5px;border-top-right-radius:15px;background-color:lightGrey;font-size:large;font-weight:900;color:red;">X</a>'
            +'</div>';
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
    var tmpHTML='<div style="display:table;">'
      +'</div>'
    +'</div>'
    +'</div>'
  +'</div>'
    +'<div style="display:table; margin-top:15px;">'

      +'<div>'
        +'<div class="file_drop_zone" ondrop="fileDropHandler(event);" ondragover="fileDragOverHandler(event);">Yucata Play File Drop Zone</div>'
      +'</div>'

      +'<div class="progress_indicator">'
        +'<div id="progress_indicator__progress"></div>'
        +'<div class="progress_indicator__border"></div>'
      +'</div>'
      +'<div id="activity_indicator">/</div>'

      +'<div>'
        +'<div class="BRcells">'
          +'<div>'
            +'<input id="saveMultipleGamePlaysUpload" type="file" />'
          +'</div>'
        +'</div>'
        +'<div class="BRcells">'
          +'<div>'
            +'<a href="javascript:{void(0);}" onClick="javascript:{saveMultipleGamePlays();}" id="saveMultipleGamePlaysBtn" ><i class="fa_SP fa_SP-check display:block" style="color: rgb(33, 177, 45); vertical-align: middle; text-align: center; text-shadow: 1px 1px 1px rgb(20, 92, 6); font-style: italic; font-size: 1.65em; transform: translate(-3.5px, -1px) rotate(-13deg);"></i>Add Plays to BGG</a>'
            +'<a href="javascript:{void(0);}" onClick="javascript:{stopProcessing();}" id="stop_processing_btn">Stop</a>'
          +'</div>'
        +'</div>'
        +'<div class="BRcells" id="SPLUeditPlayDiv" style="display:none;">'
          +'<div>'
            +'<a href="javascript:{void(0);}" onClick="javascript:{saveGamePlay(\'edit\');}" style="border:2px solid blue;padding:5px 4px;border-radius:5px;background-color:lightGrey; color:black;" id="EditGamePlayBtn" onMouseOver="makeSentence();" onMouseOut="hideSentence();"><span style="" class="fa_SP-stack"><i class="fa_SP fa_SP-pencil display:block fa_SP-stack-2x fa_SP-flip-horizontal" style="font-size: 1.6em; text-align: center; text-shadow: 0px 0px 0px; transform: rotate(271deg); color: rgb(176, 115, 4);"></i><i class="fa_SP fa_SP-check display:block" style="color: rgb(33, 177, 45); vertical-align: middle; text-align: center; font-style: italic; font-size: 1.65em; opacity: 0.89; text-shadow: 1px 0px 0px rgb(20, 92, 6); transform: translate(-2.5px, 3px) rotate(-13deg);"></i></span>'+SPLUi18n.MainButtonSubmitEdits+'</a>'
          +'</div>'
        +'</div>'
        +'<div class="BRcells" id="SPLUdeletePlayDiv" style="display:none;">'
          +'<div>'
            +'<a href="javascript:{void(0);}" onClick="javascript:{deleteGamePlay();}" style="border:2px solid blue;padding:5px 5px;border-radius:5px;background-color:lightGrey; color:black;" id="DeleteGamePlayBtn";><i class="fa_SP fa_SP-trash display:block" style="text-align: center; font-size: 1.6em; vertical-align: middle; transform: translate(0px, -1px);"></i></a>'
          +'</div>'
        +'</div>'
        +'<div class="BRcells">'
          +'<div id="SPLUexpansionResults"></div>'
        +'</div>'
      +'</div>'

      +'<div>'
        +'<div id="log_area">'
        + '<span id="log__placeholder">Either drop your file with the yucata plays into to box above or select it via<br>the file selector and then click the button!</span>'
        +'</div>'
      +'</div>'

    +'</div>'
    +'<div style="display:table;">'
      +'<div style="display:table-row;">'
        +'<div class="BRcells">'
          +'<div id="SPLU.SummaryTextField" style="max-width:400px;">'
        +'</div>'
      +'</div>'
    +'</div>'
    +'</div>';  
    tmpDiv.innerHTML+=tmpHTML;
    BRlogForm.appendChild(tmpDiv);


    
    var BRlogSettings=document.createElement('div');
    BRlogSettings.id='BRlogSettings';
    BRlogSettings.setAttribute("style","display:none; background-color: #80FE86; padding: 13px;border:2px solid black;border-radius:15px; box-shadow:10px 10px 5px #888; min-width:75px;position:relative;");
    var tmpDiv=document.createElement('div');
    var tmpHTML='<div id="hideSettingsButton" style="position: absolute; right: -2px; top: -3px;">'
      +'<a href="javascript:{void(0);}" onClick="javascript:{hidePopText();document.getElementById(\'BRlogMain\').style.minWidth=\'\';document.getElementById(\'BRlogSettings\').style.display=\'none\';}" style="border:2px solid black;padding:0px 8px;border-top-right-radius: 15px; border-bottom-left-radius: 5px;background-color:lightGrey;font-size:x-large;font-weight:900;color:red;">'
      +'<img src="https://yucata-de.github.io/YucataPlayLoggerForBGG/Images/close_pane.png">'
      +'</a>'
      +'</div>'
      +'<span style="font-variant:small-caps; font-weight:bold; font-size:13px;">'
      +'<center>'+SPLUi18n.SettingsHeader+'</center>'
      +'</span>'
      +'<div style="display:table;">'
      +'<div style="display:table-row;">'
      +'<div style="display:table-cell; text-align:left;"><b>'+SPLUi18n.SettingsArea+'</b></div>'
      +'<div style="display:table-cell; padding-left:10px; text-align:center;">'+SPLUi18n.SettingsVisible+'</div>'
      +'<div style="display:table-cell; padding-left: 10px; text-align:center;" id="ResetSettingsOption">'+SPLUi18n.SettingsReset+'</div>'
      +'</div>'
      +'<div style="display:table-row;">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsDate+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.DateFieldCheck" onClick="javascript:{showHide(\'DateField\');}" ></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.DateFieldReset" onclick="javascript:{SPLU.Settings.DateField.Reset=document.getElementById(\'SPLU.DateFieldReset\').checked;}"></input>'
      +'</div>'
      +'</div>'
      +'<div style="display:table-row;" class="SPLUsettingAltRows">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsLocation+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.LocationFieldCheck" onClick="javascript:{showHide(\'LocationField\');}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.LocationFieldReset" onclick="javascript:{SPLU.Settings.LocationField.Reset=document.getElementById(\'SPLU.LocationFieldReset\').checked;}"></input>'
      +'</div>'
      +'</div>'
      +'<div style="display:table-row;">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsSavedLocationList+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.LocationListCheck" onClick="javascript:{showHideLocations(\'true\');}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.LocationListReset" onclick="javascript:{SPLU.Settings.LocationList.Reset=document.getElementById(\'SPLU.LocationListReset\').checked;}"></input>'
      +'</div>'
      +'</div>'
      +'<div style="display:table-row;" class="SPLUsettingAltRows">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsQuantity+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.QuantityFieldCheck" onclick="javascript:{showHide(\'QuantityField\');}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.QuantityFieldReset" onclick="javascript:{SPLU.Settings.QuantityField.Reset=document.getElementById(\'SPLU.QuantityFieldReset\').checked;}"></input>'
      +'</div>'
      +'</div>'
      +'<div style="display:table-row;">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsDuration+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.DurationFieldCheck" onclick="javascript:{showHide(\'DurationField\');}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.DurationFieldReset" onclick="javascript:{SPLU.Settings.DurationField.Reset=document.getElementById(\'SPLU.DurationFieldReset\').checked;}"></input>'
      +'</div>'
      +'</div>'
      +'<div style="display:table-row;" class="SPLUsettingAltRows">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsIncomplete+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.IncompleteFieldCheck" onclick="javascript:{showHide(\'IncompleteField\');}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.IncompleteFieldReset" onclick="javascript:{SPLU.Settings.IncompleteField.Reset=document.getElementById(\'SPLU.IncompleteFieldReset\').checked;}"></input>'
      +'</div>'
      +'</div>'
      +'<div style="display:table-row;">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsNoWinStats+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.NoWinStatsFieldCheck" onclick="javascript:{showHide(\'NoWinStatsField\');}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.NoWinStatsFieldReset" onclick="javascript:{SPLU.Settings.NoWinStatsField.Reset=document.getElementById(\'SPLU.NoWinStatsFieldReset\').checked;}"></input>'
      +'</div>'
      +'</div>'
      +'<div style="display:table-row;" class="SPLUsettingAltRows">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsTweetThis+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.TwitterFieldCheck" onclick="javascript:{showHide(\'TwitterField\');}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.TwitterFieldReset" onclick="javascript:{SPLU.Settings.TwitterField.Reset=document.getElementById(\'SPLU.TwitterFieldReset\').checked;}"></input>'
      +'</div>'
      +'</div>'
      +'<div style="display:table-row;">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsComments+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.CommentsFieldCheck" onclick="javascript:{showHide(\'CommentsField\');}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.CommentsFieldReset" onclick="javascript:{SPLU.Settings.CommentsField.Reset=document.getElementById(\'SPLU.CommentsFieldReset\').checked;}"></input>'
      +'</div>'
      +'</div>'
      +'<div style="display:table-row;" class="SPLUsettingAltRows">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsGame+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.GameFieldCheck" onclick="javascript:{showHide(\'GameField\');}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'</div>'
      +'<div style="display:table-row;">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsDomainButtons+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.DomainButtonsCheck" onclick="javascript:{showHide(\'DomainButtons\');}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'</div>'
      +'<div style="display:table-row;" class="SPLUsettingAltRows">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsSavedPlayerNames+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.PlayerListCheck" onclick="javascript:{showHide(\'PlayerList\');}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'</div>'
      +'<div style="display:table-row;" class="SPLUsettingAltRows">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsEnableFilters+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.PlayerFiltersCheck" onclick="javascript:{showHideFilters();}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'</div>'
      +'<div style="display:table-row;" class="SPLUsettingAltRows">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsEnableGroups+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.PlayerGroupsCheck" onclick="javascript:{showHideGroups();}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'</div>'
      +'<div style="display:table-row;">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsEnableShowPlayCount+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.FetchPlayCountCheck" onclick="javascript:{SPLU.Settings.FetchPlayCount.Enabled=document.getElementById(\'SPLU.FetchPlayCountCheck\').checked;}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'</div>'
      +'<div style="display:table-row;">'
      +'<div style="display:table-cell; text-align:left; padding-top:10px;"><b>'+SPLUi18n.SettingsPlayerColumns+'</b></div>'
      +'</div>'
      +'<div style="display:table-row;">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsName+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.PlayerNameColumnCheck" onclick="javascript:{hideColumn(\'PlayerNameColumn\');}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.PlayerNameColumnReset" onclick="javascript:{SPLU.Settings.PlayerNameColumn.Reset=document.getElementById(\'SPLU.PlayerNameColumnReset\').checked;}"></input>'
      +'</div>'
      +'</div>'
      +'<div style="display:table-row;" class="SPLUsettingAltRows">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsUsername+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.PlayerUsernameColumnCheck" onclick="javascript:{hideColumn(\'PlayerUsernameColumn\');}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.PlayerUsernameColumnReset" onclick="javascript:{SPLU.Settings.PlayerUsernameColumn.Reset=document.getElementById(\'SPLU.PlayerUsernameColumnReset\').checked;}"></input>'
      +'</div>'
      +'</div>'
      +'<div style="display:table-row;">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsTeamColor+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.PlayerColorColumnCheck" onclick="javascript:{hideColumn(\'PlayerColorColumn\');}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.PlayerColorColumnReset" onclick="javascript:{SPLU.Settings.PlayerColorColumn.Reset=document.getElementById(\'SPLU.PlayerColorColumnReset\').checked;}"></input>'
      +'</div>'
      +'</div>'
      +'<div style="display:table-row;" class="SPLUsettingAltRows">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsStartPosition+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.PlayerPositionColumnCheck" onclick="javascript:{hideColumn(\'PlayerPositionColumn\');}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.PlayerPositionColumnReset" onclick="javascript:{SPLU.Settings.PlayerPositionColumn.Reset=document.getElementById(\'SPLU.PlayerPositionColumnReset\').checked;}"></input>'
      +'</div>'
      +'</div>'
      +'<div style="display:table-row;">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsScore+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.PlayerScoreColumnCheck" onclick="javascript:{hideColumn(\'PlayerScoreColumn\');}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.PlayerScoreColumnReset" onclick="javascript:{SPLU.Settings.PlayerScoreColumn.Reset=document.getElementById(\'SPLU.PlayerScoreColumnReset\').checked;}"></input>'
      +'</div>'
      +'</div>'
      +'<div style="display:table-row;" class="SPLUsettingAltRows">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsRating+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.PlayerRatingColumnCheck" onclick="javascript:{hideColumn(\'PlayerRatingColumn\');}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.PlayerRatingColumnReset" onclick="javascript:{SPLU.Settings.PlayerRatingColumn.Reset=document.getElementById(\'SPLU.PlayerRatingColumnReset\').checked;}"></input>'
      +'</div>'
      +'</div>'
      +'<div style="display:table-row;">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsWin+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.PlayerWinColumnCheck" onclick="javascript:{hideColumn(\'PlayerWinColumn\');}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.PlayerWinColumnReset" onclick="javascript:{SPLU.Settings.PlayerWinColumn.Reset=document.getElementById(\'SPLU.PlayerWinColumnReset\').checked;}"></input>'
      +'</div>'
      +'</div>'
      +'<div style="display:table-row;" class="SPLUsettingAltRows">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsNew+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.PlayerNewColumnCheck" onclick="javascript:{hideColumn(\'PlayerNewColumn\');}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.PlayerNewColumnReset" onclick="javascript:{SPLU.Settings.PlayerNewColumn.Reset=document.getElementById(\'SPLU.PlayerNewColumnReset\').checked;}"></input>'
      +'</div>'
      +'</div>'
      +'<div style="display:table-row;">'
      +'<div style="display:table-cell; text-align:left; padding-top:10px;"><b>'+SPLUi18n.SettingsOtherStuff+'</b></div>'
      +'</div>'
      +'<div style="display:table-row;" class="SPLUsettingAltRows">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsPopUpText+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.PopUpTextCheck" onclick="javascript:{SPLU.Settings.PopUpText.Visible=document.getElementById(\'SPLU.PopUpTextCheck\').checked;}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'</div>'
      +'<div style="display:table-row;">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsSummarySentence+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.SummaryTextFieldCheck" onclick="javascript:{showHide(\'SummaryTextField\');}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'</div>'
      +'<div style="display:table-row;" class="SPLUsettingAltRows">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsNoreenWinComments+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.WinCommentsCheck" onclick="javascript:{SPLU.Settings.WinComments.Visible=document.getElementById(\'SPLU.WinCommentsCheck\').checked; if(SPLU.Settings.WinComments.Visible){NoreenWinComment();}}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'</div>'
      +'<div style="display:table-row;">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsSortGroupsAlpha+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.SortGroupsAlphaCheck" onclick="javascript:{if(document.getElementById(\'SPLU.SortGroupsAlphaCheck\').checked){SPLU.Settings.SortGroups.Order=\'Alpha\';}else{SPLU.Settings.SortGroups.Order=\'None\';} loadPlayers();}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'</div>'
      +'<div style="display:table-row;" class="SPLUsettingAltRows">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsExpansionsLogDetails+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.ExpansionDetailsCheck" onclick="javascript:{if(document.getElementById(\'SPLU.ExpansionDetailsCheck\').checked){SPLU.Settings.ExpansionDetails.Include=true;}else{SPLU.Settings.ExpansionDetails.Include=false;}}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'</div>'
      +'<div style="display:table-row;">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsExpansionsListInComments+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.ExpansionCommentsCheck" onclick="javascript:{if(document.getElementById(\'SPLU.ExpansionCommentsCheck\').checked){SPLU.Settings.ExpansionComments.Visible=true;}else{SPLU.Settings.ExpansionComments.Visible=false;}}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'</div>'
      +'<div style="display:table-row;" class="SPLUsettingAltRows">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsExpansionsNoWinStats+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.ExpansionWinStatsCheck" onclick="javascript:{if(document.getElementById(\'SPLU.ExpansionWinStatsCheck\').checked){SPLU.Settings.ExpansionWinStats.Enabled=true;}else{SPLU.Settings.ExpansionWinStats.Enabled=false;}}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'</div>'
      +'<div style="display:table-row;">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsExpansionsLinkToParent+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.ExpansionLinkParentCheck" onclick="javascript:{if(document.getElementById(\'SPLU.ExpansionLinkParentCheck\').checked){SPLU.Settings.ExpansionLinkParent.Enabled=true;}else{SPLU.Settings.ExpansionLinkParent.Enabled=false;}}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'</div>'
      +'<div style="display:table-row;" class="SPLUsettingAltRows">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsTweetingDefaultOn+'</div>'
      +'<div style="display:table-cell; text-align:center;">'
      +'<input type="checkbox" id="SPLU.TwitterEnabledCheck" onclick="javascript:{if(document.getElementById(\'SPLU.TwitterEnabledCheck\').checked){SPLU.Settings.TwitterField.Enabled=true;document.getElementById(\'twitter\').checked=true;}else{SPLU.Settings.TwitterField.Enabled=false;document.getElementById(\'twitter\').checked=false;};setTwitterIcons();}"></input>'
      +'</div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'</div>'
      +'<div style="display:table-row;">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsDefaultPlayer+' <select id="SPLU.SelectDefaultPlayer" onChange="javascript:{SPLU.Settings.DefaultPlayer.Name=document.getElementById(\'SPLU.SelectDefaultPlayer\').value;}"></select></div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'</div>'
      +'<div style="display:table-row;" class="SPLUsettingAltRows">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsDefaultLocation+' <select id="SPLU.SelectDefaultLocation" onChange="javascript:{SPLU.Settings.DefaultLocation.Name=document.getElementById(\'SPLU.SelectDefaultLocation\').value;}"></select></div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'</div>'
      +'<div style="display:table-row;">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsLanguage+': <select id="SPLU.SelectLanguage" onChange="javascript:{SPLU.Settings.i18n=document.getElementById(\'SPLU.SelectLanguage\').value;}"></select></div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'</div>'
      +'<div style="display:table-row;" class="SPLUsettingAltRows">'
      +'<div style="display:table-cell; text-align:right;">'+SPLUi18n.SettingsFavoritesThumbSize+' <select id="SPLU.SelectFavoritesThumbSize" onChange="javascript:{SPLU.Settings.Favorites.ThumbSize=document.getElementById(\'SPLU.SelectFavoritesThumbSize\').value;}"></select></div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'<div style="display:table-cell; text-align:center;"></div>'
      +'</div>'

      +'</div>'
      +'<div style="display:table; padding-top:15px;">'
      +'<div style="display:table-row;">'
      +'<div style="display:table-cell; padding-right:10px;">'
      +'<a href="javascript:{void(0);}" onClick="javascript:{saveSettings(\''+SPLUi18n.StatusSaved+'\');}" class="BRbutn" style="border:2px solid black;padding:2px 4px;border-radius:5px;background-color:lightGrey; color:black;">'+SPLUi18n.SettingsSave+'</a>'
      +'</div>'
      +'<div style="display:table-cell;width:135px;" id="SPLU.SettingsStatus"></div>'
      +'<div style="display:table-cell;" id="SPLU.SettingsReset">'
        +'<a href="javascript:{void(0);}" onClick="javascript:{resetSettings();saveSettings(\'Settings Reset. Please close SPLU.\');}" style="color:red;">!</a>'
      +'</div>'
      +'<div style="display:table-cell;">'
        +'<span style="margin-left:20px;">'+SPLUversion+'</span>'
      +'</div>'
      +'</div>'
      +'</div>'
      +'</div>';
    tmpDiv.innerHTML+=tmpHTML;
    BRlogSettings.appendChild(tmpDiv);


    var BRlogFavs=document.createElement('div');
    BRlogFavs.id='BRlogFavs';
    BRlogFavs.setAttribute("style","display:none; background-color: #FFAEC5; font-style:initial; color:black; padding: 13px;border:2px solid #F30F27;border-radius:15px; box-shadow:10px 10px 5px #888; min-width:100px;position:relative;");
    var tmpDiv=document.createElement('div');
    var tmpHTML='<div id="hideFavsButton" style="position: absolute; right: 0px; top: 2px;">'
        +'<a href="javascript:{void(0);}" onClick="javascript:{hidePopText();document.getElementById(\'BRlogFavs\').style.display=\'none\';}" style="border:2px solid #F30F27;padding:0px 8px;border-top-right-radius: 15px; border-bottom-left-radius: 5px;background-color:lightGrey;font-size:x-large;font-weight:900;color:red;"><img src="https://yucata-de.github.io/YucataPlayLoggerForBGG/Images/close_pane.png"></a>'
        +'</div>'
        +'<span style="font-variant:small-caps; font-weight:bold;">'
          +'<div style="float: left; padding-left: 20px; position: absolute;">'
            +'<a href="javascript:{void(0);}" onclick="javascript:{addCustomFavorite();}" id="favoritesCustomAddToList" style="padding:4px;"><span class="fa_SP-stack"><i style="color: white; transform: translate(-6px, -9px); font-size: 3.7em;" class="fa_SP fa_SP-stack-2x"></i><i style="color: red; font-size: 1.6em;" class="fa_SP fa_SP-stack-2x fa_SP-heart"></i><i class="fa_SP fa_SP-stack-2x fa_SP-gift" style="color: rgb(5, 167, 5); transform: scaleX(-1) translate(-4px, 6px); font-size: 1.2em; text-shadow: 1px -1px rgb(255, 255, 255), 1px 1px rgb(255, 255, 255), -1px -1px rgb(255, 255, 255);"></i></span></a>'
          +'</div>'
        +'<center>'+SPLUi18n.FavoritesHeader+'</center>'
        +'<br />'
        +'</span>'
        +'<div id="SPLU.FavoritesCustomNameDiv" style="display:none;"><input style="margin-bottom: 10px; margin-left: 23px;" id="SPLU.FavoritesCustomName" type="text"><div style="display: inline;"><a style="" href="javascript:{void(0);}" ><span style="transform: translate(-1px, 3px);" class="fa_SP-stack"><i style="color: white; transform: translate(0px, -3px); font-size: 1.4em;" class="fa_SP fa_SP-stack-2x fa_SP-square-sharp"></i><i style="font-size: 1.3em; color: black;" class="fa_SP fa_SP-stack-2x fa_SP-floppy2"></i></span></a></div></div>'
        +'<div id="SPLU.FavoritesStatus"></div>'
        +'<div id="SPLU.FavoritesList" style="overflow-y:auto; width:220px;"></div>'
          +'<div style="margin-top:10px;"><a href="javascript:{void(0);}" onClick="javascript:{saveFavoritesOrder();}" class="SPLUbuttons" style="margin-right:6px;color:black;border:2px solid #249631">'+SPLUi18n.FavoritesOrderButtonSave+'</a>'
          +'<div id="SPLU.FavoritesLowerStatus" style="display:inline;padding-left:5px;"></div>'
          +'</div>'
        +'</div>';

    tmpDiv.innerHTML+=tmpHTML;
    BRlogFavs.appendChild(tmpDiv);

    var BRlogExpansions=document.createElement('div');
    BRlogExpansions.id='BRlogExpansions';
    BRlogExpansions.setAttribute("style","display:none; background-color: #B269FB; font-style:initial; color:white; padding: 13px;border:2px solid blue;border-radius:15px; box-shadow:10px 10px 5px #888; min-width:75px; max-width:250px;position:relative;");
    var tmpDiv=document.createElement('div');
    var tmpHTML='<div id="hideExpansionsButton" style="position: absolute; right: 0px; top: 2px;">'
        +'<a href="javascript:{void(0);}" onClick="javascript:{hidePopText();document.getElementById(\'BRlogExpansions\').style.display=\'none\';}" style="border:2px solid blue;padding:0px 8px;border-top-right-radius: 15px; border-bottom-left-radius: 5px;background-color:lightGrey;font-size:x-large;font-weight:900;color:red;"><img src="https://yucata-de.github.io/YucataPlayLoggerForBGG/Images/close_pane.png"></a>'
        +'</div>'
        +'<form name="BRexpLogForm">'
          +'<center><b>'+SPLUi18n.ExpansionsHeader+'</b></center>'
            +'<div style="display:table;width:250px;">'
              +'<div style="display:table-row;">'
                +'<div id="SPLU.ExpansionsHeading" style="display:table-cell;padding-bottom:5px;border-top:2px solid blue;border-top-left-radius:20px;border-top-right-radius:20px;">'
                  +'<center>'
                    +'<a href="javascript:{void(0);}" onClick="javascript:{showExpansionTab();}">'+SPLUi18n.ExpansionsTabExpansions+'</a>'
                  +'</center>'
                +'</div>'
                +'<div id="SPLU.FamilyHeading" style="display:table-cell;padding-bottom:5px;border-top-left-radius:20px;border-top-right-radius:20px;">'
                  +'<center>'
                    +'<a href="javascript:{void(0);}" onClick="javascript:{showFamilyTab();}">'+SPLUi18n.ExpansionsTabFamily+'</a>'
                  +'</center>'
                +'</div>'
              +'</div>'
            +'</div>'
            +'<div id="SPLU.ExpansionPane" style="overflow-y:auto;margin-top:10px;margin-bottom:10px;"></div>'
            +'<div id="SPLU.FamilyPane" style="overflow-y:auto;margin-top:10px;margin-bottom:10px;display:none;"></div>'
            +'<div id="SPLU.ExpansionPaneControls">'
              +'<div style="padding-top:10px;">'+SPLUi18n.ExpansionsQuantity+': '
                +'<div id="SPLU.fakeExpQtyBox" style="display:inline-block;padding:0px 2px; -moz-appearance:textfield; -webkit-appearance:textfield;">'
                  +'<input type="text" id="BRexpPlayQTY"/ value="0" style="width:40px;border:none;color:black;">'
                  +'<a href="javascript:{void(0);}" onClick="javascript:{saveExpansionQuantity();}" style="vertical-align:middle;" id="SPLU.SaveExpQtyButton"><img src="https://yucata-de.github.io/YucataPlayLoggerForBGG/Images/save.png"></a>'
                +'</div>'
                +'<div style="display:table; padding-top:10px;">'
                  +'<div style="display:table-row;">'
                    +'<div style="display:table-cell; padding-top:10px;">'
                      +'<a href="javascript:{void(0);}" onClick="javascript:{hidePopText();document.getElementById(\'BRlogExpansions\').style.display=\'none\';}" style="border:2px solid blue;padding:2px 4px;border-radius:5px;background-color:lightGrey;margin-top:10px;">'+SPLUi18n.ExpansionsButtonOkay+'</a>'
                    +'</div>'
                    +'<div style="display:table-cell; padding-top:10px; padding-left:10px;">'
                      +'<a href="javascript:{void(0);}" onClick="javascript:{clearExpansions();}" style="border:2px solid blue;padding:2px 4px;border-radius:5px;background-color:lightGrey;margin-top:10px;">'+SPLUi18n.ExpansionsButtonClear+'</a>'
                    +'</div>'
                    +'<div id="SPLU.ExpansionsPaneStatus" style="display:table-cell; padding-top:10px; padding-left:10px;">'
                  +'</div>'
                +'</div>'
              +'</div>'
            +'</div>'
          +'</form>';
    tmpDiv.innerHTML+=tmpHTML;
    BRlogExpansions.appendChild(tmpDiv);
    
    var BRlogLocations=document.createElement('div');
    BRlogLocations.id='BRlogLocations';
    BRlogLocations.setAttribute("style","display:none; background-color: #F5C86C; padding: 13px;border:2px solid #249631;border-radius:15px; box-shadow:10px 10px 5px #888; min-width:100px;position:relative;");
    var tmpDiv=document.createElement('div');
    var tmpHTML='<div id="hideLocationsButton" style="position: absolute; right: -2px; top: -3px;">'
        +'<a href="javascript:{void(0);}" onClick="javascript:{hidePopText();document.getElementById(\'BRlogLocations\').style.display=\'none\';}" style="border:2px solid #249631;padding:0px 8px;border-top-right-radius: 15px; border-bottom-left-radius: 5px;background-color:lightGrey;font-size:x-large;font-weight:900;color:red;"><img src="https://yucata-de.github.io/YucataPlayLoggerForBGG/Images/close_pane.png"></a>'
        +'</div>'
        +'<span style="font-variant:small-caps; font-weight:bold;">'
        +'<center>'+SPLUi18n.LocationsHeader+'</center>'
        +'<br/>'
        +'</span>'
        +'<div id="SPLU.LocationsList" style="overflow-y:auto;"></div>'
        +'<div style="padding-top:10px;display:inline;">'
        +'<a href="javascript:{void(0);}" class="SPLUbuttons" style="margin-right:6px;color:black;border:2px solid #249631">'+SPLUi18n.LocationsButtonSave+'</a>'
        +'<a href="javascript:{void(0);}" class="SPLUbuttons" style="color:black; border:2px solid #249631">'+SPLUi18n.LocationsButtonNew+'</a>'
        +'</div>'
        +'<div id="SPLU.LocationsStatus" style="display:inline;padding-left:5px;"></div>';
    tmpDiv.innerHTML+=tmpHTML;
    BRlogLocations.appendChild(tmpDiv);

    var BRlogPlayers=document.createElement('div');
    BRlogPlayers.id='BRlogPlayers';
    BRlogPlayers.setAttribute("style","display:none; background-color: #F7FB6F; padding: 13px;border:2px solid #00F; border-radius:15px; box-shadow:10px 10px 5px #888; min-width:275px;position:relative;");
    var tmpDiv=document.createElement('div');
    var tmpHTML='<div id="hidePlayersButton" style="position: absolute; right: -2px; top: -3px;">'
        +'<a href="javascript:{void(0);}" onClick="javascript:{hidePopText();showPlayersTab();document.getElementById(\'BRlogPlayers\').style.display=\'none\';}" style="border:2px solid #00F;padding:0px 8px;border-top-right-radius: 15px; border-bottom-left-radius: 5px;background-color:lightGrey;font-size:x-large;font-weight:900;color:red;"><img src="https://yucata-de.github.io/YucataPlayLoggerForBGG/Images/close_pane.png"></a>'
        +'</div>'
        +'<span style="font-variant:small-caps; font-weight:bold;">'
        +'<center>'+SPLUi18n.PlayersHeader+'</center>'
        +'<br/>'
        +'</span>'
        +'<div style="display: table; width: 254px;">'
        +'<div style="display:table-row;">'
        +'<div id="SPLU.PlayersHeading" style="display:table-cell; padding-bottom: 5px;border-top: 2px solid blue; border-top-left-radius: 20px; border-top-right-radius: 20px;">'
        +'<center>'
        +'<a href="javascript:{void(0);}" onClick="javascript:{showPlayersTab();}">'+SPLUi18n.PlayersTabPlayers+'</a>'
        +'</center>'
        +'</div>'
        +'<div id="SPLU.FiltersHeading" style="display:table-cell; padding-bottom: 5px;border-top-left-radius: 20px; border-top-right-radius: 20px;">'
        +'<center>'
        +'<a href="javascript:{void(0);}" onClick="javascript:{showFiltersTab();}">'+SPLUi18n.PlayersTabFilters+'</a>'
        +'</center>'
        +'</div>'
        +'<div id="SPLU.GroupsHeading" style="display:table-cell; padding-bottom: 5px;border-top-left-radius: 20px; border-top-right-radius: 20px;">'
        +'<center>'
        +'<a href="javascript:{void(0);}" onClick="javascript:{showGroupsTab();}">'+SPLUi18n.PlayersTabGroups+'</a>'
        +'</center>'
        +'</div>'
        +'</div>'
        +'<div style="display:table-row;">'
        +'<div id="SPLU.PlayersSubHeading" style="display: table-cell; height: 15px;">'
        +'<div id="SPLU.FiltersDeleteCell" style="display:none;">'
        +'<a href="javascript:{void(0);}" onClick="javascript:{removeFilter();}" style="vertical-align:middle; padding-right:5px;"><img src="https://yucata-de.github.io/YucataPlayLoggerForBGG/Images/delete_row_small.png"></a>'
        +'</div>'
        +'<div id="SPLU.GroupsDeleteCell" style="display:none;">'
        +'<a href="javascript:{void(0);}" onClick="javascript:{removeGroup();}" style="vertical-align:middle; padding-right:5px;"><img src="https://yucata-de.github.io/YucataPlayLoggerForBGG/Images/delete_row_small.png"></a>'
        +'</div>'
        +'</div>'
        +'<div id="SPLU.FiltersSubHeading" style="display: table-cell;">'
        +'<center>'
        +'<select id="SPLU.FiltersSubSelect" style="margin:2px;display:none;" onChange="javascript:{setFilter(\'edit\');}"></select>'
        +'</center>'
        +'</div>'
        +'<div id="SPLU.GroupsSubHeading" style="display: table-cell;">'
        +'<center>'
        +'<select id="SPLU.GroupsSubSelect" style="margin:2px;display:none;" onChange="javascript:{setGroup(\'edit\');}"></select>'
        +'</center>'
        +'</div>'
        +'</div>'
        +'<div id="SPLUgroupsFilterRow" style="display:none;">'
        +'</div>'
        +'</div>'
        +'<div style="display:table;">'
        +'<div style="display:table-row;">'
        +'<div style="display:table-cell;width:22px;">'
        +'</div>'
        +'<div style="display:table-cell;width:84px;"><center>'+SPLUi18n.PlayersName+' <a onclick=\"javascript:{ELsort.sort(ELsort.toArray().sort(function (a, b) {return a.toLowerCase().localeCompare(b.toLowerCase());}))}\" href=\"javascript:{void(0);}\"><i class=\"fa_SP fa_SP-sort-alpha-asc\"></i></a></center></div>'
        +'<div style="display:table-cell;width:84px;"><center>'+SPLUi18n.PlayersUsername+'</center></div>'
        +'<div style="display:table-cell;width:52px;" name="SPLUplayerEditColumn"><center>'+SPLUi18n.PlayersColor+'</center></div>'
        +'<div style="display:none;width:64px;" name="SPLUplayerFilterColumn"></div>'
        +'</div>'
        +'</div>'
        +'<div id="SPLU.PlayersList" style="overflow-y:auto; width: 280px;"></div>'
        +'<div id="SPLU.PlayersPaneControls">'
        +'<div style="padding-top:10px;">'
        +'<a href="javascript:{void(0);}" onClick="javascript:{savePlayers();}" class="SPLUbuttons" style="margin-right:6px;color:black;" id="SavePlayerListBtn">'+SPLUi18n.PlayersButtonSave+'</a>'
        +'<a href="javascript:{void(0);}" onClick="javascript:{addPlayer();}" class="SPLUbuttons" style="color:black;">'+SPLUi18n.PlayersButtonNew+'</a>'
        +'</div>'
        +'<div id="SPLU.PlayersStatus" style="display:inline;padding-left:5px;">'
        +'</div>'
        +'</div>'
        +'<div id="SPLU.FiltersPaneControls" style="display:none;">'
        +'<div style="padding-top:10px;">'
        +'<a href="javascript:{void(0);}" onClick="javascript:{saveFilters();}" class="SPLUbuttons" style="margin-right:6px;color:black;" id="SavePlayerFilterBtn">'+SPLUi18n.PlayersButtonSaveFilters+'</a>'
        +'<div id="SPLU.fakeFilterBox" style="display:inline-block;padding:0px 2px; -moz-appearance:textfield; -webkit-appearance:textfield;">'
        +'<input type="text" id="SPLU.NewFilterName" placeholder="'+SPLUi18n.PlayersPlaceholderAddFilter+'" style="width:100px;border:none;"></input>'
        +'<a href="javascript:{void(0);}" onClick="javascript:{addFilter();}" style="color:black;"><img src="https://yucata-de.github.io/YucataPlayLoggerForBGG/Images/green_circle_plus.png"></a>'
        +'</div>'
        +'</div>'
        +'<div id="SPLU.FiltersStatus" style="display:inline;padding-left:5px;"></div>'
        +'</div>'
        +'<div id="SPLU.GroupsPaneControls" style="display:none;">'
        +'<div style="padding-top:10px;"><a href="javascript:{void(0);}" onClick="javascript:{saveGroups();}" class="SPLUbuttons" style="margin-right:6px;color:black;" id="SavePlayerGroupsBtn">'+SPLUi18n.PlayersButtonSaveGroups+'</a>'
        +'<div id="SPLU.fakeGroupBox" style="display:inline-block;padding:0px 2px; -moz-appearance:textfield; -webkit-appearance:textfield;">'
        +'<input type="text" id="SPLU.NewGroupName" placeholder="'+SPLUi18n.PlayersPlaceholderAddGroup+'" style="width:100px;border:none;"></input>'
        +'<a href="javascript:{void(0);}" onClick="javascript:{addGroup();}" style="color:black;"><img src="https://yucata-de.github.io/YucataPlayLoggerForBGG/Images/green_circle_plus.png"></a>'
        +'</div>'
        +'</div>'
        +'<div id="SPLU.GroupsStatus" style="display:inline;padding-left:5px;"></div>'
        +'</div>';
    tmpDiv.innerHTML+=tmpHTML;
    BRlogPlayers.appendChild(tmpDiv);

    var BRlogPlays=document.createElement('div');
    BRlogPlays.id='BRlogPlays';
    BRlogPlays.setAttribute("style","display:none; background-color: #F1F8FB; padding: 13px;border:2px solid #249631;border-radius:15px; box-shadow:10px 10px 5px #888; min-width:100px;position:relative;");
    var tmpDiv=document.createElement('div');
    var tmpHTML='<div id="hidePlaysButton" style="position: absolute; right: -2px; top: -3px;">'
          +'<a href="javascript:{void(0);}" onClick="javascript:{hidePopText();document.getElementById(\'BRlogPlays\').style.display=\'none\';}" style="border:2px solid #249631;padding:0px 8px;border-top-right-radius: 15px; border-bottom-left-radius: 5px;background-color:lightGrey;font-size:x-large;font-weight:900;color:red;"><img src="https://yucata-de.github.io/YucataPlayLoggerForBGG/Images/close_pane.png"></a>'
        +'</div>'
        +'<span style="font-variant:small-caps; font-weight:bold;">'
          +'<center>'+SPLUi18n.PlaysHeader+'</center>'
        +'</span>'
        +'<div>'
          +'<input type="text" id="SPLU.PlaysLogger" value="'+LoggedInAs+'" onClick="javascript:{listFetchedPlayers();}" onKeyPress="eventPlaysPlayerEnter(event);"/>'
          +'<div style="display:inline-block; margin-left:2px;">'
            +'<div style="background-color:lightgrey;border:1px solid gray;border-radius:6px;padding:2px;cursor:pointer;height:19px"><span id="SPLU.GetNextText">'+SPLUi18n.PlaysGetNext+' 100</span> | <span  onclick="javascript:{if(document.getElementById(\'SPLUfetchDrop\').style.display==\'none\'){document.getElementById(\'SPLUfetchDrop\').style.display=\'\';}else{document.getElementById(\'SPLUfetchDrop\').style.display=\'none\';}}"><i style="margin-top: -3px; margin-right: 3px; padding: 4px 2px 0px;" class="fa_SP">&#xf078;</i></span></div>'
            +'<div style="position:absolute;border:1px solid blue;background-color:rgb(206,214,233);display:none;cursor:pointer;z-index: 1573;" id="SPLUfetchDrop">'
              +'<ul class="fa_SP-ul" style="padding-right:8px;">'
                +'<li style="background-color: rgb(206, 214, 233);" onClick="javascript:{getRecentPlays(true, -1);document.getElementById(\'SPLUfetchDrop\').style.display=\'none\';}" onmouseover="javascript:{this.style.backgroundColor=\'yellow\';}" onmouseout="javascript:{this.style.backgroundColor=\'rgb(206,214,233)\';}">'
                  +SPLUi18n.PlaysGetAll
                +'</li>'
                +'<li style="background-color: rgb(206, 214, 233);" onClick="javascript:{getGamePlays();document.getElementById(\'SPLUfetchDrop\').style.display=\'none\';}" onmouseover="javascript:{this.style.backgroundColor=\'yellow\';}" onmouseout="javascript:{this.style.backgroundColor=\'rgb(206,214,233)\';}">'
                  +SPLUi18n.PlaysGetGame
                +'</li>'
                +'<li style="background-color: rgb(206, 214, 233);" onClick="javascript:{getRecentPlays(false, -1);document.getElementById(\'SPLUfetchDrop\').style.display=\'none\';}" onmouseover="javascript:{this.style.backgroundColor=\'yellow\';}" onmouseout="javascript:{this.style.backgroundColor=\'rgb(206,214,233)\';}">'
                  +SPLUi18n.PlaysGetRecent
                +'</li>'
              +'</ul>'
            +'</div>'
          +'</div>'
          +'</div>'
        +'<div id="SPLU.PlaysPlayers" style="position: absolute; background-color: rgb(205, 237, 251); width: 126px; padding: 3px; border: 1px solid blue; display:none;z-index: 1575;">list</div>'
        +'<div id="SPLU.PlaysStatus" style="padding-bottom:5px;"></div>'
        +'<div id="SPLU.PlaysMenu">'
          +'<div id="SPLUfilterIconBtn" style="display:inline;padding-top:5px;border-top-left-radius:20px;border-top-right-radius:20px;">'
            +'<a href="javascript:{void(0);}" style="padding:0px 20px;" onClick="javascript:{showPlaysTab(\'filters\');loadPlays(document.getElementById(\'SPLU.PlaysLogger\').value,false);}">'
              +'<span style="color: black; transform: translate(0px, -2px); font-weight: bold;" class="fa_SP fa_SP-list-view" id="filtericon" style="margin-top:5px;"></span>'
            +'</a>'
          +'</div>'
          +'<div id="SPLUstatsIconBtn" style="display:inline;padding-top:5px;border-top-left-radius:20px;border-top-right-radius:20px;">'
            +'<a href="javascript:{void(0);}" style="padding:0px 20px;" onClick="javascript:{showPlaysTab(\'stats\');}"><img src="https://yucata-de.github.io/YucataPlayLoggerForBGG/Images/statistics.png" id="statisticsicon"></a>'
          +'</div>'
          +'<div id="SPLUcopyModeIconBtn" style="display:none;padding-top:5px;border-top-left-radius:20px;border-top-right-radius:20px;">'
            +'<a href="javascript:{void(0);}" style="padding:0px 20px;" onClick="javascript:{showPlaysTab(\'copymode\');loadPlays(document.getElementById(\'SPLU.PlaysLogger\').value,true);}"><img src="https://yucata-de.github.io/YucataPlayLoggerForBGG/Images/copy.gif" id="copymodeicon"></a>'
          +'</div>'
        +'</div>'
        +'<div id="SPLU.PlaysFilters" style="border: 1px solid blue; border-radius: 5px; padding: 3px;">'
          +'<div id="SPLU.PlaysFiltersStatus" style="float:right;"></div>'
          +'<div>'
            +'<div style="background-color:white;width:60%;border:1px solid gray;padding:2px;cursor:pointer;height:19px"  onclick="javascript:{document.getElementById(\'SPLUfilterDrop\').style.display=\'\';showDropMenu();}"><i class="fa_SP fa_SP-funnel"></i> '+SPLUi18n.PlaysFilterAddFilter+'<i style="float: right; padding: 1px 2px 0px;" class="fa_SP">&#xf078;</i></div>'
            +'<div style="position:absolute;border:1px solid blue;background-color:rgb(206,214,233);display:none;cursor:pointer;z-index: 1575;" id="SPLUfilterDrop">'
              +'<ul class="fa_SP-ul" style="padding-right:8px;">'
                +'<li style="background-color: rgb(206, 214, 233);" onClick="javascript:{addPlaysFilter(\'gamename\',\'\');}" onmouseover="javascript:{this.style.backgroundColor=\'yellow\';}" onmouseout="javascript:{this.style.backgroundColor=\'rgb(206,214,233)\';}">'
                  +'<i class="fa_SP fa_SP-li">&#xee01;</i>'+SPLUi18n.PlaysFilterGame+''
                +'</li>'
                +'<li style="background-color: rgb(206, 214, 233);" onClick="javascript:{addPlaysFilter(\'playername\',\'\');}" onmouseover="javascript:{this.style.backgroundColor=\'yellow\';}" onmouseout="javascript:{this.style.backgroundColor=\'rgb(206,214,233)\';}">'
                  +'<i class="fa_SP fa_SP-li">&#xf007;</i>'+SPLUi18n.PlaysFilterPlayer+''
                +'</li>'
                +'<li style="background-color: rgb(206, 214, 233);" onClick="javascript:{addPlaysFilter(\'username\',\'\');}" onmouseover="javascript:{this.style.backgroundColor=\'yellow\';}" onmouseout="javascript:{this.style.backgroundColor=\'rgb(206,214,233)\';}">'
                  +'<i style="transform: translate(1px, 1px);" class="fa_SP fa_SP-li display:block"></i>'+SPLUi18n.PlaysFilterUsername+''
                +'</li>'
                +'<li style="background-color: rgb(206, 214, 233);" onClick="javascript:{addPlaysFilter(\'location\',\'\');}" onmouseover="javascript:{this.style.backgroundColor=\'yellow\';}" onmouseout="javascript:{this.style.backgroundColor=\'rgb(206,214,233)\';}">'
                  +'<i class="fa_SP fa_SP-li">&#xf041;</i>'+SPLUi18n.PlaysFilterLocation+''
                +'</li>'
                +'<li style="background-color: rgb(206, 214, 233);" onClick="javascript:{addPlaysFilter(\'daterange\',\'\');}" onmouseover="javascript:{this.style.backgroundColor=\'yellow\';}" onmouseout="javascript:{this.style.backgroundColor=\'rgb(206,214,233)\';}">'
                  +'<i style="transform: translate(0.5px, 0px);" class="fa_SP fa_SP-li display:block"></i>'+SPLUi18n.PlaysFilterDateRange+''
                +'</li>'
                +'<li style="background-color: rgb(206, 214, 233);" onClick="javascript:{addPlaysFilter(\'winner\',\'\');}" onmouseover="javascript:{this.style.backgroundColor=\'yellow\';}" onmouseout="javascript:{this.style.backgroundColor=\'rgb(206,214,233)\';}">'
                  +'<i class="fa_SP fa_SP-li">&#xf091;</i>'+SPLUi18n.PlaysFilterWinner+''
                +'</li>'
                +'<li style="background-color: rgb(206, 214, 233);" onClick="javascript:{addPlaysFilter(\'new\',\'\');}" onmouseover="javascript:{this.style.backgroundColor=\'yellow\';}" onmouseout="javascript:{this.style.backgroundColor=\'rgb(206,214,233)\';}">'
                  +'<i style="transform: translate(1px, 0px);" class="fa_SP fa_SP-li display:block"></i>'+SPLUi18n.PlaysFilterNew+''
                +'</li>'
                +'<li style="background-color: rgb(206, 214, 233);" onClick="javascript:{addPlaysFilter(\'score\',\'\');}" onmouseover="javascript:{this.style.backgroundColor=\'yellow\';}" onmouseout="javascript:{this.style.backgroundColor=\'rgb(206,214,233)\';}">'
                  +'<i style="transform: translate(4px, 0px); font-size: 1.3em;" class="fa_SP fa_SP-li fa_SP-dartboard display:block"></i>'+SPLUi18n.PlaysFilterScore+''
                +'</li>'
                +'<li style="background-color: rgb(206, 214, 233);" onClick="javascript:{addPlaysFilter(\'duration\',\'\');}" onmouseover="javascript:{this.style.backgroundColor=\'yellow\';}" onmouseout="javascript:{this.style.backgroundColor=\'rgb(206,214,233)\';}">'
                  +'<i style="transform: translate(4px, 0px); font-size: 1.3em;" class="fa_SP fa_SP-li fa_SP-clock-o display:block"></i>'+SPLUi18n.PlaysFilterDuration+''
                +'</li>'
                +'<li style="background-color: rgb(206, 214, 233);" onClick="javascript:{addPlaysFilter(\'playercount\',\'\');}" onmouseover="javascript:{this.style.backgroundColor=\'yellow\';}" onmouseout="javascript:{this.style.backgroundColor=\'rgb(206,214,233)\';}">'
                  +'<i class="fa_SP fa_SP-li">&#xf0c0;</i>'+SPLUi18n.PlaysFilterPlayerCount+''
                +'</li>'
                +'<li style="background-color: rgb(206, 214, 233);" onClick="javascript:{addPlaysFilter(\'objecttype\',\'\');}" onmouseover="javascript:{this.style.backgroundColor=\'yellow\';}" onmouseout="javascript:{this.style.backgroundColor=\'rgb(206,214,233)\';}">'
                  +'<i class="fa_SP fa_SP-li">&#xee02;</i>'+SPLUi18n.PlaysFilterGameType+''
                +'</li>'
                +'<li style="background-color: rgb(206, 214, 233);" onClick="javascript:{addPlaysFilter(\'comments\',\'\');}" onmouseover="javascript:{this.style.backgroundColor=\'yellow\';}" onmouseout="javascript:{this.style.backgroundColor=\'rgb(206,214,233)\';}">'
                  +'<i class="fa_SP fa_SP-li">&#xf27b;</i>'+SPLUi18n.PlaysFilterComments+''
                +'</li>'
                +'<li style="background-color: rgb(206, 214, 233);" onClick="javascript:{addPlaysFilter(\'excludeexpansions\',\'\');}" onmouseover="javascript:{this.style.backgroundColor=\'yellow\';}" onmouseout="javascript:{this.style.backgroundColor=\'rgb(206,214,233)\';}">'
                  +'<i class="fa_SP fa_SP-li">&#xf0eb;</i>'+SPLUi18n.PlaysFilterExpansions+''
                +'</li>'
                +'<li style="background-color: rgb(206, 214, 233);" onClick="javascript:{addPlaysFilter(\'excludenowinstats\',\'\');}" onmouseover="javascript:{this.style.backgroundColor=\'yellow\';}" onmouseout="javascript:{this.style.backgroundColor=\'rgb(206,214,233)\';}">'
                  +'<i style="" class="fa_SP fa_SP-li fa_SP-ribbon-white-circle"></i>'+SPLUi18n.PlaysFilterNoWinStats+''
                +'</li>'
                +'<li style="background-color: rgb(206, 214, 233);" onClick="javascript:{addPlaysFilter(\'excludeincomplete\',\'\');}" onmouseover="javascript:{this.style.backgroundColor=\'yellow\';}" onmouseout="javascript:{this.style.backgroundColor=\'rgb(206,214,233)\';}">'
                  +'<i style="transform: translate(-1px, -1px);" class="fa_SP fa_SP-li display:block"></i>'+SPLUi18n.PlaysFilterIncomplete+''
                +'</li>'
              +'</ul>'
            +'</div>'
            +'<div id="SPLUdropMenuHider" style="position: absolute; top: -144px; z-index: 1570; left: -625px; display: none;" onclick="javascript:{hideDropMenus();}"></div>'
            +'<span id="SPLU.PlaysLoadingDiv" style="margin-left:20px;display:none;">'
              +'<img src="https://yucata-de.github.io/YucataPlayLoggerForBGG/Images/progress.gif">'
            +'</span>'
          +'<div id="SPLU.PlaysFiltersCurrent" style="width:250px;"></div>'
            +'<div id="SPLU.PlaysFiltersGoBtn"style="float:right;margin-top:-20px;margin-right:5px;display:none;">'
              +'<a href="javascript:{void(0);}" onClick="javascript:{loadPlays(document.getElementById(\'SPLU.PlaysLogger\').value,false);}">'+SPLUi18n.PlaysFilterButtonGo+'</a>'
            +'</div>'
          +'</div>'
        +'</div>'
        +'<div id="SPLU.PlaysList" style="overflow-y:auto; width:100%; margin-top: 3px"></div>'
        +'<div id="SPLUcopyPlaysDiv" style="display:none;padding-top:10px;">'
          +'<div class="BRcells" id="CopyPlaysSelectAllBtn">'
            +'<a href="javascript:{void(0);}" onClick="javascript:{copyPlaysSelectAll();}" style="border:2px solid blue;padding:5px 4px;border-radius:5px;background-color:lightGrey; color:black;"><img src="https://yucata-de.github.io/YucataPlayLoggerForBGG/Images/select-all.png" style="vertical-align: middle;"></a>'
          +'</div>'
          +'<div class="BRcells" id="CopyPlaysDeselectAllBtn" style="display:none;">'
            +'<a href="javascript:{void(0);}" onClick="javascript:{copyPlaysSelectAll();}" style="border:2px solid blue;padding:5px 4px;border-radius:5px;background-color:lightGrey; color:black;"><img src="https://yucata-de.github.io/YucataPlayLoggerForBGG/Images/deselect-all.png" style="vertical-align: middle;"></a>'
          +'</div>'
          +'<div class="BRcells">'
            +'<a href="javascript:{void(0);}" onClick="javascript:{copyPlays(0,200);}" style="border:2px solid blue;padding:5px 4px;border-radius:5px;background-color:lightGrey; color:black;" id="CopyPlaysBtn";><img src="https://yucata-de.github.io/YucataPlayLoggerForBGG/Images/copy.gif" style="vertical-align: middle;"> '+SPLUi18n.PlaysButtonCopySelected+'</a>'
          +'</div>'
          +'<div id="CopyPlaysStatus"></div>'
        +'</div>'
        +'<div id="SPLU.StatsMenu" style="display:none; margin-top: 3px;">'
          +SPLUi18n.StatsStat+': <select class="fa_SP" id="SPLU.SelectStat" onChange="javascript:{loadStats(\'choose\');}">'
            +'<option class="fa_SP" style="display:block;" value="PlaysWins" selected>&#xf091; '+SPLUi18n.StatsWins+'</option>'
            +'<option class="fa_SP" style="display:block;" value="WinsByGame">&#xf091; '+SPLUi18n.StatsWinsByGame+'</option>'
            +'<option class="fa_SP" style="display:block;" value="BeginnersLuck">&#x2618; '+SPLUi18n.StatsBeginnersLuck+'</option>'
            +'<option class="fa_SP" style="display:block;" value="GameList">&#xee34; '+SPLUi18n.StatsGameList+'</option>'
            +'<option class="fa_SP" style="display:block;" value="GameListRank">&#xee34; '+SPLUi18n.StatsGameListRank+'</option>'
            +'<option class="fa_SP" style="display:block;" value="GameDetails">&#xf201; '+SPLUi18n.StatsGameDetails+'</option>'
            +'<option class="fa_SP" style="display:block;" value="Locations">&#xf041; '+SPLUi18n.StatsLocations+'</option>'
            +'<option class="fa_SP" style="display:block;" value="GameDaysSince">&#xf272; '+SPLUi18n.StatsDaysSince+'</option>'
            +'<option class="fa_SP" style="display:block;" value="Duration">&#xf272; '+SPLUi18n.StatsGameDuration+'</option>'
          +'</select>'
          +'<span style="margin-left: 10px;" id="SPLUzeroScoreStatsDiv">'
            +SPLUi18n.StatsOptionIncludeZeros+':<input style="vertical-align: middle;" id="SPLUzeroScoreStatsCheck" onChange="javascript:{SPLUzeroScoreStats=document.getElementById(\'SPLUzeroScoreStatsCheck\').checked;loadPlays(document.getElementById(\'SPLU.PlaysLogger\').value,false);}" type="checkbox">'
          +'</span>'
          +'<span id="SPLUcsvDownload" style="margin-left:50px;vertical-align:top;">'
            +'<a href="javascript:{void(0);}" onClick="javascript:{SPLUdownloadText(\'SPLU-Export.csv\',SPLUcsv);}"><img src="https://yucata-de.github.io/YucataPlayLoggerForBGG/Images/save-csv.png""></a>'
          +'</span>'
          +'<div id="SPLU.StatsPlayerDiv" style="display: none;">'+SPLUi18n.PlaysFilterPlayer+': <select class="fa_SP" id="SPLU.SelectStatPlayer" onChange="javascript:{setWinsByGamePlayer(\'\');}"></select></div>'
        +'</div>'
        +'<div id="SPLU.StatsContent" style="display:none;overflow-y: auto; width: 315px; margin-top: 3px;"></div>'
        +'<div id="SPLU.BackupPlaysXML"><input type="button" value="Backup loaded plays to JSON text file" onClick="javascipt:{downloadPlaysJSON();}" /></div>';
    tmpDiv.innerHTML+=tmpHTML;
    BRlogPlays.appendChild(tmpDiv);
    
    BRlogRow.appendChild(BRlogDiv);
    BRlogRow.appendChild(BRlogSettings);
    BRlogRow.appendChild(BRlogExpansions);
    BRlogRow.appendChild(BRlogFavs);
    BRlogRow.appendChild(BRlogLocations);
    BRlogRow.appendChild(BRlogPlayers);
    BRlogRow.appendChild(BRlogPlays);
    BRlogMain.appendChild(BRlogRow);
    document.getElementById('SPLUmain').insertBefore(BRlogMain,document.getElementById('SPLUmain').firstChild);

    finalSetup();
    //End initSPLU()
  }
  
  function fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }
  
  function finalSetup(){
    loadPlayers();
    for (var key in SPLU.Settings) {
      if (SPLU.Settings.hasOwnProperty(key)) {
        try{
          if(SPLU.Settings[key].Visible){
            document.getElementById("SPLU."+key+"Check").checked=true;
          }else{
            if(key!="PopUpText" && key!="LocationList" && key!="WinComments" && key!="ExpansionComments" && key!="PlayerList" && key!="ExpansionQuantity" && key!="ExpansionDetails" && key!="SortPlayers" && key!="SortGroups" && key!="PlayerGroups" && key!="ExpansionWinStats" && key!="DefaultPlayer" && key!="DefaultLocation" && key!="ExpansionLinkParent" && key!="i18n" && key!="Favorites" && key!="FetchPlayCount"){
              if(key.slice(-6)=="Column"){
                document.getElementById('SPLU.'+key+'Header').style.display="none";
              }else{
                document.getElementById('SPLU.'+key).style.display="none";
              }
            }
            if(key=="LocationList"){
              document.getElementById('SPLU.LocationList').style.display="none"; LocationList=false;
              document.getElementById('SPLU.LocationButtonIconExpand').style.display="inline-block";
              document.getElementById('SPLU.LocationButtonIconCollapse').style.display="none";
            }
            if(key=="PlayerList"){
              hidePlayers();
            }
            if(key=="SortPlayers"&&SPLU.Settings[key].Order=="Alpha"){
              document.getElementById("SPLU.SortPlayersAlphaCheck").checked=true;
            }
            if(key=="SortGroups"&&SPLU.Settings[key].Order=="Alpha"){
              document.getElementById("SPLU.SortGroupsAlphaCheck").checked=true;
            }
            if(key=="PlayerFilters"){
              document.getElementById("SPLU.FiltersHeading").style.display="none";
            }
            if(key=="PlayerGroups"){
              document.getElementById("SPLU.GroupsHeading").style.display="none";
            }
            if(key=="ExpansionDetails"){
              document.getElementById("SPLU.ExpansionDetailsCheck").checked=SPLU.Settings.ExpansionDetails.Include;
            }
            if(key=="ExpansionWinStats"){
              document.getElementById("SPLU.ExpansionWinStatsCheck").checked=SPLU.Settings.ExpansionWinStats.Enabled;
            }
            if(key=="ExpansionLinkParent"){
              document.getElementById("SPLU.ExpansionLinkParentCheck").checked=SPLU.Settings.ExpansionLinkParent.Enabled;
            }
            if(key=="FetchPlayCount" && SPLU.Settings[key].Enabled){
              document.getElementById("SPLU."+key+"Check").checked=true;
            }
          }
          if(key=="TwitterField"){
            document.getElementById("SPLU.TwitterEnabledCheck").checked=SPLU.Settings.TwitterField.Enabled;
            document.getElementById("twitter").checked=SPLU.Settings.TwitterField.Enabled;
            setTwitterIcons();
          }
        }catch(err){
          console.log(err)
        }
        if(SPLU.Settings[key].Reset){
          document.getElementById("SPLU."+key+"Reset").checked=true;
        }
      }
    }
    
    //Set the ObjectType to "boardgame" first in case the domain doesn't match those below.
    setObjectType("boardgame");
    //Set the ObjectType according to the site they are currently on
    if(window.location.host.slice(-17)=="boardgamegeek.com"){
      setObjectType("boardgame");
    }
    if(window.location.host.slice(-17)=="videogamegeek.com"){
      setObjectType("videogame");
    }
    if(window.location.host.slice(-11)=="rpggeek.com"){
      setObjectType("rpgitem");
    }
    
    getGameID();
    loadGroups();
    loadDefaultPlayersList();
    loadDefaultLocationList();
    loadFavoritesThumbSizeList();


    setPlayers("reset");
    setLocation("reset");
  }
  
  function setPlayers(action){
    tmpName=SPLU.Settings.DefaultPlayer.Name;
    if(action=="reset"){
      if(tmpName!="-none-"){
        if(tmpName=="-blank-"){
          insertPlayer(-1);
        } else {
          if(tmpName.slice(0,6)=="group-"){
            insertGroup(tmpName.slice(6));
          } else {
            insertPlayer(tmpName);
          }
        }
      }
    }
    if(action=="blank"){
      insertPlayer(-1);
    }
  }

  function setLocation(action){
    tmpName=SPLU.Settings.DefaultLocation.Name;
    if(action=="reset"){
      if(tmpName=="-blank-"){
      } else {
        if(SPLU.Settings.LocationList.Visible){
          insertLocation(tmpName,false);
        } else {
          insertLocation(tmpName,true);
        }
      }
    }
  }

  function setTwitterIcons(){
    var tmpIcons=document.getElementsByClassName('SPLUtwitterIcon');
    var tmpDisplay="none";
    if(document.getElementById("twitter").checked){
      tmpDisplay="";
    }
    for(i=0;i<tmpIcons.length;i++){
      tmpIcons[i].style.display=tmpDisplay;
    }
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
      "ExpansionComments":{"Visible":false},
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
    }
  }
  

  function compareSPLU(){
    SPLUtemp=SPLU;
    SPLU = {
      "Version":SPLUversion,
      "Favorites":{},
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
    for(key in SPLU){
      if(SPLUtemp[key]===undefined){
        SPLUtemp[key]=SPLU[key];
      }
    }
    for(key in SPLU.Settings){
      if(SPLUtemp.Settings[key]===undefined){
        SPLUtemp.Settings[key]=SPLU.Settings[key];
      }
      for(key2 in SPLU.Settings[key]){
        if(SPLUtemp.Settings[key][key2]===undefined){
          SPLUtemp.Settings[key][key2]=SPLU.Settings[key][key2];
        }
      }
    }
    SPLU=SPLUtemp;
    return;
  }

  function verifyData(){
    SPLUverifySave=false;
    SPLUverifyDefaultPlayer=false;
    for (var key in SPLU.Players) {
      if (SPLU.Players.hasOwnProperty(key)) {
        //console.log(key);
        if (SPLU.Settings.DefaultPlayer.Name==key){
          SPLUverifyDefaultPlayer=true;
          //console.log("Default Player Found: "+key);
        }
      }
    }
    for (var key in SPLU.Groups) {
      if (SPLU.Groups.hasOwnProperty(key)) {
        //console.log(key);
        if (SPLU.Settings.DefaultPlayer.Name=="group-"+key){
          SPLUverifyDefaultPlayer=true;
          //console.log("Default Player Found: group-"+key);
        }
      }
    }
    if (!SPLUverifyDefaultPlayer){
      console.log("Default Player not found, resetting to -blank-");
      SPLU.Settings.DefaultPlayer.Name="-blank-";
      SPLUverifySave=true;
    }
    try{
      if (SPLU.Locations[SPLU.Settings.DefaultLocation.Name]===undefined && SPLU.Settings.DefaultLocation.Name != "-blank-"){
        console.log("location not found, setting to -blank-");
        SPLU.Settings.DefaultLocation = {};
        SPLU.Settings.DefaultLocation.Name="-blank-";
        SPLUverifySave=true;
      }else{
        //console.log("location found: "+SPLU.Settings.DefaultLocation.Name);
      }
    }catch(err){
          console.log(err)
    }
    // Look for Location names that can't be decoded and remove the %'s so that the user can fix them manually.
    for (var keyL in SPLU.Locations) {
      try{
        decodeURIComponent(SPLU.Locations[keyL].Name);
      }catch(err){
        console.log(err);
        SPLU.Locations[keyL].Name = SPLU.Locations[keyL].Name.replace(/%/g, "");
        SPLUverifySave=true;
      }
    }
    for (var keyG in SPLU.Groups) {
      if (SPLU.Groups.hasOwnProperty(keyG)) {
        //console.log(keyG);
        for (i=SPLU.Groups[keyG].length-1; i>=0; i--){
          //console.log(" - "+SPLU.Groups[keyG][i]);
          var SPLUtmpVerify=false;
          for (var key in SPLU.Players) {
            if (SPLU.Players.hasOwnProperty(key)) {
              if (SPLU.Groups[keyG][i]==key){
                SPLUtmpVerify=true;
                //console.log("Group Player Found: "+key);
                break;
              }
            }
          }
          if (!SPLUtmpVerify){
            console.log("Group Player Not Found, Removing");
            SPLU.Groups[keyG].splice(i, 1);
            SPLUverifySave=true;
          }
        }
      }
    }
    for (var keyF in SPLU.Filters) {
      if (SPLU.Filters.hasOwnProperty(keyF)) {
        //console.log(keyF);
        for (i=SPLU.Filters[keyF].length-1; i>=0; i--){
          //console.log(" - "+SPLU.Filters[keyF][i]);
          var SPLUtmpVerify=false;
          for (var key in SPLU.Players) {
            if (SPLU.Players.hasOwnProperty(key)) {
              if (SPLU.Filters[keyF][i]==key){
                SPLUtmpVerify=true;
                //console.log("Filter Player Found: "+key);
                break;
              }
            }
          }
          for (var key in SPLU.Groups) {
            if (SPLU.Groups.hasOwnProperty(key)) {
              if (SPLU.Filters[keyF][i]=="group-"+key){
                SPLUtmpVerify=true;
                //console.log("Filter Player Found: group-"+key);
                break;
              }
            }
          }
          if (!SPLUtmpVerify){
            console.log("Filter Player Not Found, Removing");
            SPLU.Filters[keyF].splice(i, 1);
            SPLUverifySave=true;
          }
        }
      }
    }
    if (SPLUverifySave){
      console.log("Invalid data found and removed. Settings need to be saved.");
      //document.getElementById('BRresults').innerHTML=SPLUi18n.StatusInvalidDataFoundandRemoved;
      return true;
    }else{
      console.log("Settings look fine.");
      return false;
    }
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
          }
          xmlhttp=new XMLHttpRequest();
          xmlhttp.onload=function(){
            //var tmp2="";
            //var oReq2 = new XMLHttpRequest();
            //oReq2.onload = function(){
              //tmp2=this.responseXML;
              SPLUplayId=JSON.parse(xmlhttp.response).playid
              //SPLUplayId=tmp2.getElementsByTagName("play")[0].id;
              fetchLanguageFileQ(SPLU.Settings.i18n);
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
        var invalidData = verifyData();
        SPLUplayId=tmp.plays[0].playid;
        SPLUremote=SPLU;
        if(SPLUversion != SPLU.Version){
          console.log("Different Versions");
          compareSPLU();
          SPLU.Version=SPLUversion;
          delete SPLU.GameStats;
          tmp=SPLUi18n.StatusVersionUpdatedTo+SPLU.Version;
          saveSooty("BRresults",SPLUi18n.StatusUpdatingVersion,tmp,function(){
            fetchLanguageFileQ(SPLU.Settings.i18n);
          });
        }else{
          fetchLanguageFileQ(SPLU.Settings.i18n);
          //Update the saved data if invalid settings were found, but we don't need to if we've updated the version as it will save the new data anyways.
          if (invalidData){
            saveSooty("BRresults",SPLUi18n.StatusThinking,SPLUi18n.StatusInvalidDataFoundandRemoved,function(){});
          }
        }
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
        const url = `https://yucata-de.github.io/YucataPlayLoggerForBGG/Source%20Code/i18n/${tmpArgs.language}.json`;
        const options = {};  //Setting headers here seems to trigger CORS
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

  async function fetchLanguageListQ() {
    //Call this function to add the item to the queue
    console.log('fetchLanguageListQ()');
    SPLUqueue.push({
      "action":fetchLanguageList, 
      "arguments":{},
      "direction":"fetch",
      "data":"",
      "response":"",
      "attempt":0,
      "finish":fetchLanguageListFinish
    });
    runQueue();
  }
  
  async function fetchLanguageList(tmpArgs) {
    //This function is called by runQueue() when processing the queue item
    console.log("fetchLanguageList() - ", tmpArgs);
    try {
        const url = `https://yucata-de.github.io/YucataPlayLoggerForBGG/Source%20Code/i18n/list.json`;
        const options = {};  //Setting headers here seems to trigger CORS
        return await fetchDataJSON(url, options);
    } catch(e) {
      //This shows on bad URLs?
        console.log("catcherror", e); 
    }
  }






  function setObjectType(type){
    console.log("setObjectType("+type+");");
    SPLUexpansionsLoaded=false;
    SPLUfamilyLoaded=false;
    if(type=="boardgame"){
      SPLUobjecttype="boardgame";
    }
    if(type=="videogame"){
      SPLUobjecttype="videogame";
    }
    if(type=="rpg"){
      SPLUobjecttype="rpg";
    }
    if(type=="rpgitem"){
      SPLUobjecttype="rpgitem";
    }
    clearSearchResult();
  }
  function getGameID(){
    var metas=document.getElementsByTagName('meta');
    for(i=0;i<metas.length;i++){
      if(metas[i].getAttribute("name")=="og:image"){
        var thumbDiv='<a><img src="'+metas[i].getAttribute("content").slice(0,-4)+'_mt'+metas[i].getAttribute("content").slice(-4)+'"/></a>';
      }
      if(metas[i].getAttribute("name")=="og:url"){
        SPLUgameID=metas[i].getAttribute("content").substring((metas[i].getAttribute("content").lastIndexOf("/")+1));
        document.getElementById('selimage9999').innerHTML=thumbDiv;
        return SPLUgameID;
      }
    }
    return "";
  }
  function loadPlayers(){
    var players=[];
    // if(SPLU.Settings.SortPlayers.Order=="Alpha"){
      // players=Object.keys(SPLU.Players).sort();
    // }else{
      players=Object.keys(SPLU.Players);
    // }
    if(SPLUcurrentFilter!="All" && SPLUcurrentFilter!="Groups"){
      var tmpPlayers=[];
      for(i=0;i<players.length;i++){
        if(SPLU.Filters[SPLUcurrentFilter].indexOf(players[i])!=-1){
          tmpPlayers.push(players[i]);
        }
      }
      players=tmpPlayers;
    }
    if(SPLUcurrentFilter!="Groups"){
      for(key=0;key<players.length;key++){
        if (SPLU.Players.hasOwnProperty(players[key])) {
          BRtmpName=decodeURIComponent(SPLU.Players[players[key]].Name);
          if(SPLU.Players[players[key]].Name==""){
            BRtmpName=decodeURIComponent(SPLU.Players[players[key]].Username);
          }
        }
      }
          }
    if(SPLU.Settings["PlayerGroups"].Visible){
      var groups=[];
      if(SPLU.Settings.SortGroups.Order=="Alpha"){
        groups=Object.keys(SPLU.Groups).sort();
      }else{
        groups=Object.keys(SPLU.Groups);
      }
      for(key=0;key<groups.length;key++){
        BRtmpName=decodeURIComponent(groups[key]);
      }
    }
  }
  function loadGroups(){
    var select=document.getElementById('SPLU.GroupsSubSelect');
    select.options.length=0;
    var i=0;
    for(var key in SPLU.Groups){
      if (SPLU.Groups.hasOwnProperty(key)) {
        if(SPLUcurrentGroup==key){
          select.options[i]=new Option(key, key, false, true);
        }else{
          select.options[i]=new Option(key, key, false, false);
        }
        i++;
      }
    }
  }
  function loadDefaultPlayersList(){
    select=document.getElementById('SPLU.SelectDefaultPlayer');
    tmpName=SPLU.Settings.DefaultPlayer.Name;
    select.options.length=0;
    if(tmpName=="-none-"){
      select.options[0]=new Option("-"+SPLUi18n.SettingsNone+"-", "-none-", false, true);
    } else {
      select.options[0]=new Option("-"+SPLUi18n.SettingsNone+"-", "-none-", false, false);
    }
    if(tmpName=="-blank-"){
      select.options[1]=new Option("-"+SPLUi18n.SettingsBlank+"-", "-blank-", false, true);
    } else {
      select.options[1]=new Option("-"+SPLUi18n.SettingsBlank+"-", "-blank-", false, false);
    }
    var i=2;
    for(var key in SPLU.Players){
      if (SPLU.Players.hasOwnProperty(key)) {
        if(tmpName==key){
          select.options[i]=new Option(decodeURIComponent(SPLU.Players[key].Name), key, false, true);
        }else{
          select.options[i]=new Option(decodeURIComponent(SPLU.Players[key].Name), key, false, false);
        }
        i++;
      }
    }
    for(var key in SPLU.Groups){
      if (SPLU.Groups.hasOwnProperty(key)) {
        if(tmpName=="group-"+key){
          select.options[i]=new Option("["+key+"]", "group-"+key, false, true);
        }else{
          select.options[i]=new Option("["+key+"]", "group-"+key, false, false);
        }
        i++;
      }
    }
  }
  function insertPlayer(player){
    console.log("insertPlayer()");
    NumOfPlayers++;
    PlayerCount++;
    tmpName="";
    tmpUser="";
    tmpColor="";
    tmpStart="";
    tmpScore="";
    tmpRating="";
    tmpWin="";
    tmpNew="";
    if(typeof player=="object"){
      if(player.uplayerid===undefined){
        tmpName=player.attributes.name.value;
        tmpUser=player.attributes.username.value;
        tmpColor=player.attributes.color.value;
        tmpStart=player.attributes.startposition.value;
        tmpScore=player.attributes.score.value;
        tmpRating=player.attributes.rating.value;
        if(tmpRating==0){
          tmpRating=="";
        }
        if(player.attributes.win.value==1){
          tmpWin="checked";
        }
        if(player.attributes.new.value==1){
          tmpNew="checked";
        }
      }else{
        tmpName=player.name;
        tmpUser=player.username;
        tmpColor=player.color;
        tmpStart=player.position;
        tmpScore=player.score;
        tmpRating=player.rating;
        if(tmpRating==0){
          tmpRating=="";
        }
        if(player.win==1){
          tmpWin="checked";
        }
        if(player.new==1){
          tmpNew="checked";
        }
        if(player.username==null){
          tmpUser="";
        }
      }
    } else if(player!=-1){
      tmpName=decodeURIComponent(SPLU.Players[player].Name);
      tmpUser=decodeURIComponent(SPLU.Players[player].Username);
      tmpColor=decodeURIComponent(SPLU.Players[player].Color);
    } else if(SPLU.Players[player]===undefined && player!=-1){
      console.log(player+" does not exist.");
      return;
    }
    var paddedNum=NumOfPlayers+"";
    while(paddedNum.length<2){
      paddedNum="0"+paddedNum;
    }
    if(NumOfPlayers==2){
      if(document.getElementsByName("players[1][name]")[0].value==""&&document.getElementsByName("players[1][username]")[0].value==""&&document.getElementsByName("players[1][color]")[0].value==""){
        removePlayerRow(1);
      }
    }
    // SPLUdragDiv=-1;
    
   SPLUsetFieldWidthDelay();
  }
  var SPLUsetFieldWidthDelayTimeout;    
  function SPLUsetFieldWidthDelay() {
    if ( SPLUsetFieldWidthDelayTimeout ) {
      clearTimeout( SPLUsetFieldWidthDelayTimeout );
      SPLUsetFieldWidthDelayTimeout = setTimeout( setAllFieldWidths, 500 );
    } else {
      SPLUsetFieldWidthDelayTimeout = setTimeout( setAllFieldWidths, 500 );
    }
  }
  function setFieldWidth(field) {
    console.log("setFieldWidth(" + field + ")");
    tmpfields=document.querySelectorAll("[data-spluplayerfield='"+field+"']");
    //console.log(tmpfields);
    tmpmax = 1;
    for(i=0; i<tmpfields.length; i++){
      if(tmpfields[i].value.length > tmpmax){
        tmpmax=tmpfields[i].value.length;
      }
    }
    for(i=0; i<tmpfields.length; i++){
      tmpfields[i].size=tmpmax;
    }
  }
  function setAllFieldWidths() {
    setFieldWidth("name");
    setFieldWidth("username");
    setFieldWidth("color");
    setFieldWidth("startposition");
    setFieldWidth("score");
    setFieldWidth("rating");
  }
  function saveSooty(statusID, statusLoading, statusSuccess, onloadFunction){
    console.log("saveSooty()");
    tmpSettings=JSON.stringify(SPLUremote);
    console.log("Settings Size: "+tmpSettings.length);
    //Check if their settings will overflow the 64KB comment limit on BGG.
    if(tmpSettings.length>65500){
      alert("Your saved settings are using too much space to be saved: "+tmpSettings.length+" bytes.\nPlease delete a favorite and try again.");
      document.getElementById(statusID).innerHTML="<img style='vertical-align:bottom;padding-top:5px;' src='https://yucata-de.github.io/YucataPlayLoggerForBGG/Images/alert.gif'><span style='background-color:red;color:white;font-weight:bold;'>"+SPLUi18n.StatusErrorOccurred+"</span>";
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
          document.getElementById(statusID).innerHTML="<img style='vertical-align:bottom;padding-top:5px;' src='https://yucata-de.github.io/YucataPlayLoggerForBGG/Images/alert.gif'><span style='background-color:red;color:white;font-weight:bold;'>"+SPLUi18n.StatusErrorCode+": "+responseJSON.target.status+"</span>";
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
  function loadDefaultLocationList(){
    select=document.getElementById('SPLU.SelectDefaultLocation');
    tmpName=SPLU.Settings.DefaultLocation.Name;
    select.options.length=0;
    if(tmpName=="-blank-"){
      select.options[0]=new Option("-"+SPLUi18n.SettingsBlank+"-", "-blank-", false, true);
    } else {
      select.options[0]=new Option("-"+SPLUi18n.SettingsBlank+"-", "-blank-", false, false);
    }
    var i=1;
    for(var key in SPLU.Locations){
      if (SPLU.Locations.hasOwnProperty(key)) {
        if(tmpName==key){
          select.options[i]=new Option(decodeURIComponent(SPLU.Locations[key].Name), key, false, true);
        }else{
          select.options[i]=new Option(decodeURIComponent(SPLU.Locations[key].Name), key, false, false);
        }
        i++;
      }
    }
  }  
  function loadFavoritesThumbSizeList(){
    select=document.getElementById('SPLU.SelectFavoritesThumbSize');
    tmpName=SPLU.Settings.Favorites.ThumbSize;
    select.options.length=0;
    if(tmpName=="tallthumb"){
      select.options[0]=new Option("tallthumb (75x125)", "tallthumb", false, true);
    } else {
      select.options[0]=new Option("tallthumb (75x125)", "tallthumb", false, false);
    }
    if(tmpName=="micro"){
      select.options[1]=new Option("micro (64x64)", "micro", false, true);
    } else {
      select.options[1]=new Option("micro (64x64)", "micro", false, false);
    }
    if(tmpName=="off"){
      select.options[2]=new Option("off (0x0)", "off", false, true);
    } else {
      select.options[2]=new Option("off (0x0)", "off", false, false);
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
    xhr.open("GET", "https://www.boardgamegeek.com/xmlapi2/plays?username=" + bggLoggedInUser + "&page=" + iPage);
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
              for (var i = 0; i < x.files.length; i++) {
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
          }
        } else {
          addToLog(getLogEntry("Select a file containing the Yucata plays !", LOG_ENTRY_TYPE.ERROR));
          stopProcessing();
        }
      } else {
        for (var i = 0; i < res.childNodes[0].childNodes.length; i++) {
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
        doStop = false
      }
    } else if (aOldYucataGameIds.indexOf(oYucataPlay.GameId) !== -1) {
      addToLog(getYucataPlayLogEntry(oYucataPlay.GameId, oYucataPlay.GameTypeName, "Already logged   ('" + oYucataPlay.CustomGameName + "')", LOG_ENTRY_TYPE.INFO));
      if (doStop !== true) {
        setTimeout(function(){ saveNewGamePlays(oldYucataGameIdsIndex + 1); }, 10); // user setTimeout so progress indicator can be updated
      } else {
        doStop = false
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
          saveNewGamePlays(oldYucataGameIdsIndex + 1);
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
        return 144587;
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
      case 59: // Black Friday
        return 39242;
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
        return 4390;
      case 141: // Carcassonne H&G2
        return 4390;
      case 150: // Carcassonne South Seas
        return 147303;
      case 40: // Carolus Magnus
        return 481;
      case 329: // Carpe Diem
        return 245934;
      case 98: // Carson City
        return 39938;
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
      case 23: // Gobang & Gomoku2
        return 11929;
      case 358: // Gobang & Gomoku2
        return 11929;
      case 360: // Grand Austria Hotel
        return 182874;
      case 327: // Ground Floor
        return 255659;
      case 140: // Guildhall
        return 132372;
      case 11: // Hacienda
        return 19100;
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
        return 153004;
      case 361: // Lemminge2
        return 153004;
      case 352: // Lift Off
        return 260757;
      case 302: // Lords of War
        return 135215;
      case 362: // Lorenzo
        return 203993;
      case 75: // Luna
        return 70512;
      case 153: // Macao
        return 55670;
      case 336: // Machi Koro
        return 143884;
      case 57: // Maori
        return 40425;
      case 22: // Masons
        return 21791;
      case 8: // Morris
        return 3886;
      case 101: // Mount Drago
        return 89918;
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
        return 201;
      case 146: // Rose King2
        return 201;
      case 127: // Russian Railroads
        return 144733;
      case 142: // Russian Railroads2
        return 144733;
      case 27: // Saint Petersburg
        return 9217;
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
        return 27173;
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
        return 434;
      case 300: // Yucata2
        return 434;
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
