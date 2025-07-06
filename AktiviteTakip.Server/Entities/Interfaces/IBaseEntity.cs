namespace AktiviteTakip.Server.Entities.Interfaces
{
    public interface IBaseEntity<T>
    {
        T Id { get; set; }
        DateTime CreatedAt { get; set; }
        DateTime? UpdatedAt { get; set; }
        bool IsActive { get; set; }
        Guid CreatedBy { get; set; }
        Guid? UpdatedBy { get; set; }
    }
}
