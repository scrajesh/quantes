class CreateMactabs < ActiveRecord::Migration
  def change
    create_table :mactabs do |t|

      t.timestamps
    end
  end
end
