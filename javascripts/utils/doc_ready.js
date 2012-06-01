Doc_Ready = {
    doc_check: function(fn) {     
      if (Doc_Ready.loaded) return fn();
      
      var observers = Doc_Ready.observers;
      if (!observers) observers = Doc_Ready.observers = [];
    
      observers[observers.length] = fn;
      
      if (Doc_Ready.callback) return;
      Doc_Ready.callback = function() {
        if (Doc_Ready.loaded) return;
        
        Doc_Ready.loaded = true;
        if (Doc_Ready.timer) {
          clearInterval(Doc_Ready.timer);
          Doc_Ready.timer = null;
        }
        
        var observers = Doc_Ready.observers;
        for (var i = 0, length = observers.length; i < length; i++) {
          var fn = observers[i];
          observers[i] = null;
          fn(); // make 'this' as window
        }
        Doc_Ready.callback = Doc_Ready.observers = null;
      };

      var webkit = navigator.userAgent.indexOf('AppleWebKit/') > -1;
      
      if (document.readyState && webkit) {
        
        // Apple WebKit (Safari, OmniWeb, ...)
        Doc_Ready.timer = setInterval(function() {
          var state = document.readyState;
          if (state == 'loaded' || state == 'complete') {
            Doc_Ready.callback();
          }
        }, 50);
        
      } 
    }
}