namespace Core.DTOs.AuthDtos
{
	public class TokenResult
	{
		public string AccessToken { get; set; } = string.Empty;
		public string RefreshToken { get; set; } = string.Empty;
		public string UserName { get; set; } = string.Empty; 
		public string Role { get; set; } = string.Empty;
	}
}
