using Domain.Entities;
using Application.Interfaces.IRepository;
using Infrastructure.Data;

namespace Infrastructure.Repositories
{
	public class CategoryRepository(AppDbContext context) : GenericRepository<Category>(context), ICategoryRepository
	{
		
	}
}
