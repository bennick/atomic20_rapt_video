//
//  Provides dual-audio button api-call for the Rapt video player. Append one track to the other in the same file and note the offset time of the second track.
//  You'll pass in four values:
//    1. The name of the video player iframe
//    2. The dom id of the audio file
//    3. The offset of the start of the second audio track
//    4. The button label for audio track 1
//    5. The button label for audio track 2
//

var iframeName;
var audioId;
var offset;
var buttonLabel1;
var buttonLabel2;

function dualAudioOneFile(iframeName, audioId, offset, buttonLabel1, buttonLabel2) {

  var audioElm = document.getElementById(audioId);

  raptor.api.on("ready", function(event, el){
    raptor.settings("defaultIFrame", el.name);
   });

  raptor.api.on("projectStart", function(){
  	audioElm.load();
  	audioElm.currentTime = 0;
  	audioElm.play();
  });

  raptor.api.on("pause", function(){
  	audioElm.pause();
  });

  raptor.api.on("play", function(){
  	audioElm.play();
  });

  raptor.api.on("button", function(event, data){
  	var videoProgress;
  	if(data.action === buttonLabel1){
  		videoProgress = (raptor.api.state(iframeName).progressTime);
  		audioElm.currentTime = videoProgress;
  	}
  	if(data.action === buttonLabel2){
  		videoProgress = (raptor.api.state(iframeName).progressTime) + offset;
  		audioElm.currentTime = videoProgress;
  	}

  });

}
