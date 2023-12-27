class RemoveImageLoadedCountFromBooks < ActiveRecord::Migration[7.1]
  def change
    remove_column :books, :image_loaded_count, :integer
  end
end
