class MacMonitorObserver < ActiveRecord::Observer
   observe :mactab

   def after_create(rec)
     puts "new mac-tab created: #{rec.inspect}"	
     WebsocketRails[:mactab].trigger 'new', rec
   end
end
