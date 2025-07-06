using AktiviteTakip.Server.Data;
using AktiviteTakip.Server.Entities;
using AktiviteTakip.Server.Repositories;
using AktiviteTakip.Server.Repositories.Interfaces;
using AktiviteTakip.Server.UnitOfWork.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Storage;

namespace AktiviteTakip.Server.UnitOfWork.Concrete
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;

        private Dictionary<Type, object> _repositories = new();
        private IDbContextTransaction? _transaction;


        private IFirmRepository? _firmRepository;
        private IProjectRepository? _projectRepository;
        private ICategoryRepository? _categoryRepository;
        private IEventRepository? _eventRepository;

        public UnitOfWork(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public IFirmRepository Firms =>
            _firmRepository ??= new FirmRepository(_context);

        public IProjectRepository Projects =>
            _projectRepository ??= new ProjectRepository(_context);

        public ICategoryRepository Categories =>
            _categoryRepository ??= new CategoryRepository(_context);

        public IEventRepository Events =>
            _eventRepository ??= new EventRepository(_context);

        public IRepository<T> Repository<T>() where T : BaseEntity
        {
            if (_repositories.ContainsKey(typeof(T)))
                return (IRepository<T>)_repositories[typeof(T)];

            var repository = new Repository<T>(_context);
            _repositories.Add(typeof(T), repository);
            return repository;
        }

        public UserManager<ApplicationUser> UserManager => _userManager;
        public RoleManager<ApplicationRole> RoleManager => _roleManager;

        public async Task BeginTransactionAsync()
        {
            if (_transaction == null)
                _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task<int> CommitAsync()
        {
            try
            {
                var result = await _context.SaveChangesAsync();
                if (_transaction != null)
                {
                    await _transaction.CommitAsync();
                    await _transaction.DisposeAsync();
                    _transaction = null;
                }
                return result;
            }
            catch
            {
                if (_transaction != null)
                {
                    await _transaction.RollbackAsync();
                    await _transaction.DisposeAsync();
                    _transaction = null;
                }
                throw;
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}
