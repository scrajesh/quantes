

// Core dlib.js v0.1
var c=console.debug;
// fall back for lower-end browsers
if(!Array.prototype.forEach) {
  Array.prototype.forEach = function(f) {
    for(var i = 0, len = this.length; i < len; ++i) {
      f.call(this, this[i], i);
    }
  }
}
// check for an array
Array.prototype.is_array = function() {
	return this.constructor.name === 'Array';
}
// alias for array.forEach
Array.prototype.walk = Array.prototype.forEach;
// Object enumerator
if(!Object.prototype.forEach) {
  Object.prototype.forEach = function(f) {
  	for(var i in this) {
    	f.call(this, this[i], i);
    }
  }
}
// Object enumerator with only own-properties
Object.prototype.walk = function(f) {
	for(var i in this) {
		if(this.hasOwnProperty(i)) {
			f.call(this, this[i], i);
		}
	}
}
// htmlcollection enumerator
HTMLCollection.prototype.walk = function(f) {
    for(var i = 0; i < this.length; i++) {
      f.call(this, this[i], i);
    }
}
// fall back for string trim
if(!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g,'');
  };
}
// http://javascript.crockford.com/remedial.html
// 	does variable substitution on the string
if (!String.prototype.supplant) {
    String.prototype.supplant = function (o) {
        return this.replace(
            /\{([^{}]*)\}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
}
if (!String.prototype.trim) {
 String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g,'');
 }
}
// check for a string
Array.prototype.is_str = function() {
	return this.constructor.name === 'String';
}
// assistance methods
function is_function(value) {
	return typeof value === 'function';
}
// Creates a sorted array of all enumerable properties, own and inherited,
// 	of `object` that have function values.
function functions(abject) {
	var result = [];
	abject.walk(function(v, k) {
	  if(is_function(v)) {
	    result.push(k);
	  }
	});
	return result.sort();
}
// element grabber
function O(selector){
	var obj;
	if(selector.match(/^#/))
		obj=document.getElementById(selector.substr(1));
	else if(selector.match(/\./) && document.getElementsByClassName) {
		var tmp=document.getElementsByClassName(selector.substr(1));
		if(tmp.length>1){
			obj = [];
			for (var i=0;i<tmp.length;i++) {
				obj[i]=tmp[i];
			}
		} else {
			obj = tmp.length ? tmp[i] : null;
		}
	}

	return obj;
}
// core d-Class
function DO_M(){	
	// public members
	this.el = null;
	// private members
	var self = this;
	// now perform singleton
	return function(selector){
		if(typeof selector==='object')
			self.el=selector;
		else if(/^\w+$/.test(selector))
			self.el = selector;
		else {
			self.el = O(selector);
			if(self.el.length > 0) {
				self.el = self.el[0];
			}
		}			

		return self;
	};
}
var d=new DO_M();
function _d_mixin(dobjs) {
	functions(dobjs).forEach(function(f) {	    
	    DO_M.prototype[f] = dobjs[f];
	});
}

// DOM Tree & Travesals
_d_mixin({
	prev: function(elem) {
		elem = (!elem ? this.el : elem);
		do {
		  elem = elem.previousSibling;
		} while (elem && elem.nodeType != 1);

		return elem;
	},

	next: function(elem) {
		elem = (!elem ? this.el : elem);
		do {
		  elem = elem.nextSibling;
		} while ( elem && elem.nodeType != 1 );

		return elem;
	},

	first: function(elem) {
		elem = (!elem ? this.el : elem);
		var elemnt = elem.firstChild;
		return elemnt && elemnt.nodeType != 1 ? this.next(elemnt) : elemnt;
	},

	last: function(elem) {
		elem = (!elem ? this.el : elem);
		var elemnt = elem.lastChild;
		return elemnt && elemnt.nodeType != 1 ? this.prev(elemnt) : elemnt;
	},

	parent: function(elem) {
		elem = (!elem ? this.el : elem);
		return elem.parentNode;
	},

	bytag: function(name,parent) {
		parent = (!parent ? this.el : parent);
		var obj, tmp = (parent || document).getElementsByTagName(name);
		if(tmp.length>1){
			obj = [];
			for (var i=0;i<tmp.length;i++) {
				obj[i]=tmp[i];
			}
		} else {
			obj = tmp.length ? tmp[i] : null;
		}
		return obj;
	},

	nodes: function(name,sel,parent){
		parent = this.de_fact(parent);
		var coll = [];
		if(!sel){
			var m;
			if(m=name.match(/#|\./)){
				var tmp = name.split(m[0]);
			    sel = tmp[1];
			}
		}
		if(sel && parent) {
			var elem = this.first(parent),i=1,pattn=new RegExp(sel);
			do {
				if(pattn.test(elem.className) || pattn.test(elem.id)){
					coll.push(elem);
				}				
			  	elem = this.next(elem);	
			} while (elem);

			return coll;
		}
		return this.bytag(name,parent);
	},

	html: function(htmlstr){
		if(typeof htmlstr === 'string'){
			var _div = document.createElement('div'),_c=[];
				_div.innerHTML = htmlstr;
			if(_div.children.length>1){
				var _tmp=this.first(_div);
				while(_tmp){
					_c.push(_tmp);
					_tmp=this.next(_div);
				}
			}
			return (_c.length?_c:_div.children[0]);
		}

		return htmlstr.innerHTML;
	},

	wrapit: function(htmlstr,nest){
		var _wrapped = document.createElement(nest||'div');
		_wrapped.innerHTML=htmlstr;

		return _wrapped;
	},

	appendto: function(nodes,parent){
		parent = (!parent ? this.el : parent);
		if(nodes.length){
			nodes.walk(function(n){
				parent.appendChild(n);
			});
		} else {
			parent.appendChild(nodes);
		}
	},

	fitto: function(nodes,parent){
		parent = (!parent ? this.el : parent);
		parent.innerHTML='';
		if(nodes.length){
			nodes.walk(function(n){
				parent.appendChild(n);
			});
		} else {
			parent.appendChild(nodes);
		}
	},

	rmvnode: function(node,parent){
		parent = (!parent ? this.el : parent);
		parent.removeChild(node);
	},

	rmvlast: function(parent,klass){
		parent = (!parent ? this.el : parent);
		var _last_el=this.last(parent);
		if(!klass || (klass && this.has_class(klass,_last_el))){
			this.rmvnode(_last_el,parent);
		}		
	},

	attr: function(attrib,value,elem){
		elem = (!elem ? this.el : elem);
		if(typeof value === 'string'){
			elem.setAttribute(attrib,value);
		}

		return elem.getAttribute(attrib,value);
	},

	text: function(txt, parent){
		var t = document.createTextNode(txt);
		parent.appendChild(t);
	},

	getbuttons: function(coll){
		var _tmp = [];
		for (var i = 0; i < coll.length; i++) {
			if(/submit|button/.test(coll[i].type))
				_tmp.push(coll[i]);
		}
		return _tmp;
	},

	can_placeholder: function(coll){
		var input = document.createElement('input');
		return ('placeholder' in input);
	},

	de_fact: function(el){
		if(el){
			return (this.is_array(el) ? el[0] : el);
		} else {
			return this.el;
		}
	}
});


// d Utilities
_d_mixin({
	echo: function() {
		c('Hello.. am: ',this.el);
	},

	plugin: function(f) {
		this[this.el] = f;
	},

	is_error_tagd: function(itarget){
		var e_tag = this.next(itarget);
		return (e_tag && e_tag.tagName.toLowerCase() == 'span' && e_tag.getAttribute('error'));
	},

	throw_error: function(itarget, msg){
		if(this.is_error_tagd(itarget)) {
			this.next(itarget).innerHTML = msg;
			return;
		}
		// construct the error field
		var span = document.createElement('span');
		span.className = 'error';
		span.innerHTML = msg;
		span.setAttribute('error','true');
		// appending to the label
		itarget.parentNode.appendChild(span);
	},

	rmv_error: function(itarget){
		if(this.is_error_tagd(itarget)) {
			this.parent(itarget).removeChild(this.next(itarget));
		}	
	},

	dont_act: function(e){
	    // Prevent the default browser action
	    if(e && e.preventDefault)
	      //  supports W3C
	      e.preventDefault();
	    else
	      // A shortcut for stoping the browser action in IE  
	      window.event.returnValue = false;
	    // nodefact returns false instead webdev returning it in the handler
	    return false;
	},

	is_array: function(obj) {
		return obj.constructor.name === 'Array';
	},

	is_str: function(obj) {
		return obj.constructor.name === 'String';
	}
});

// Anim utilities
_d_mixin({
	slide: function(opts){
		var slider=opts.slider, slideinitpos=0,
			parentw=parseInt(this.get_style(opts.parent,'width'));

 		var _raw=this.ex(opts.parent); console.debug(this.ex(opts.parent), this.ey(opts.parent));

        function rotate(){
            var ces = slider.style;
            var cleft = parseInt(ces.left);
            if(opts.side == 'left'){
            	ces.left = (cleft + opts.frames) + 'px';
            } else {
            	ces.right = (cleft - opts.frames) + 'px';
            }

            if (cleft >= slideinitpos) {
                setTimeout(rotate, 3);
            } else {
                go();
            }
        }

        function go(){
	        slider.style.left = opts.side == 'left' ? '-'+parentw+'px' :parentw+'px';
	        slider.style.zIndex = 5;
	        slider.style.display = 'block';

            setTimeout(rotate, 50);
        }

        go();
    }
});

// AJAX utilities
_d_mixin({
	ajax: function(opts){
		var self = this, xhr;
	    if(window.XMLHttpRequest)
	        xhr = new XMLHttpRequest();
	    else if(window.ActiveXObject)
	        xhr = new ActiveXObject('Microsoft.XMLHTTP');

	    xhr.open((opts.http?opts.http:'GET'), opts.url, true);
	    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	    xhr.setRequestHeader('Accept', 'application/json');
		xhr.onreadystatechange = function(){  
	        if(xhr.readyState < 4) {
	            return;  
	        }
	        if(xhr.status !== 200) {  
	            if('fail' in opts){
	            	opts.fail.call(('bind' in opts?opts.bind:self));
	            }
	            return;  
	        }
	        if(xhr.readyState === 4) {  
	            opts.success.call(('bind' in opts?opts.bind:self), jsonParse(xhr.responseText));
	        }
	    }  
	    // params
	    xhr.send((opts.q?opts.q:null));
	},

	load_json: function(url,callback){
		this.ajax({url:url,success:callback});
	},

	postit: function(opts){
		if('data' in opts){
			opts.q='';
			opts.data.walk(function(v,k){
				opts.q+=k+'='+escape(v)+'&';
			});
		}
		//console.debug('opts: ',opts);
		// now do post
		this.ajax(opts);
		//opts.success.call(('bind' in opts?opts.bind:self),opts.data);
	}
});

// sample plugin; a d-playground..
d('go').plugin(function(f){
	f.call(this);
});
