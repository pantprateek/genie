##Summary##
This is a  project for voice recognition based OTT video streamer and player. 
This project uses HTML5 player at the client and can playback videos stored in mp4,webm and ogg formats  in /video folder.Video is streamed using nodejs script **httpserver.js** .
Playlist is automatically formed for all the videos hosted in /video and you can playback in **Genie** player (HTML5 player).Google speech recognition module **webkitSpeechRecognition**
is used to process the speech to text and then text is sent to the server .Server in turn will check for meaniningful  commands  in the text mentioned in **cmdstr** array in the server
and HTML5 player invokes the player functionality based on the command. 

This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.

##Improvements##
I'm new to these technologies and learning further. If you have suggestions or improvements,please do mail me at prateek1510@gmail.com.I have future plans to use it for youtube videos.

##Prerequisites##
A recent version of the **Chrome browser** supporting "webkitSpeechRecognition" .
npm should be installed .

##Installation and Running##
1. Download the contents of this repo.
2. Run **npm install** from source root of **genie**
3. Run node httpserver.js

##Usage##
Add videos in mp4,webm,ogg formats to /video folder .
Connect to http://localhost:8080 .You will see the webpage with first video in the playlist.
Make sure your microphone is connected and is working well.

You can control your video playback by saying appropriate commands in your microphone.
(1)"zoom" to zoom in and out 
(2)"play" to start the playback
(3)"stop" to stop or pause the playback
(4)"next" to select the next video.
(5)"mute" to mute the volume
(6)"back" to move backwards 
(7)"forward" to move forward



