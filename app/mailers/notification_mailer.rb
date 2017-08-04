class NotificationMailer < ApplicationMailer
  def send_message(name)
    @name = name
    @greeting = 'Hi'

    mail to: 'to_okutani@example.com', subject: 'ActionMailerのテスト送信'
  end
end
