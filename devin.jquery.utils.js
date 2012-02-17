/**
  verticallyAnim jQuery plugin, by Devin Rhode under OneSchool
  
  Example use:
  $(singleDomNode).verticallyAnim('30px');
  This will do an animation that takes advantage of the GPU on iOS.
  
  You can also pass it a plain integer, like:
  $(singleDomNode).verticallyAnim(-30);
  
  Positive numbers move elements up the page, negative down.
  
  It's recommended only to only pass plain integers, no decimal values. You can but things round to integers.
  
  It's also recommended you set your -webkit-transition properties in the css for your elements, however verticallyAnim has a default if you don't have anything set. You can set as many or as few properties as you wish, verticallyAnim will default for any omited transition property. It also respects your current transition's that are set if you don't include -webkit-transform or use all.
  
  Lastly, if you screw anything up, I intelligently bark at you in the error console. 
  
  There's also a second param for a callback to execute right when animation completes. This may include adjusting margins, etc.
  
  Interally, this does a transition of -webkit-transform: translate3d, the css required for GPU translations on iOS, and then after the animation it reverts it from a transform to a left/top variable.
*/

/** This may be interesting/useful callback code:
The most notable part is using .noTransition at the end to execute css without having any transitions occur.

  var end = {};
  var positionOffset = parseInt(px);
  if (positionOffset < 0) {
      position = 'bottom';
      positionOffset = parseInt(px)/-1; //remove negative.
  } else {
      position = 'top';
  }
  positionOffset = parseInt(realThis.css(position)) + positionOffset;
  end['position'] = 'relative'
  end[position] = positionOffset + 'px';
  end[pre + 'transform'] = realThis.css(pre + 'transform').replace(executedTranslate, ' translate3d(0, ' + parseInt(px) + 'px' + ', 0)');
  
  //reset.
  realThis.noTransition(end);
*/


(function($) { //be efficient! onScreen helps you select only elements visible on the screen like $('.emi:onScreen').verticallyAnim(8)
    // onScreen jQuery plugin v0.2.1
    // (c) 2011 Ben Pickles
    //
    // http://benpickles.github.com/onScreen
    //
    // Released under MIT license.
    $.expr[":"].onScreen = function(elem) {
      var $window = $(window)
      var viewport_top = $window.scrollTop()
      var viewport_height = $window.height()
      var viewport_bottom = viewport_top + viewport_height
      var $elem = $(elem)
      var top = $elem.offset().top
      var height = $elem.height()
      var bottom = top + height
  
      return (top >= viewport_top && top < viewport_bottom) ||
             (bottom > viewport_top && bottom <= viewport_bottom) ||
             (height > viewport_height && top <= viewport_top && bottom >= viewport_bottom)
    }
    
    $.id = function(el) {
      return $(document.getElementById(el));
    }
    
    //run some css without any transitions occuring, takes a css object, and callback to run after the transition is done
    $.fn.noTransition = function(css, callback) {
        console.log(css);
        var realThis = this;
        var prevTrans = realThis.css(pre + 'transition-property');
        realThis.css(pre + 'transition-property', 'none');
        realThis.css(css);
        setTimeout(function(){
            realThis.css(pre + 'transition-property', prevTrans);
            if (callback) callback();
        }, 1);
    };
})(jQuery);



(function( $ ){ //verticallyAnim depends on the following code in this closure:
    //has string method, returns true/false if a string has a substring
    window.String.prototype.has = function(string) {
        if (this.indexOf(string) > -1) {
            return true;
        } else {
            return false;
        }
    };
    
    //css3 vendor prefix 'pre' variable
    var ua = navigator.userAgent;
    if (ua.has('WebKit') || us.has('webkit') || ua.has('Webkit')) {
    	window.pre = '-webkit-';
    } else {
        alert('verticallyAnim has been lazy and opted not to configure for non-webkit browsers. This is a fairly easy fix if you are seeing this message. Just set the \'pre\' variable based on this userAgent: ' + ua + '\n\nTHEN AGAIN this is made specifically for iOS GPU animations..');
        vaExit(this);
    }    
    //transition single PROPerty to some VALue 
    $.fn.singleTransition = function(prop, val) {
    	var realThis = this;
        var prevTrans = realThis.css(pre + 'transition-property');
        realThis.css(pre + 'transition-property', prop);
        setTimeout(function(){
          realThis.css(prop, val);
          setTimeout(function(){
              realThis.css(pre + 'transition-property', prevTrans);
          }, 1);
        }, 5);
    }

    $.fn.verticallyAnim = function(px, doneCallback) {
        //vaExit = verticallyAnim Exit (for failure/bad validation)
        var vaExit = function(realThis) {
            console.error('verticallyAnim\'s first argument for vertical movement was: ');
            console.error(px);
            console.error('verticallyAnim\'s second argument, the callback for completion was:');
            console.error(doneCallback);
            console.error('the this reference to a jQuery node verticallyAnim is working on:');
            console.error(realThis);
            console.error('verticallyAnim exiting..');
            return '"verticallyAnim had a problem and exited"';
        };
        
        //check if we even have a jQuery object… don't know how necessary this is
        if (!this.jquery) {
            alert('verticallyAnim ended up with a non-jquery this. See console.');
            vaExit(this);
        }
        
        //a 0 length means this is being called on a bad selector
        if (this.length === 0) {
            console.error('verticallyAnim ended up with an empty jQuery array. You must have a bad selector for something.');
            vaExit(this);
        }
        
        //check the css method as it's very critical
        if (!this.css) {
            console.error('..bad selector? this.css is false');
            vaExit(this);
        }
    
    	return this.each(function(){ //return jQuery object for proper chaining, do this.each to act on a collection/array
    	
        var realThis = $(this); //so there are no mixups around what this is this or that
        
        try {
        
        //some more validation
        //normalize px:
        if (typeof px === 'number') {
            px = px + 'px';
        } else {
            if (!px.has('px')) {
                alert('At this time, the verticallyAnim plugin only supports a numerical pixel movement, ' +
                      'or literal pixel string, like \'30px\', 30, or -10. View console for more info.');
                vaExit(this);
            }
        }
        
        //assure transition is setup correctly.
        var prop = realThis.css(pre + 'transition-property');
        var dur = realThis.css(pre + 'transition-duration');
        var fn = realThis.css(pre + 'transition-timing-function');
        if (realThis.css(pre + 'transition') === '' && dur === '0s' && prop === 'all' && typeof fn === 'undefined') {
            realThis.css(pre + 'transition', 'all 0.3s ease-in-out');
        } else {
            if ( prop.has(pre + 'transform') || prop.has('all') ) {/*do nothing*/}
            else {
                realThis.css(pre + 'transition-property', prop + ', ' + pre + 'transform');
            }
        
            if (dur === '0s') { //'0s' seems to be what gets returned by default
                realThis.css(pre + 'transition-duration', '0.3s');
            }
            
            if (typeof fn === 'undefined') {
            	realThis.css(pre + 'transition-timing-function', 'ease-in-out');
            }
        }
        
        //calculations to trigger the translation
        var trans = realThis.css(pre + 'transform'); //jQuery is rather important here, as (I think) it normalizes the css string
        if (trans === 'none') { //1. 'none' is default for -webkit-transform. Since nothing is here, jsut write in the translate.
        	trans = ' translate3d(0px, ' + px + ', 0px)';
        } else { //2. else, respect current transform values.. 
        	if (trans.has('translate3d(')) { //3. and if a translate3d is in place, merge with it
        		var startTranslate = trans.indexOf('translate3d(');
        		
        		var transOpen = startTranslate + 12;
        		var transClose = trans.indexOf(')', transOpen);
        		var transMiddle = trans.substring(transOpen, transClose);
        		
        		var translate = trans.substring(startTranslate, transClose + 1);
        		
        		var firstComma = transMiddle.indexOf(', ') + 2;
        		var secondComma = transMiddle.indexOf(',', firstComma);
        		var transY = transMiddle.substring(firstComma, secondComma);
        		var ySum = parseInt(transY) + parseInt(px);
        		trans = trans.replace(translate, translate.replace(', ' + transY + ',', ', ' + ySum + 'px,'));
        	} else { //4. otherwise, just add a translate3d to current transforms
        		trans = trans + ' translate3d(0px, ' + px + ', 0px)';
        	}
        }
        var executedTranslate = trans; //idk, preserve executedTranslate. 
        
        //BAM execute this translation!
        realThis.singleTransition(pre + 'transform', executedTranslate);

        
        //doing -webkit-transform: translate3d(8px,58px,10px) rotate(0) scale(1) translate3d(8px,58px,10px) translate3d(0px,58px,10px); is perfectly valid. This simply adds up the x, y, z values. Thank you css!
        
        setTimeout(function(){
            var transitionDuration = parseFloat(realThis.css(pre + 'transition-duration')) * 1000;
            setTimeout(function(){                
                if (doneCallback) doneCallback();
                console.log('verticallyAnim completed: ' + executedTranslate);
            }, transitionDuration);
        }, 2);
        
        return '"this is a verticallyAnim return value. If you are trying to use chaining, verticallyAnim does not yet support this. Reference http://docs.jquery.com/Plugins/Authoring on enabling this - HOWEVER, it\'s important to consider the callback functionality.."';
        } //close try block.
        catch(e) {
            console.error('Caught error:');
            console.error(e);
        }
        
        });
    };
})( jQuery );