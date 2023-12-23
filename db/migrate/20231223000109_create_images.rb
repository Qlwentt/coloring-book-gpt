class CreateImages < ActiveRecord::Migration[7.1]
  def change
    create_table :images do |t|
      t.references :book, null: false, foreign_key: true
      t.string :remote_url
      t.string :prompt
      t.timestamps
    end
  end
end
