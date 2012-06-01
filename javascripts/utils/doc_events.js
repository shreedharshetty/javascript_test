//events
define(["utils/array"], function (array) { 
    
    var eventsObject = {
        on: (function () {
           if ( document.addEventListener ) {
              return function (el, type, fn) {
                 if ( el && el.nodeName || el === window ) {
                    el.addEventListener(type, fn, false);
                 } else if (el && el.length) {
                    this.filter(el, type, fn);
                 }
              };
           }
         
           return function (el, type, fn) {
              if ( el && el.nodeName || el === window ) {
                 el.attachEvent('on' + type, function () { return fn.call(el, window.event); });
              } else if ( el && el.length ) {
                 this.filter(el, type, fn);
              }
           };
        })(),
        
        filter: function(el, type, fn) {
          for ( var i = 0, len = el.length; i < len; i++ ) {
             this.on(el[i], type, fn);
          }
        },
        
        off: function (el, evt, fn) {
            if (el.removeEventListener) {
                this.remove = function (el, evt, fn) {
                    el.removeEventListener(evt, fn, false);
                    return el;
                };
            } else if (el.detachEvent) {
                this.remove = function (el, evt, fn) {
                    el.detachEvent("on" + evt, fn);
                    return el;
                };
            } else {
                this.remove = function (el, evt, fn) {
                    el["on" + evt] = null;
                    return el;
                };
            }
            return this.remove(el, evt, fn);
        }
    },
    events = ["click", "mouseover", "mouseout", "keypress"];

    array.forEach(events, function(evt) {
        eventsObject[evt] = function (el, fn) {
            this.on(el, evt, fn);
        };
    });
    return eventsObject;
});

