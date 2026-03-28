using Core.Interfaces.Service;
using Microsoft.Extensions.DependencyInjection;

namespace Services.DependencyInjection
{
	public static class ServiceExtensions
	{
		public static IServiceCollection AddApplicationsServices(this IServiceCollection Services) {

			Services.AddScoped<ICategoryService, CategoryServcie>();
			Services.AddScoped<IAccountService, AccountService>();
			Services.AddScoped<ITokenService, TokenService>();
			Services.AddScoped<IAdminService, AdminService>();
			Services.AddScoped<IServiceRequest, ServiceRequestService>();
			Services.AddScoped<IRequestService, RequestService>();


			return Services;
		}
	}
}