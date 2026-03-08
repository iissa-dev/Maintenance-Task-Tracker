using Microsoft.AspNetCore.Identity;

namespace Core.Entities
{
	public class ApplicationUser: IdentityUser<int> {

		public int PerosnId { get; set; }

		public Person Person { get; set; } = new Person();
	}
}
