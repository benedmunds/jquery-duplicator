(function( $ ){

  $.fn.duplicator = function( options ) {

    var settings = {
      'addSelector'    : '',                // selector for "add" button
      'removeSelector' : '',                // selector of generic "remove" button
      'removeMarkup'   : '',                // markup of remove button
      'slideEffect'    : false,             // use sliding effect for adding/removing
      'maxDuplicates'  : 0,                 // set max number of duplications
      limit            : function(limit) {} // callback for limiting out duplications
    };

    var self  = this;
    var $self = $(self);

    if ( options ) {
        $.extend( settings, options );
    }
    
    $(settings.removeSelector).live('click', function() {

        var parent = $(this).parent();
        var current_count = $.data(self,'duplicates');
        $.data(self, 'duplicates', current_count - 1);
        if ( settings.slideEffect ) {
            
            parent.fadeTo('fast', 0.01, function() {
                parent.slideUp(function(){
                    parent.remove();
                });
            });
            
        }
        else {
            
            parent.fadeOut(function() {
                parent.remove();
            });
            
        }
        
        return false;
    
    });

    $(settings.addSelector).click(function() {

        var duplicates     = 0;
        var new_element    = $self.clone();

        // check data
        if ( $.hasData(self) ) {
            duplicates = parseInt($.data(self,'duplicates')) + 1;
        }
        else {
            duplicates++;
        }
        
        // check for maximum duplicates
        if ( settings.maxDuplicates !== 0 && settings.maxDuplicates < duplicates ) { settings.limit(settings.maxDuplicates); return false; }
        $.data(self, 'duplicates', duplicates);



        // remove super element id
        new_element.attr('id','');

        // add to page and fade in
        new_element.prepend(settings.removeMarkup);
        new_element.hide();
        new_element.insertAfter(self);
        
        if ( settings.slideEffect ) {
            
            new_element.css('opacity', 0.01);
            new_element.slideDown();
        
        }
        
        new_element.fadeTo('fast', 1);
        
        return false;

    });

    return this;
  };
})( jQuery );