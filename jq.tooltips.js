/**
 *
 *
 *
 */

'use strict';
;(function ($) {

// create the plugin
$.extend($.fn, {
  tooltip: function (options, callback) {
    if (this.length) {
      return this.each( function () {
        new Tooltip(options, this, callback);
      });
    }
  }
});


// the function used in the plugin 
var Tooltip = function (options, element, callback) {

  // Set options if a string was passed in
  if (typeof options === 'string') {
    var str = options;
    options = {text: str};
  }

  // Save a copy of the element
  var el = element
    , $el = $(el)

    // Set the defaults
    , defaults = {
          hover: true
        , click: ''
        , text: "You forgot to include text."
        , opacity: undefined
        , fade: false
        , slide: false
      }

    // Mixin the user options
    , opt = $.extend({}, defaults, options)

    // to store globally accessible variables
    , my = {}

    /**
     * @name buildTarget
     * @desc Build the necessary html for the tooltip
     * @return The target jquery object
     */
    , buildTarget = function () {
        var $tooltip = document.createElement('div')
          , $arrow = document.createElement('div')
          , title = $el.attr('title');

        $tooltip = $($tooltip).addClass('jqtooltip hide');
        my.$arrow = $($arrow).addClass('jqt-arrow');

        if (title !== undefined && title !== '') {
          $tooltip[0].innerHTML = title;
        }
        else {
          $tooltip[0].innerHTML = opt.text;
        }

        $tooltip.append(my.$arrow);

        $('body').append($tooltip);
        return $tooltip;
      }

    /**
     * @name setPosition
     * @desc place the tooltip in the correct location
     */
    , setPosition = function () {
        var set = {
              top: 0
            , left: 0
            };

        my.pos = {
            top: my.$trigger.offset().top
          , bottom: my.$trigger.offset().top + my.$trigger.outerHeight()
          , left: my.$trigger.offset().left
          , right: my.$trigger.offset().left + my.$trigger.outerWidth()
        };

        if (my.pos.left < 50) {
          my.$target.addClass('right');
          set.top = $el.offset().top - my.$arrow.outerHeight()/2;
          set.left = $el.offset().left + $el.outerWidth() +
                     parseInt(my.$arrow.css('border-right-width').replace('px','')) + 7;
          my.$arrow.css({
              'top': my.$target.outerHeight()/2 -
                   my.$arrow.css('border-top-width').replace('px','')
          });
        }
        else if (my.pos.right > $(window).width() - 50) {
          my.$target.addClass('left');
          set.top = $el.offset().top - my.$arrow.outerHeight()/2;
          set.left = $el.offset().left - my.$target.outerWidth() -
                     my.$arrow.css('border-left-width').replace('px','') - 7;
          my.$arrow.css({
              'top': my.$target.outerHeight()/2 -
                   my.$arrow.css('border-top-width').replace('px','')
          });
        }
        else if (my.pos.top < 50) {
          my.$target.addClass('bottom');
          set.top = $el.offset().top + $el.outerHeight() + 10;
          set.left = $el.offset().left + $el.outerWidth()/2 - my.$target.outerWidth()/2;
          my.$arrow.css({
              'left': my.$target.outerWidth()/2 -
                    my.$arrow.css('border-bottom-width').replace('px','')
          });
        }
        else {
          my.$target.addClass('top');
          set.top = ($el.offset().top - 7) - my.$target.outerHeight();
          set.left = $el.offset().left + $el.outerWidth()/2 - my.$target.outerWidth()/2;
          my.$arrow.css({
              'left': my.$target.outerWidth()/2 -
                    my.$arrow.css('border-top-width').replace('px','')
          });
        }

        my.$target.css({'top': set.top, 'left': set.left});
      }

    /**
     * @name showTarget
     * @desc
     */
    , showTarget = function () {
        setPosition();
        my.$target.removeClass('hide');
        
      }

    /**
     * @name hideTarget
     * @desc
     */
    , hideTarget = function (duration) {
        my.$target.addClass('hide');
      }

    /**
     * @name init
     * @desc Handle options, store elements and assign event listeners
     */
    , init = function () {

      /** Setup the Elements */
        my.$trigger = $el;
        my.$target = buildTarget();
        my.$tail = my.$target.children('.jqt-tail');
        opt.opacity = my.$target.css('opacity');

      /** Setup the Events */
        $el.on('mouseenter', function (e) {
            if (my.$target.hasClass('hide')) {
              showTarget();
            }
        });

        $el.on('mouseleave', function (e) {
            hideTarget();
        });

      };

  init();
};

})(jQuery);

