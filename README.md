# Chromecast-Vision

## Description

This is the sample synchronous YouTube viewer with Google Chromecast.  
You can chat with other viewers.  
(You can select the movie from whitelist.)

## Usage

1. Setup your Chromecast and install Chromecast Extension to PC Chrome.
2. Register your receiver and serial number of Chromecast to https://cast.google.com/publish/ and get Application ID to Chromecast SDK Console.
3. Download this code into your environment.
4. Execute command. `123123123` is your Application ID.
```
npm install
CC_APPLICATION_ID=123123123 node app.js
```

## Demo

Sender  
https://chromecast-vision.herokuapp.com/

Receiver (By Chromecast, but you can display this in Chrome(PC))  
https://chromecast-vision.herokuapp.com/vision

Sender image
![Sender](http://cdn-ak.f.st-hatena.com/images/fotolife/t/t_yamo/20140608/20140608170025.jpg)

Receiver image
![Receiver](http://cdn-ak.f.st-hatena.com/images/fotolife/t/t_yamo/20140608/20140608170024.jpg)

## License

```
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
```
