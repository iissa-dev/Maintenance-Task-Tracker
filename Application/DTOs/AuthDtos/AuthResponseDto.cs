namespace Application.DTOs.AuthDtos
{
	public class AuthResponseDto
	{
		public string AccessToken { get; set; } = string.Empty;
		public string UserName { get; set; } = string.Empty;
		public string Role { get; set; } = string.Empty;
	}
}
