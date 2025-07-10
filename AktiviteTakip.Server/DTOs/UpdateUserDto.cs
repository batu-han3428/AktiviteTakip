namespace AktiviteTakip.Server.DTOs
{
    public class UpdateUserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public int Role { get; set; }
        public string? Password { get; set; }
        public string? Color { get; set; }
        public Guid? GroupId { get; set; }
        public bool IsPasswordChangeRequested { get; set; }
    }
}
