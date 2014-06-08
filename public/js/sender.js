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

// NEED applicationId
var ccSession = null;

if (!chrome.cast || !chrome.cast.isAvailable) {
  setTimeout(ccInitializeCastApi, 1000);
}

function ccInitializeCastApi() {
  var sessionRequest = new chrome.cast.SessionRequest(applicationId);
  var apiConfig = new chrome.cast.ApiConfig(sessionRequest, ccSessionListener, ccReceiverListener);
  chrome.cast.initialize(apiConfig, onCcInitSuccess, onCcError);
}

function onCcInitSuccess() {
  console.log("onCcInitSuccess");
}

function onCcError(err) {
  console.log("onCcError");
  console.dir(err);
}

function ccSessionListener(e) {
  console.log("ccSessionListener");
  ccSession = e;
}

function ccReceiverListener(e) {
  if (e === chrome.cast.ReceiverAvailability.AVAILABLE) {
    console.log("ccReceiveListener: Receiver was found");
  } else {
    console.log("ccReceiveListener: No receiver was found");
  }
}

function ccLaunchApp() {
  console.log("ccLaunchApp");
  chrome.cast.requestSession(onCcRequestSessionSuccess, onCcError);
}

function onCcRequestSessionSuccess(e) {
  console.log("onCcRequestSessionSuccess");
  ccSession = e;
}

function ccStopApp() {
  console.log("ccStopApp");
  ccSession.stop(onCcStopAppSuccess, onCcError);
}

function onCcStopAppSuccess() {
  console.log("onCcStopAppSuccess");
}

