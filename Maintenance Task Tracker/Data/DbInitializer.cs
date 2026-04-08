using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Repositories.Data;

namespace Maintenance_Task_Tracker.Data
{
	public static class DbInitializer
	{
		public static async Task SeedAsync(this IServiceProvider serviceProvider)
		{
			using var scope = serviceProvider.CreateScope();
			var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
			var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
			var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();

			// 1. Seed Roles
			string[] roles = { "Admin", "Employee", "Client" };
			foreach (var role in roles)
			{
				if (!await roleManager.RoleExistsAsync(role))
				{
					await roleManager.CreateAsync(new ApplicationRole { Name = role });
				}
			}

			// 2. Seed Categories
			if (!context.Category.Any())
			{
				context.Category.AddRange(
					new Category { Name = "Electrical" },
					new Category { Name = "Plumbing" }
				);
				await context.SaveChangesAsync();
			}

			// 3. Seed Admin User
			var adminEmail = "admin@gmail.com";
			if (await userManager.FindByEmailAsync(adminEmail) == null)
			{
				// Create Person first
				var adminPerson = new Person
				{
					FirstName = "issa",
					SecondName = "dev",
					ThirdName = "dev",
					LastName = "dev",
					PhoneNumber = "1234567890",
					BirthDate = new DateTime(2004, 10, 6)
				};

				context.People.Add(adminPerson);
				await context.SaveChangesAsync(); // Generates ID for Person

				var adminUser = new ApplicationUser
				{
					UserName = "admin",
					Email = adminEmail,
					EmailConfirmed = true,
					PersonId = adminPerson.Id
				};

				var result = await userManager.CreateAsync(adminUser, "Admin@123");
				if (result.Succeeded)
				{
					await userManager.AddToRoleAsync(adminUser, "Admin");
				}
			}
		}
	}
}
