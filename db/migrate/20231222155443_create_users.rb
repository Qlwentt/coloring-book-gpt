class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :name
      t.string :email
      t.string :google_token
      t.string :google_refresh_token             
      t.timestamps
    end
  end
end
