using Core.Interfaces.Repository;
using Microsoft.Extensions.DependencyInjection;

namespace Repositories.DependencyInjection
{
	public static class RepositoryServiceExtensions
	{
		public static IServiceCollection AddRepositoriesServiceExtensions(this IServiceCollection Services)
		{

			Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
			Services.AddScoped<IRequestRepository, RequestRepository>();
			Services.AddScoped<ICategoryRepository, CategoryRepository>();
			Services.AddScoped<IServiceRequestRepository, ServiceRequestRepository>();
			Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
			Services.AddScoped<IUserRepository, UserRepository>();
			Services.AddScoped<IPersonRepository, PersonRepository>();

			return Services;
		}
	}
}
