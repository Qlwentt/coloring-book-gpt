class AddImageLoadedCountToBooks < ActiveRecord::Migration[7.1]
  def change
    add_column :books, :image_loaded_count, :integer, null: false, default: 0
  end
end
