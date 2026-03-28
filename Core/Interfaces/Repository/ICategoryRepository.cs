using Core.Entities;

namespace Core.Interfaces.Repository
{
	public interface ICategoryRepository : IRepository<Category>
	{
		/// <summary>
		/// Returns a queryable of the top three categories ordered by request count.
		/// </summary>
		IQueryable<Category> GetAllWithIncludesAsync();
	}
}
	