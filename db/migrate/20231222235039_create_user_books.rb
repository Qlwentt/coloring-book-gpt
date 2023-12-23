class CreateUserBooks < ActiveRecord::Migration[7.1]
  def change
    create_table :user_books do |t|
      t.references :user, null: false, foreign_key: true
      t.references :book, null: false, foreign_key: true
      t.boolean :is_bought, default: false

      t.timestamps
    end
  end
end
