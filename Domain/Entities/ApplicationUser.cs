using Microsoft.AspNetCore.Identity;

namespace Domain.Entities
{
	public class ApplicationUser : IdentityUser<int>
	{
		public int PersonId { get; set; }

		public Person Person { get; set; } = null!;
	}
}
