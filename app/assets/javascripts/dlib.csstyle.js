
// CSS helpers

_d_mixin({
	// Get a style property (name) of a specific element (elem)
	get_style: function(elem,name) {
		// If the property exists in style[], then it's been set
		// recently (and is current)
		if (elem.style[name])
			return elem.style[name];
		// Otherwise, try to use IE's method
		else if (elem.currentStyle)
			return elem.currentStyle[name];
		// Or the W3C's method, if it exists
		else if (document.defaultView && document.defaultView.getComputedStyle) {
			// It uses the traditional 'text-align' style of rule writing,
			// instead of textAlign
			name = name.replace(/([A-Z])/g,"-$1");
			name = name.toLowerCase();
			// Get the style object and get the value of the property (if it exists)
			var s = document.defaultView.getComputedStyle(elem,"");// console.debug('s: ',s);
			return s && s.getPropertyValue(name);
			// Otherwise, we're using some other browser
		} else
			return null;
	},

	// Get the actual height (using the computed CSS) of an element
	get_height: function(elem) {
		// Gets the computed CSS value and parses out a usable number
		return parseInt(this.get_style(elem, 'height'));
	},

	// Get the actual width (using the computed CSS) of an element
	get_width: function(elem) {
		// Gets the computed CSS value and parses out a usable number
		return parseInt(this.get_style(elem, 'width'));
	},

	// Find the full, possible, height of an element (not the actual,
	// current, height)
	height: function(elem) {
		// If the element is being displayed, then offsetHeight
		// should do the trick, barring that, get_height() will work
		if(this.get_style(elem, 'display') != 'none')
			return elem.offsetHeight || this.get_height(elem);
		// Otherwise, we have to deal with an element with a display
		// of none, so we need to reset its CSS properties to get a more
		// accurate reading
		var old = this.reset_css( elem, {
			display: '',
			visibility: 'hidden',
			position: 'absolute'
		});
		// Figure out what the full height of the element is, using clientHeight
		// and if that doesn't work, use get_height
		var h = elem.clientHeight || this.get_height(elem);
		// Finally, restore the CSS properties back to what they were
		this.restore_css(elem, old);
		// and return the full height of the element
		return h;
	},

	// Find the full, possible, width of an element (not the actual,
	// current, width)
	width: function(elem) {
		// If the element is being displayed, then offsetWidth
		// should do the trick, barring that, getWidth() will work
		if(this.get_style(elem, 'display') != 'none')
			return elem.offsetWidth || this.get_width(elem);
		// Otherwise, we have to deal with an element with a display
		// of none, so we need to reset its CSS properties to get a more
		// accurate reading
		var old = this.reset_css( elem, {
			display: '',
			visibility: 'hidden',
			position: 'absolute'
		});
		// Figure out what the full width of the element is, using clientWidth
		// and if that doesn't work, use getWidth
		var w = elem.clientWidth || this.get_width(elem);
		// Finally, restore the CSS properties back to what they were
		this.restore_css(elem, old);
		// and return the full width of the element
		return w;
	},

	// A function used for setting a set of CSS properties, which
	// can then be restored back again later
	reset_css: function(elem, prop) {
		var old = {};
		// Go through each of the properties
		for(var i in prop) {
			// Remember the old property value
			old[ i ] = elem.style[ i ];
			// And set the new value
			elem.style[ i ] = prop[i];
		}
		// Retun the set of changed values, to be used by restore_css
		return old;
	},

	// A function for restoring the side effects of the reset_css function
	restore_css: function(elem, prop) {
		// Reset all the properties back to their original values
		for(var i in prop)
			elem.style[ i ] = prop[ i ];
	},	

	// A function for hiding (using display) an element
	hide: function(elem) {
		elem=this.is_str(elem)?O(elem):elem;
		// Find out what its current display state is
		var curDisplay = this.get_style(elem, 'display');
		// Remember its display state for later
		if ( curDisplay != 'none' )
			elem.$oldDisplay = curDisplay;
		// Set the display to none (hiding the element)
		elem.style.display = 'none';
	},

	// A function for showing (using display) an element
	show: function(elem) {
		elem=this.is_str(elem)?O(elem):elem;
		// Set the display property back to what it use to be, or use
		// 'block', if no previous display had been saved
		elem.style.display = elem.$oldDisplay || 'block';
	},

	// Set an opacity level for an element
	// (where level is a number 0-100)
	opacity: function(elem, level) {
		// If filters exist, then this is IE, so set the Alpha filter
		if(elem.filters)
			elem.style.filters = 'alpha(opacity=' + level + ')';
		// Otherwise use the W3C opacity property
		else
			elem.style.opacity = level / 100;
	},

	add_class: function(klass,elem){
		elem = (!elem ? this.el : elem);
		var tmp = elem.className;
		elem.className += tmp ? ' '+klass : klass;
	},

	rmv_class: function(klass,elem){
	    elem = (!elem ? this.el : elem);
	    var rmv_c = elem.className;
	    var re = new RegExp('(^| )' + klass + '( |$)');
	    rmv_c = rmv_c.replace(re, '$1');
	    rmv_c = rmv_c.replace(/ $/, '');
	    elem.className = rmv_c;
	}
});
