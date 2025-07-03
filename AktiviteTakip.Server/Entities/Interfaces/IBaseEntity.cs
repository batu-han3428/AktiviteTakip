namespace AktiviteTakip.Server.Entities.Interfaces
{
    public interface IBaseEntity
    {
        Guid Id { get; set; }
        DateTime CreatedAt { get; set; }
        DateTime? UpdatedAt { get; set; }
        bool IsActive { get; set; }
        string CreatedBy { get; set; }
        string? UpdatedBy { get; set; }
    }
}
