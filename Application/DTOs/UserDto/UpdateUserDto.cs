using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Application.DTOs.UserDto
{
	public class UpdateUserDto
	{
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
