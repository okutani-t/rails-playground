Rails.application.routes.draw do
  root 'top#index'

  resources :weathers, only: :index
end
