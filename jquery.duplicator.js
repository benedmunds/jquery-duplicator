(function( $ ){

  $.fn.duplicator = function( options ) {

    var settings = {
      'rowSelector'    : '',                // selector for "row" to duplicate
      'addSelector'    : '',                // selector for "add" button
      'removeSelector' : '',                // selector of generic "remove" button
      'removeMarkup'   : '',                // markup of remove button
      'slideEffect'    : false,             // use sliding effect for adding/removing
      'maxDuplicates'  : 0,                 // set max number of duplications
      'templateClass'  : '',                // set max number of duplications
	  'templateKey'    : '[0]',              //replace original form element keys (if not template)
      limit            : function(limit) {} // callback for limiting out duplications
    };

    var self  = this;
    var $self = $(self);

    if ( options ) {
        $.extend( settings, options );
    }
	
	
	var original = $self.find(settings.rowSelector);
	
	//change the original keys if this is not a template
	if (settings.templateClass != '') {
		settings.templateKey = '[]';
	}
	else {
		original.html(original.html().replaceAll('[]', settings.templateKey));
	}
	
    
    $(settings.removeSelector).live('click', function() {

        var parents = $(this).parents(settings.rowSelector);

		if ( settings.slideEffect ) {
            
            parents.fadeTo('fast', 0.01, function() {
                parents.slideUp(function(){
                    parents.remove();
                });
            });
            
        }
        else {
            
            parents.fadeOut(function() {
                parents.remove();
            });
            
        }
        
        return false;
    
    });

    $(settings.addSelector).click(function() {

		//count total duplicates
		var duplicates = 0;
		if (settings.templateClass != '') {
			duplicates = $self.find(settings.rowSelector +':not(.'+ settings.templateClass +')').length;
		}
		else {
			duplicates = $self.find(settings.rowSelector).length;
		}
		
        var new_element    = $self.find(settings.rowSelector).clone();

        // set key
        var duplicates_key = (parseInt($self.data('duplicates_key')) > 0) ? parseInt($self.data('duplicates_key')) : duplicates;
		
        // check for maximum duplicates
        if ( settings.maxDuplicates !== 0 && settings.maxDuplicates < duplicates ) { 
				settings.limit(settings.maxDuplicates); 
				return false; 
		}
		

        // remove super element id
        new_element.removeAttr('id');
		
        // add to page and fade in
        new_element.prepend(settings.removeMarkup);
		new_element.html(new_element.html().replaceAll(settings.templateKey, '['+ duplicates_key + ']'));
		new_element.hide();
		
		//remove the template class if this is a template
		if (settings.templateClass != '') {
			new_element.removeClass(settings.templateClass);
		}
		
        new_element.appendTo(self);
        
        if ( settings.slideEffect ) {
            new_element.css('opacity', 0.01);
            new_element.slideDown();
        }
        
        new_element.fadeTo('fast', 1);
		
		$self.data('duplicates_key', ++duplicates_key);
        
        return false;

    });

    return this;
  };
})( jQuery );


String.prototype.replaceAll = function(stringToFind,stringToReplace){

	var temp  = this;
	var index = temp.indexOf(stringToFind);

	while(index != -1){
		temp  = temp.replace(stringToFind,stringToReplace);
		index = temp.indexOf(stringToFind);
	}

	return temp;

}