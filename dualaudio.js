//
//  Provides dual-audio button api-call for the Rapt video player. Append one track to the other in the same file and note the offset time of the second track.
//  You'll pass in four values:
//    1. The name of the video player iframe
//    2. The dom id of the audio file
//    3. The dom id of the button
//    4. The offset of the start of the second audio track
//

(function() {
  var Beneful = function() {
    this.currentAudioTrack = 1;
    this.audioElm = undefined;
    this.audioBtn = undefined;
    this.iframeName = undefined;
    this.offset = undefined;


    this.dualAudioOneFile = function(iframeName, audioId, buttonId, offset) {

      var iframeName;
      var audioId;
      var buttonId;
      var offset;

      this.iframeName = iframeName;
      this.offset = offset;
      this.audioElm = document.getElementById(audioId);
      this.audioBtn = document.getElementById(buttonId);

      this._registerRaptorEvents();
      this._setUpButtonEventListener(this.iframeName, offset);
      this._syncVideoAudioWatcher(25);
    };

    this._registerRaptorEvents = function() {
      var _this = this;
      raptor.api.on("ready", function(event, el) {
        raptor.settings("defaultIFrame", el.name);
      });

      raptor.api.on("projectStart", function() {
        _this.audioElm.load();
      });

      raptor.api.on("pause", function() {
        _this.audioElm.pause();
      });

      raptor.api.on("play", function(data, el) {
        _this.audioElm.play();
        _this.audioElm.currentTime = 0;
        _this._syncAudioToVideo();
        console.log('play data: ', el)
      });

      raptor.api.on("projectEnd", function() {
        // raptor.api.setNode(154391);
        _this.audioElm.load();
        _this.audioElm.currentTime = 0;
        _this._syncAudioToVideo();
      });

    };

    this._setUpButtonEventListener = function(iframeName, offset) {
      var _this = this;
      this.audioBtn.addEventListener('click', function() {
        if (_this.currentAudioTrack == 1) {
          _this.currentAudioTrack = 2;
          _this._syncAudioToVideo();
        } else {
          _this.currentAudioTrack = 1;
          _this._syncAudioToVideo();
        }
      });
    };

    raptor.api.on("userTimed", function(data, el) {
      console.log('userTimed: ', el.time);
    })

    this._syncAudioToVideo = function() {
      var videoTime = raptor.api.state(this.iframeName).progressTime;
      if (this.currentAudioTrack == 1) {
        this.audioElm.currentTime = videoTime;
      } else {
        this.audioElm.currentTime = videoTime + this.offset;
      }
    };

    // Used for testing
    this._syncVideoAudioWatcher = function(interval) {
      var interval = interval;
      var intervalId = undefined;
      var _this = this;
      raptor.api.on("projectStart", function() {
        intervalId = setInterval(function() {
          _this._videoAutoOutofSync();
        }, interval);
      });
      raptor.api.on("projectEnd", function() {
        clearInterval(intervalId);
      });
    };

    this._videoAutoOutofSync = function() {
      var videoProgressTime = raptor.api.state(this.iframeName).progressTime;
      var audioProgressTime = this.audioElm.currentTime;
      console.log('Video Progress :' + videoProgressTime);
      console.log('Audio Progress :' + audioProgressTime);
    };

  }
  window.Beneful = Beneful;
})();
