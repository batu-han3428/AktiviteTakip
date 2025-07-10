namespace AktiviteTakip.Server.DTOs
{
    public sealed class UserDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public GroupDto? Group { get; set; } 
        public bool IsActive { get; set; }
        public string Color { get; set; } 
    }
}
