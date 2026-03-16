using System.ComponentModel.DataAnnotations;

namespace Core.DTOs.UserDtos
{
	public class UpdateUserDto {
		[Required]
		public string FirstName { get; set; } = string.Empty;
		[Required]
		public string LastName { get; set; } = string.Empty;

		[EmailAddress]
		public string Email { get; set; } = string.Empty;
		[MinLength(6)]
		public string UserName { get; set; } = string.Empty;

	}
}
