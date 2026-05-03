using Application.Interfaces.IRepository;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.Linq.Expressions;

namespace Infrastructure.Repositories
{
	public class GenericRepository<T> : IGenericRepository<T> where T : class
	{
		protected readonly AppDbContext Context;
		protected readonly DbSet<T> DbSet;

		public GenericRepository(AppDbContext context)
		{
			Context = context;
			DbSet = Context.Set<T>();
		}

		public void Add(T entity) =>  DbSet.Add(entity);


		public async Task<T?> GetByIdAsync(int id) => await DbSet.FindAsync(id);

		public void Update(T entity) => DbSet.Update(entity);

		public void Delete(T entity) => DbSet.Remove(entity);
		

		public async Task SaveChangesAsync()
		{
		
			await Context.SaveChangesAsync();
		}

		public async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate)
		{
			return await DbSet.AnyAsync(predicate);
		}

		public async Task<IDbContextTransaction> BeginTransactAsync()
			=> await Context.Database.BeginTransactionAsync();

		public async Task<TResult> ExecuteWithStrategyAsync<TResult>(Func<Task<TResult>> action)
		{
			var strategy = Context.Database.CreateExecutionStrategy();
			return await strategy.ExecuteAsync(action);
		}
	}
}
