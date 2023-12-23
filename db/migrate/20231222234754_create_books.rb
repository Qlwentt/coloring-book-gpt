class CreateBooks < ActiveRecord::Migration[7.1]
  def change
    create_table :books do |t|
      t.string :imagine_query
      t.string :pdf_url
      t.timestamps
    end
  end
end
