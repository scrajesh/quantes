
// inline-edit D-lib plugin v0.1

d('iedit').plugin(function(opts){
    // req vars
    var self=this,
        _tb=d(this.first()).last(),
        _prevtr,_in_edit_class='itxteditor';
    // inline handler    
    function ieditor(){
    	// inline core funcs
        var inline={
            edit: function(f){
                var _target, _td=self.first(this);
                while(_td) {
                    _target=self.last(_td);
                    self.hide(_target);
                    inline[f].call(this,_target,_td);
                    _td=self.next(_td);
                }                
        	},
            // executed wrt save/cancel buttons
            save: function(e){            
                var _d_cell=self.prev(self.parent(this)),
                    _inp,_d_tr=self.parent(_d_cell),
                    _sar=_d_tr.id.split('-'),_data={id:parseInt(_sar[1])};

                while(_d_cell){
                    _inp=self.last(_d_cell);
                    _data[_inp.name]=_inp.value;
                    // TODO: y tis weird issue happens? without this
                    //   actual input-field value is not changed, thought user changes it..?????
                    self.attr('value',_data[_inp.name],_inp);
                    _d_cell=self.prev(_d_cell);
                }
                // now post it to the server
                self.postit({
                    url: '/mactabs/'+_data.id+'.json',
                    data: _data,
                    bind: _d_tr,
		    http: 'PUT',
                    success: function(data){
                        inline.edit.call(this,'refresh');
                        self.replace_class('on','off',self.first(self.first(this)));
                    },
                    fail: function(){
                        inline.edit.call(this,'restore');
                    }
                });
            },
            
            refresh: function(target,td){
                if(!self.has_class('noedit',td)){
                    var _inp_el=self.last(td);
                    var new_val=self.attr('value',null,_inp_el);
                    self.prev(_inp_el).innerHTML=new_val;
                }
                // now restore it with new-values
                inline.restore(target,td);
            },

            revert: function(e){
                _prevtr=e?self.parent(self.parent(this)):_prevtr;
                if(_prevtr){
                    inline.edit.call(_prevtr,'restore');
                    self.replace_class('on','off',self.first(self.first(_prevtr)));
                }
            },

        	restore: function(target,td){
                if(self.has_class('noedit',td)){
                    self.rmvlast(td,_in_edit_class);
                }
                self.rmvlast(td,_in_edit_class);
                self.show(self.last(td));
        	},

        	render: function(target,td){
    	        var _ied,_oval,_th = self.height(target), _tw = self.width(target);
                if(self.has_class('noedit',td)){
                    _ied = [ self.html('<input type="button" class="'+_in_edit_class+'" value="go" name="save">'),
                             self.html('<input type="button" class="'+_in_edit_class+'" value="x" name="cancel">')];
                    self.on('click',inline.save,_ied[0]);
                    self.on('click',inline.revert,_ied[1]);
                } else {                    
                    _oval=self.html(target);
                    if(_th > 20  && _oval.length > 20){
                        /*_ied = self.html('<textarea class="'+_in_edit_class+'" style="width:'+(_tw+30)+'px;height:'+_th+'px"></textarea>');
                        self.attr('innerHTML',_oval,_ied); */
                        ied = self.html('<input type="text" class="'+_in_edit_class+'" style="width:'+(_tw+50)+'px;">');
                        self.attr('value',_oval.trim(),_ied);
                        self.attr('name',target.className,_ied);
                    } else {
                        _ied = self.html('<input type="text" class="'+_in_edit_class+'" style="width:'+(_tw+30)+'px;">');
                        self.attr('value',_oval.trim(),_ied);
                        self.attr('name',target.className,_ied);
                    }                    
                }
                self.appendto(_ied,td);
        	}
        };
        // restore the prev editables, if present
        if(_prevtr!==this){
            inline.revert();
        }        
        // now render the selected rows
        inline.edit.call(this,'render');
        _prevtr = this;
    };
    // click-handle for inline-edit
    this.on('click', function(e){
        self.add_class('on',this);
        ieditor.call(d(self.parent(this)).parent());
    }, this.nodes('input',null, _tb));
    // give away a func so that newly added records also can be fed n manipulated
    return {
        rebuild: function(){
            self.on('click', function(e){
                self.add_class('on',this);
                ieditor.call(d(self.parent(this)).parent());
            }, self.first(self.first(this)));
        }
    };
});

