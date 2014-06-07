/**
Copyright (C) 2014 t_yamo@unknown-artifacts.info

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/

"use strict";

var castReceiverManager = null;

window.onload = function() {
  cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.DEBUG);
  castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
  castReceiverManager.onSenderConnected = function(e) {
    console.log("castReceiverManager.onSenderConnected");
  }
  castReceiverManager.onSenderDisconnected = function(e) {
    console.log("castReceiverManager.onSenderDisconnected");
    var senders = castReceiverManager.getSenders();
    if (senders.length == 0 && e.reason == cast.receiver.system.DisconnectReason.REQUESTED_BY_SENDER) {
      window.close();
    }
  }
  var appConfig = new cast.receiver.CastReceiverManager.Config();
  appConfig.statusText = "Ready to play";
  appConfig.maxInactivity = 6000;
  castReceiverManager.start(appConfig);
}

var tag = document.createElement("script");
tag.src = "//www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var ytPlayer = null;

function onYouTubeIframeAPIReady() {
  console.log("onYouTubeIframeAPIReady");
  initializePlayer();
}

function initializePlayer() {
  ytPlayer = createPlayer("player", {
    onReady: onPlayerReady,
    onStateChange: onPlayerStateChange,
    onError: onPlayerError
  });
}

function createPlayer(name, eventsParams) {
  return new YT.Player(name, {
    width: "70%",
    height: "100%",
    playerVars: createPlayerVarsParams(),
    events: eventsParams
  });
}

function createPlayerVarsParams() {
  // https://developers.google.com/youtube/player_parameters?playerVersion=HTML5&hl=ja
  var playerVarsParams = {};
  playerVarsParams["autoplay"] = 1;
  playerVarsParams["controls"] = 0;
  playerVarsParams["disablekb"] = 1;
  playerVarsParams["enablejsapi"] = 1;
  playerVarsParams["fs"] = 0;
  playerVarsParams["iv_load_policy"] = 3;
  playerVarsParams["rel"] = 0;
  return playerVarsParams;
}

var ytInitialized = false;
function onPlayerReady(event) {
  console.log("onPlayerReady [" + event.target.a.id + "]");
  ytInitialized = true;
}

function play(videoId, startTime) {
  console.log("play [" + videoId + "] from [" + startTime + "]sec");
  var kickTime = getTime();
  var playTimer = setInterval(function() {
    if (ytInitialized) {
      clearInterval(playTimer);
      ytPlayer.loadVideoById({
        videoId: videoId,
        startSeconds: startTime + ((getTime() - kickTime) / 1000)
      });
    }
  }, 500); 
}

function getTime() {
  return (new Date()).getTime();
}

function onPlayerError(event) {
  // refs. https://developers.google.com/youtube/iframe_api_reference?hl=ja#Events
  console.log("onPlayerError [" + event.target.a.id + "][" + event.data + "]");
  var errorCode = event.data;
  if (errorCode == 2) {
    console.log("Error:" + errorCode + ": Invalid parameter.");
  } else if (errorCode == 100) {
    console.log("Error:" + errorCode + ": This video has been removed or has been marked private.");
  } else if (errorCode == 101) {
    console.log("Error:" + errorCode + ": This video does not allow it to be played in emmbeded players.");
  } else if (errorCode == 150) {
    console.log("Error:" + errorCode + ": This video does not allow it to be played in emmbeded players.");
  } else {
    console.log("Error:" + errorCode);
  }
}

function onPlayerStateChange(event) {
  // refs. https://developers.google.com/youtube/iframe_api_reference?hl=ja#Events
  console.log("onPlayerStateChange [" + event.target.a.id + "][" + event.data + "]");
  // event.data
  // 0 YT.PlayerState.ENDED
  // 1 YT.PlayerState.PLAYING
  // 2 YT.PlayerState.PAUSED
  // 3  BUFFERING
  // 5  CUED
  // -1 not started
}

