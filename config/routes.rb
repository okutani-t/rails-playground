Rails.application.routes.draw do
  resources :posts
  root 'top#index'

  resources :weathers, only: :index
  resources :infinites, only: :index
end
