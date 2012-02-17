
(function($) { //be efficient! onScreen helps you select only elements visible on the screen like $('.emi:onScreen').verticallyAnim(8)
    // onScreen jQuery plugin v0.2.1
    // (c) 2011 Ben Pickles
    //
    // Checkout: http://benpickles.github.com/onScreen
    
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
    $.fn.ensureTransition = function(prop, val) {
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