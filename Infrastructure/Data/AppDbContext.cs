using Application.Interfaces.Common;
using Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Infrastructure.Data
{
	public class AppDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, int>, IAppDbContext
	{
		public DbSet<Person> People { get; set; }
		public DbSet<UserRefreshToken> RefreshTokens { get; set; }
		public DbSet<Category> Category { get; set; }
		public DbSet<MaintenanceRequest> MaintenanceRequest { get; set; }
		public DbSet<ServiceRequest> ServiceRequests { get; set; }
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);
			builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
		}
		public async Task<IDbContextTransaction> BeginTransactionAsync()
			=> await Database.BeginTransactionAsync();
	}
}
