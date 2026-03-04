

using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Repositories.Data
{
	public class AppDbContext : DbContext
	{

		public DbSet<Category> Category { get; set; }
		public DbSet<MaintenanceRequest> MaintenanceRequest { get; set; }

		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
		{
		}

		override protected void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);
			modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

			modelBuilder.Entity<Category>().HasData(
				new Category { Id = 1, Name = "Electrical" },
				new Category { Id = 2, Name = "Plumbing" }
			);
		}
	}
}
