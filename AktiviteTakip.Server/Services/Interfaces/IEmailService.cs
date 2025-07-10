namespace AktiviteTakip.Server.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendPasswordSetupLinkAsync(string toEmail, string resetLink);
    }
}
