using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Repositories.Data
{
	public class AppDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, int>
	{
		public DbSet<Person> People { get; set; }
		public DbSet<UserRefreshToken> RefreshTokens { get; set; }
		public DbSet<Category> Category { get; set; }
		public DbSet<MaintenanceRequest> MaintenanceRequest { get; set; }
		public DbSet<ServiceRequest> ServiceRequests { get; set; }
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
		{
		}

		override protected void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);
			modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
		}
	}
}

