/**
* AnimatedScroll.js - Developer version
* Smooth, animated document scroll to a specific element, supporting native jQuery UI easings.
* https://github.com/yevhentiurin/animatedscrolljs
*
* Copyright (c) 2013 Yevhen Tiurin
* Licensed under the LGPL Version 3 license.
* http://www.gnu.org/licenses/lgpl.txt
*
**/

(function($) 
{
  //***************************
  $.animatedScroll = 
  {
    options: {},
    offsetFromTarget: 
    {
      left: "50%",
      top: "50%"
    }
  };

  //***************************
  $.fn.animatedScroll = function(options, offsetFromTarget) 
  {
    options = $.extend({}, $.animatedScroll.options, options);
    offsetFromTarget = $.extend({}, $.animatedScroll.offsetFromTarget, offsetFromTarget);

    AnimatedScroll(this.get(0), options, offsetFromTarget);

    return this;
  };

  //***************************
  function AnimatedScroll(element, options, offsetFromTarget)
  {
    var viewportWidth, viewportHeight, targetWidth, targetHeight, 
      documentWidth, documentHeight, targetLeft, targetTop,
      animateLeft, animateTop, animateParameters, offsetLeft, offsetTop;

    viewportWidth = $(window).width();
    viewportHeight = $(window).height();
    targetWidth = $(element).width();
    targetHeight = $(element).height();
    documentWidth = $(document).width();
    documentHeight = $(document).height();
    targetLeft = $(element).offset().left;
    targetTop = $(element).offset().top;

    function parseOffsetValue(targetValue, offsetValue)
    {
      var parsedOffsetValue = parseInt(offsetValue);

      if (isNaN(parsedOffsetValue))
        return 0;

      if (offsetValue.indexOf !== undefined)
      {
          if (offsetValue.indexOf("%") > -1)
          {
            return (targetValue * parsedOffsetValue / 100);
          }
      };

      return parsedOffsetValue; 
    };

    offsetLeft = parseOffsetValue(targetWidth, offsetFromTarget.left);
    offsetTop = parseOffsetValue(targetHeight, offsetFromTarget.top);
    
    animateLeft = targetLeft + offsetLeft - (viewportWidth / 2);
    animateLeft = animateLeft < 0 ? 0 : (animateLeft + viewportWidth > documentWidth ? documentWidth - viewportWidth : animateLeft);
    animateTop = targetTop + offsetTop - (viewportHeight / 2);
    animateTop = animateTop < 0 ? 0 : (animateTop + viewportHeight > documentHeight ? documentHeight - viewportHeight : animateTop);

    animateParameters = $.extend({}, options, 
      {
        step: function(now, tween)
        {
          tween.elem.scrollIntoView(true);
          
          if (typeof options.step == "function")
          {
            options.step.apply(this, arguments);
          };
        },
        complete: function()
        {
          this.scrollIntoView(true);
          $(this).remove();

          if (typeof options.complete == "function")
          {
            options.complete.apply(this, arguments);
          };
        }
      }
    );

    $("<div/>")
      .css(
        {
          visibility: 'hidden',
          position: "absolute", 
          width: viewportWidth, 
          height: viewportHeight, 
          left: $(window).scrollLeft(),
          top: $(window).scrollTop()
        }
      )
      .appendTo(document.body)
      .animate({left: animateLeft, top: animateTop}, animateParameters);
  };

})(jQuery);