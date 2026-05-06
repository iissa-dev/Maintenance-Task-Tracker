namespace Domain.Entities
{
	public class UserRefreshToken
	{
		public int Id { get; set; }
		public string RefreshToken { get; set; } = string.Empty;
		public int JwtId { get; set; }
		public bool IsRevoked { get; set; }
		public DateTime DateAdded { get; set; }
		public DateTime ExpiryDate { get; set; }

		public int UserId { get; set; }
		public ApplicationUser User { get; set; } = null!;
	}
}
