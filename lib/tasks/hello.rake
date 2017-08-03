namespace :greeting do
  desc 'はじめてのrakeタスク'
  task :hello do
    p 'hello, rake task!'
  end

  desc 'DBにアクセスしてみる'
  task :hello_post => :environment do
    post = Post.first
    puts "hello, #{post.title}"
  end
end
