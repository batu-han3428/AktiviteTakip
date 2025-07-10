using AktiviteTakip.Server.Models;
using AktiviteTakip.Server.Services.Interfaces;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace AktiviteTakip.Server.Services
{
    public class EmailService : IEmailService
    {
        private readonly SmtpSettings _smtpSettings;

        public EmailService(IOptions<SmtpSettings> smtpSettings)
        {
            _smtpSettings = smtpSettings.Value;
        }

        public async Task SendPasswordSetupLinkAsync(string toEmail, string resetLink)
        {
            var message = new MailMessage
            {
                From = new MailAddress(_smtpSettings.From),
                Subject = "Şifre Belirleme Linki",
                IsBodyHtml = false
            };

            message.To.Add(new MailAddress(toEmail));

            message.Body = $@"
        <html>
            <body style='font-family: Arial, sans-serif; line-height: 1.6;'>
                <h2>Şifre Belirleme</h2>
                <p>Merhaba,</p>
                <p>Hesabınız için şifre belirlemek üzere aşağıdaki butona tıklayın:</p>
                <p>
                    <a href='{resetLink}' style='
                        background-color: #4CAF50;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        display: inline-block;
                    '>Şifreyi Belirle</a>
                </p>
                <p>Bu bağlantı yalnızca belirli bir süre için geçerlidir.</p>
                <p>İyi günler dileriz,<br/>Aktivite Takip Ekibi</p>
            </body>
        </html>
    ";

            using var client = new SmtpClient(_smtpSettings.Host, _smtpSettings.Port)
            {
                EnableSsl = _smtpSettings.EnableSsl,
                Credentials = new NetworkCredential(_smtpSettings.Username, _smtpSettings.Password),
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false
            };

            await client.SendMailAsync(message);
        }
    }
}
