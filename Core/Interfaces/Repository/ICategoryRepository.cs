using Core.Entities;

namespace Core.Interfaces.Repository
{
	public interface ICategoryRepository
	{
		IQueryable<Category> GetTopThreeCategory();
	}
}
	