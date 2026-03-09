using System.ComponentModel.DataAnnotations;

namespace Core.DTOs.AuthDtos
{
	public class LoginDto
	{
		[Required]
		public string UserName { get; set; } = string.Empty;

		[Required]
		public string Password { get; set; } = string.Empty;
	}
}
