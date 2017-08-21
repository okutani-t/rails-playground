class InfinitesController < ApplicationController
  def index
    @posts = Post.page(params[:page]).per(20)
  end
end
