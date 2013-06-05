
// simple tab plugin for the D-lib

d('stab').plugin(function(opts){
    // a self copy
    var self=this;
    // tabbing helpers
    var tab ={
        tabbit: function(){
            // toggle other tabs
            tab.toggle.call(this,'prev');
            tab.toggle.call(this,'next');
            // activate n show the current tab
            self.add_class('active',this);
            self.show('#'+this.id+'_tab');
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
    this.on('click', tab.tabbit, this.nodes('li',null,self.first()));
    // for default
    tab.tabbit.call(((opts && opts.show)?O(opts.show):d(self.first()).first()));
});
