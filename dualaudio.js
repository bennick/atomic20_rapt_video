//
//  Provides dual-audio button api-call for the Rapt video player. Append one track to the other in the same file and note the offset time of the second track.
//  You'll pass in four values:
//    1. The name of the video player iframe
//    2. The dom id of the audio file
//    3. The dom id of the button
//    4. The offset of the start of the second audio track
//

(function() {
  var Beneful = function () {
    this.currentAudioTrack = 1;
    this.audioElm = undefined;
    this.audioBtn = undefined;
    this.iframeName = undefined;

    
    this.dualAudioOneFile = function(iframeName, audioId, buttonId, offset) {
      
      var iframeName;
      var audioId;
      var buttonId;
      var offset;
      
      this.iframeName = iframeName;
      this.audioElm = document.getElementById(audioId);
      this.audioBtn = document.getElementById(buttonId);
      
      this._registerRaptorEvents();
      this._setUpButtonEventListener(this.iframeName, offset);
      this._syncVideoAudioWatcher(500);
    };   
      
    this._registerRaptorEvents = function() {
      var _this = this;
      raptor.api.on("ready", function(event, el){
        raptor.settings("defaultIFrame", el.name);
      });

      raptor.api.on("projectStart", function(){
        _this.audioElm.load();
        _this.audioElm.currentTime = 0;
     	_this.audioElm.play();
      });

      raptor.api.on("pause", function(){
	    _this.audioElm.pause();
      });

      raptor.api.on("play", function(){
        _this.audioElm.play();
      });
    };
    
    this._setUpButtonEventListener = function(iframeName, offset) {
      var _this = this;
      this.audioBtn.addEventListener('click', function() {
        videoProgress = (raptor.api.state(iframeName).progressTime);
        if(_this.currentAudioTrack == 1) {
          _this.audioElm.currentTime = videoProgress + offset;
          _this.currentAudioTrack = 2;
        } else {
          _this.audioElm.currentTime = videoProgress
          _this.currentAudioTrack = 1;
        }
      });
    };
    
    this._syncVideoAudioWatcher = function(inverval) {
      var inverval = inverval;
      var intervalId = undefined;
      var _this = this;
      raptor.api.on("projectStart", function(){
        intervalId = setInterval(function() {
          if (_this._videoAutoOutofSync()) {
            _this._synchVideoAudio();
          }
        }, inverval);
      }); 
      raptor.api.on("projectEnd", function(){
          clearInterval(intervalId);
      });
    };
    
    this._videoAutoOutofSync = function() {
      var videoProgressTime = raptor.api.state(this.iframeName).progressTime;
      var audioProgressTime = this.audioElm.currentTime;
      console.log('Video Progress :' + videoProgressTime);
      console.log('Audio Progress :' + audioProgressTime);
    };
    
    this._synchVideoAudio = function() {
      console.log("Syncing video and audio!!!!!");
    };
    
  }
  window.Beneful = Beneful;
})();
