using Core.Enums;
using Core.Exceptions;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Repositories.Data;
using System.Linq.Expressions;

namespace Repositories
{
	public class Repository<T> : IRepository<T> where T : class
	{
		private readonly AppDbContext _context;
		private readonly DbSet<T> _dbSet;

		public Repository(AppDbContext context)
		{
			_context = context;
			_dbSet = _context.Set<T>();
		}

		public async Task AddAsync(T entity) => await _dbSet.AddAsync(entity);
	

		public async Task<IEnumerable<T>> GetAllAsync() => await _dbSet.ToListAsync();
	

		public async Task<T?> GetByIdAsync(int id) =>  await _dbSet.FindAsync(id);
			

		public void Update(T entity) => _dbSet.Update(entity);

		public async Task Delete(int id)
		{
			var entity = await _dbSet.FindAsync(id);
			if (entity != null)
			{
				_dbSet.Remove(entity);
			}
		}

		public async Task SaveChangesAsync()
		{
			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateException ex)
			{
				throw new AppException(AppError.InternalServerError, "Database operation failed.", ex);
			}
		}

		public async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate)
		{
			return await _dbSet.AnyAsync(predicate);
		}
	}
}