
// simple tab plugin for the D-lib

d('stab').plugin(function(opts){
    var self=this;
    var tab ={
        init: function(){                        
            var _default = O(opts.show);
            // toggle other tabs
            tab.toggle.call(_default,'prev');
            tab.toggle.call(_default,'next');
            // activate n show the current tab
            self.add_class('active',_default);
            self.show('#'+_default.id+'_tab');
        },
        toggle: function(f){
            var _tmp = self[f](this);
            while(_tmp) {
                self.hide('#'+_tmp.id+'_tab');
                self.rmv_class('active',_tmp);
                _tmp = self[f](_tmp);
            }
        }
    };
    // tab head click-handlers
    this.on('click', function(e){
        // toggle other tabs
        tab.toggle.call(this,'prev');
        tab.toggle.call(this,'next');
        // activate n show the current tab
        self.add_class('active',this);
        self.show('#'+this.id+'_tab');
    },this.nodes('li',null,self.first()));
    // init the tabs now
    tab.init();
});
