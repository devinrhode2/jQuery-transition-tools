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