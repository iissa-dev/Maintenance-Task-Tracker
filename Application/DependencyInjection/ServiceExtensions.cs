using Application.Features.Admin.Commands;
using Application.Features.Admin.Queries;
using Application.Features.Category.Commands;
using Application.Features.Category.Queries;
using Application.Features.Requests.Commands;
using Application.Features.Requests.Queries;
using Application.Features.ServiceRequest.Commands;
using Application.Features.ServiceRequest.Queries;
using Application.Interfaces.IServices;
using Microsoft.Extensions.DependencyInjection;

namespace Application.DependencyInjection
{
	public static class ServiceExtensions
	{
		public static IServiceCollection AddApplicationsServices(this IServiceCollection services)
		{
			services.AddScoped<ICategoryServiceQuery, CategoryServiceQuery>();
			services.AddScoped<ICategoryServiceCommand, CategoryServiceCommand>();
			services.AddScoped<IServiceRequestCommand, ServiceRequestCommand>();
			services.AddScoped<IServiceRequestQuery, ServiceRequestQuery>();
			services.AddScoped<IRequestServiceCommand, RequestServiceCommand>();
			services.AddScoped<IRequestServiceQuery, RequestServiceQuery>();
			services.AddScoped<IAdminServiceCommand, AdminServiceCommand>();
			services.AddScoped<IAdminServiceQuery, AdminServiceQuery>();
			return services;
		}
	}
}
