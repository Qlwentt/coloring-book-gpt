class AddRetriesToImages < ActiveRecord::Migration[7.1]
  def change
    add_column :images, :retries, :integer, null: false, default: 0
  end
end
