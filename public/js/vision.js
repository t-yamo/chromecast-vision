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

// $(foo).data is not same as HTML5 data-*. We use HTML5 data-* for save precitions of number.
// // http://tokkono.cute.coocan.jp/blog/slow/index.php/xhtmlcss/html5-data-attributes-vs-jquery-data-api/
$(function() {

  var socket = new io.connect("/");

  socket.on("connect", function() {
    socket.emit("join");
  });

  socket.on("initialized", function(data) {
    addMsg("system", "SYSTEM", "[" + data.name + "] set vision to " + data.videoId + ".");
    play(data.videoId, data.startTime, data.startTstamp)
  });

  socket.on("push", function(data) {
    addMsg(data.actor, data.name, data.msg);
  });

  socket.on("changed", function(data) {
    addMsg("system", "SYSTEM", "[" + data.name + "] changed vision to " + data.videoId + ".");
    play(data.videoId, data.startTime, data.startTstamp);
  });

  function addMsg(actor, name, msg) {
    var lineName = $("<div>").addClass("line-name").addClass(actor).text(name);
    var lineMsg = $("<div>").addClass("line-msg").text(msg);
    var lineClearfix = $("<div>").addClass("clearfix");
    var line = $("<div>").addClass("line").append(lineName).append(lineMsg).append(lineClearfix);
    line.prependTo($("#boxMsg"));
    $("#boxMsg > div").each(function(index, elem) {
      if (index >= 30) {
        $(elem).remove();
      }
    });
  }

});

