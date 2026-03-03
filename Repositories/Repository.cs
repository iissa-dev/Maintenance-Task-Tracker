using Core.Exceptions;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Repositories.Data;
using Core.Enums;
using System.Collections.Generic;
using System.Threading.Tasks;

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

		public async Task AddAsync(T entity)
		{
			try
			{
				await _dbSet.AddAsync(entity);
			}
			catch (DbUpdateException ex)
			{
				throw new AppException(AppError.InternalServerError, "Failed to add entity.", ex);
			}
		}

		public async Task<IEnumerable<T>> GetAllAsync()
		{
			try
			{
				return await _dbSet.ToListAsync();
			}
			catch (DbUpdateException ex)
			{
				throw new AppException(AppError.InternalServerError, "Failed to retrieve entities.", ex);
			}
		}

		public async Task<T?> GetByIdAsync(int id)
		{
			try
			{
				return await _dbSet.FindAsync(id);
			}
			catch (DbUpdateException ex)
			{
				throw new AppException(AppError.InternalServerError, "Failed to retrieve entity.", ex);
			}
		}

		public void Update(T entity)
		{
			try
			{
				_dbSet.Update(entity);
			}
			catch (DbUpdateException ex)
			{
				throw new AppException(AppError.InternalServerError, "Failed to update entity.", ex);
			}
		}

		public async Task Delete(int id)
		{
			try
			{
				var entity = await _dbSet.FindAsync(id);
				if (entity != null)
				{
					_dbSet.Remove(entity);
				}

			}
			catch (DbUpdateException ex)
			{
				throw new AppException(AppError.InternalServerError, "Failed to delete entity.", ex);
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
				throw new AppException(AppError.InternalServerError, "Failed to save changes.", ex);
			}
		}
	}
}