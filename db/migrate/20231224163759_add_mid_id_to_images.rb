class AddMidIdToImages < ActiveRecord::Migration[7.1]
  def change
    add_column :images, :mid_id, :string, null: false
  end
end
