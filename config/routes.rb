Rails.application.routes.draw do
  resources :posts
  root 'top#index'

  resources :weathers, only: :index
end
