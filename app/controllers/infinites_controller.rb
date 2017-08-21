class InfinitesController < ApplicationController
  def index
    @posts = Post.page(params[:page]).per(25)
  end
end
