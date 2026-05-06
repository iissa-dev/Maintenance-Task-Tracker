using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Application.Interfaces.Common
{
	public interface IAppDbContext
	{
		DbSet<Person> People { get; }
		DbSet<UserRefreshToken> RefreshTokens { get; }
		DbSet<Category> Category { get; }
		DbSet<MaintenanceRequest> MaintenanceRequest { get; }
		DbSet<ServiceRequest> ServiceRequests { get; }
		DbSet<ApplicationUser> Users { get; }
		DbSet<IdentityUserRole<int>> UserRoles { get; }
		DbSet<ApplicationRole> Roles { get; }
		Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
		Task<IDbContextTransaction> BeginTransactionAsync();
	}
}
