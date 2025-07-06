using AktiviteTakip.Server.Entities;
using AktiviteTakip.Server.Services.Interfaces;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Reflection.Emit;

namespace AktiviteTakip.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
    {
        private readonly IUserContextService _userContextService;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IUserContextService userContextService)
            : base(options)
        {
            _userContextService = userContextService;
        }

        public DbSet<Group> Groups { get; set; }
        public DbSet<Project> Project { get; set; }
        public DbSet<Firm> Firm { get; set; }
        public DbSet<EventParticipant> EventParticipant { get; set; }
        public DbSet<Event> Event { get; set; }
        public DbSet<Category> Category { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>()
            .HasOne(u => u.Group)
            .WithMany(g => g.Users)
            .HasForeignKey(u => u.GroupId)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false);

            builder.Entity<EventParticipant>()
            .HasKey(ep => new { ep.EventId, ep.UserId });

            builder.Entity<EventParticipant>()
                .HasOne(ep => ep.Event)
                .WithMany(e => e.Participants)
                .HasForeignKey(ep => ep.EventId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries<BaseEntity>();

            var userId = _userContextService.GetUserId() ?? Guid.Empty;

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    entry.Entity.CreatedBy = userId;
                    entry.Entity.IsActive = true;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    entry.Entity.UpdatedBy = userId;
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}

