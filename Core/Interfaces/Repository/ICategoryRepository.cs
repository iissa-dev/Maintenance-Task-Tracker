using Core.Entities;

namespace Core.Interfaces.Repository
{
	public interface ICategoryRepository
	{
		/// <summary>
		/// Returns a queryable of the top three categories ordered by request count.
		/// </summary>
		IQueryable<Category> GetCategoriesWithRequests();
	}
}
	