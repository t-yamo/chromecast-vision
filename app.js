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
*/

// node app.js
// NODE_ENV=production node app.js
// CC_APPLICATION_ID=123123123 node app.js
var express = require("express"),
  path = require("path"),
  ect = require("ect"),
  port = process.env.PORT || 53939,
  ccApplicationId = process.env.CC_APPLICATION_ID || "Please set your registered application ID";

var videoList = [
  "vgyLXQr49BA",
  "RKYgWHSN7fM",
  "0BgGMU9fFOs",
  "uJaDRmH9exo",
  "sqkgQUF5wfU",
  "Vd2z6lil7EU",
  "XusWMlJH178"
];
 
var app = module.exports = express();

app.configure(function() {
  app.engine("ect", ect({ watch: true, root: path.join(__dirname, "views"), ext: ".ect" }).render);
  app.set("view engine", "ect");
  app.use(express.static(path.join(__dirname, "public")));
  app.use(app.router);
});

app.get("/", function(req, res) {
  res.render("index", { ccApplicationId: ccApplicationId, videoList: videoList });
});

app.get("/vision", function(req, res) {
  res.render("vision");
});

var server = app.listen(port);

var previousVideoMsg = null;
var io = require("socket.io").listen(server);
io.on("connection", function(client) {
  var previousMsg = null;
  var previousTstamp = null;
  client.on("join", function(event) {
    if (!previousVideoMsg) {
      return;
    }
    var msg = {
      actor: "system",
      name: previousVideoMsg.name,
      videoId: previousVideoMsg.videoId,
      startTime: getTime() - previousVideoMsg.startTstamp,
      startTstamp: previousVideoMsg.startTstamp
    };
    client.emit("initialized", msg);
  });
  client.on("send", function(event) {
    var trimmedName = anonymous(trim(event.name, 10));
    var trimmedMsg = trim(event.msg, 100);
    if (trimmedMsg == "") {
      return;
    }
    if (previousMsg && previousMsg == trimmedMsg) {
      client.emit("push", systemError("Duplicate message."));
      return;
    }
    var now = getTime();
    if (previousTstamp && (now - previousTstamp) < 1000) {
      client.emit("push", systemError("Please wait a few sec."));
      return;
    }
    previousMsg = trimmedMsg;
    previousTstamp = now;
    var msg = {
      actor: "user",
      name: trimmedName,
      msg: trimmedMsg
    };
    client.emit("push", msg);
    client.broadcast.emit("push", msg);
  });
  client.on("change", function(event) {
    if (previousVideoMsg) {
      var span = 15000;
      var delta = getTime() - previousVideoMsg.startTstamp;
      if (delta < span) {
        client.emit("push", systemError("Need 15 sec interval. Please wait " + Math.ceil((span - delta) / 1000) + "sec."));
        return;
      }
    }
    var trimmedName = anonymous(trim(event.name, 10));
    var videoId = event.videoId;
    if (videoId === null || videoList.indexOf(videoId) == -1) {
      client.emit("push", systemError("Invalid request."));
      return;
    }
    var msg = {
      actor: "user",
      name: trimmedName,
      videoId: videoId,
      startTime: 0,
      startTstamp: getTime()
    };
    previousVideoMsg = msg;
    client.emit("changed", msg);
    client.broadcast.emit("changed", msg);
  });
  function systemError(coreMsg) {
    return { actor: "system", name: "SYSTEM", msg: "ERROR: " + coreMsg };
  }
  function trim(src, length) {
    return src.trim().substring(0, length);
  }
  function anonymous(name) {
    if (name === null || name == "") {
      return "anonymous";
    }
    return name;
  }
  function getTime() {
    return (new Date()).getTime();
  }
});

