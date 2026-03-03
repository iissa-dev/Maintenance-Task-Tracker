

using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Repositories.Data
{
	public class AppDbContext : DbContext
	{

		public DbSet<Category> Categories { get; set; }
		public DbSet<MaintenanceRequest> Requests { get; set; }

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
