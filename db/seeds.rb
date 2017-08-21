
100.times do |i|
  Post.create(
    title: "title_#{i + 1}",
    body: "body_#{i + 1}",
  )
end
