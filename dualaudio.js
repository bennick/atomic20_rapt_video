//
//  Provides dual-audio button api-call for the Rapt video player. Append one track to the other in the same file and note the offset time of the second track.
//  You'll pass in four values:
//    1. The name of the video player iframe
//    2. The dom id of the audio file
//    3. The dom id of the button
//    4. The offset of the start of the second audio track
//    5. The button label for audio track 1
//    6. The button label for audio track 2
//

(function() {
  var Beneful = function () {
    this.dualAudioOneFile = function(iframeName, audioId, buttonId, offset) {
      var _this = this;
      var iframeName;
      var audioId;
      var buttonId;
      var offset;
      
      var audioElm = document.getElementById(audioId);
      var audioBtn = document.getElementById(buttonId);

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
      
      raptor.api.on("progress", function(){
        console.log("Progress");
      });

      audioBtn.addEventListener('click', function() {
         videoProgress = (raptor.api.state(iframeName).progressTime);
         if(_this.currentAudioTrack == 1) {
           audioElm.currentTime = videoProgress + offset;
           _this.currentAudioTrack = 2;
         } else {
           audioElm.currentTime = videoProgress
           _this.currentAudioTrack = 1;
         }
      });
      
    };
    this.currentAudioTrack = 1;
  }
  window.Beneful = Beneful;
})();
