namespace Core.Interfaces
{
	public interface IRepository<T> where T : class
	{
		Task<T?> GetByIdAsync(int id);
		Task<IEnumerable<T>> GetAllAsync();
		Task AddAsync(T entity);

		void Update(T entity);	
		Task Delete(int id);
		Task SaveChangesAsync();
	}
}
