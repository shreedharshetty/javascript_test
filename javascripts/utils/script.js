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

//selectors

define('selectors', function () {

	var Assignment = {

		get: function (selector) {

		    var i, len, curr_col, element, par, ret_arr = [], fns;

		    if (selector.indexOf('#') > 0) {
		        selector = selector.split('#');
		        selector = '#' + selector[selector.length -1];
		    }
		    selector = selector.split(' ');

		    fns = {
		        id : function (sel) {
		            return document.getElementById(sel);
		        },
		        get : function (c_or_e, sel, par) {
		            var i = 0, len, arr = [], get_what = (c_or_e === 'class') ? 'getElementsByClassName' : 'getElementsByTagName';
		            if (par.length) {
		               while (par[i]) { Array.prototype.push.apply(arr, Array.prototype.slice.call(par[i++][get_what](sel))); }
		            } else {
		                arr = par[get_what](sel);
		            }
		            return (arr.length === 1) ? arr[0] : arr;
		        }
		    };
		        

		    len = selector.length;
		    curr_col = document;

		    for ( i = 0; i < len; i++ ) {
		        element = selector[i];
		        par = curr_col; 
		         if (element.indexOf('#') === 0) {
		             curr_col = fns.id(element.split('#')[1]);
		        } else if (element.indexOf('.') > -1) {
		            element = element.split('.');
		            if (element[0]) { // if there's an element prefixed on the class name
		                par = fns.get('elements', element[0], par);
		                if (par.length) {
		                    for (i = 0; par[i]; i++) {
		                        if(par[i].className.indexOf(element[1]) > -1) {
		                            ret_arr.push(par[i]);
		                        }
		                    }
		                     curr_col = ret_arr;
		                } else {
		                     curr_col = (par.className.indexOf(element[1]) > -1) ? par : [];
		                }
		            } else {
		                 curr_col = fns.get('class', element[1], par);
		            }
		        } else { // regular element selector
		             curr_col = fns.get('elements', element, par);
		        }  
		    }

		    return curr_col;
		},

		hasClass: function (el, cl) {
	        var regex = new RegExp('(?:\\s|^)' + cl + '(?:\\s|$)');
	        return !!el.className.match(regex);
    	},
 
	    addClass: function (el, cl) {
	    	if ( el && el.nodeName || el === window ) {
		    	if (!this.hasClass(el,cl)) el.className += " "+cl;
		    }else if ( el && el.length ) {
	        	this.filterClass(el, cl,true);
		    }
	    },
	 	
	    filterClass: function (el, cl,flag) {
	 		for ( var i = 0, len = el.length; i < len; i++ ) {
            	flag ? this.addClass(el[i], cl): this.removeClass(el[i], cl);
          	}
	 	},

	    removeClass: function (el, cl) {
	    	if ( el && el.nodeName || el === window ) {
	    		if(this.hasClass(el, cl)){
		        	var regex = new RegExp('(?:\\s|^)' + cl + '(?:\\s|$)');
		        	el.className = el.className.replace(regex, ' ');
	    		}
	        }else if ( el && el.length ) {
	        	this.filterClass(el, cl,false);
	        }
	    },
	 
	    toggleClass: function (el, cl) {
	        this.hasClass(el, cl) ? this.removeClass(el, cl) : this.addClass(el, cl);
	 
	    },

	    getAllSiblings: function(elem,tag){
		    return elem.parentNode.getElementsByTagName(tag);
	    },

	    ready :function(cb) {
   			/in/.test(document.readyState) ? setTimeout(this.ready(cb), 10): cb();
		},

		cashRegister: function(to, ele ,interval){

			var thiz = this,
				from = parseInt(ele.innerHTML);
				this.toggleClass(ele,"yellowbg"); 
            if(from < to ){
                for (var i = from; i < to; i++) {
                    setTimeout(function(){
                        ele.innerHTML = i;
                    }, interval);
                };
            } else{
                for (var i = from; i > to; i--) {
                    setTimeout(function(){
                        ele.innerHTML = i;
                    }, interval);
                };
            }
            setTimeout(function(){
	            thiz.toggleClass(ele,"yellowbg");  
            }, interval);
		},

		eliminateDuplicate: function(arr){
	        var out=[],
	            obj={};

	        for (var i=0;i<arr.length;i++) {
	          obj[arr[i]]=0;
	        }
	        for (i in obj) {
	          out.push(i);
	        }
	        return out;
		},

		sortAsc: function(a,b){
			return a - b;
		},

		sortDesc: function(a,b){
			return b - a;
		},

		sortList: function(list,sortFlag){

			var tempLis = list.getElementsByTagName("li"),
            price = [],
            sortedlis = '';

        	for(i=0;i < tempLis.length; i++) {
            	price.push(parseFloat(tempLis[i].getElementsByClassName("fare")[0].innerHTML).toFixed(2));
        	}
	        price = this.eliminateDuplicate(price);
	        if(sortFlag){
        		price = price.sort(this.sortAsc);
	        }else{
        		price = price.sort(this.sortDesc);	
	        }

	        for(p in price) {
	            for(i=0;i < tempLis.length; i++) {
	                if(tempLis[i].getElementsByClassName("fare")[0].innerHTML == price[p]) {
	                    sortedlis += "<li>"+ tempLis[i].innerHTML+ "</li>";
	                }
	            }
	        }
      		list.innerHTML = sortedlis;
		},		
	}
	return Assignment;
});