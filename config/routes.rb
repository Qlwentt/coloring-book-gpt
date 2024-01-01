Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  root "home#index"

  post '/webhook', to: 'webhook#receive'

  namespace 'api' do
    namespace 'v1' do
      resources :books
      post '/books/:id/redeem_license', to: 'books#redeem_license'
    end
  end

  get "/login", to: "login#index"
  get "/logout", to: "sessions#destroy"
  get "/auth/google_oauth2/callback", to: "sessions#create"
  get 'auth/failure', to: redirect('/')
  resource :session, only: [:create, :destroy]

  get '*path', to: 'home#index', constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end
