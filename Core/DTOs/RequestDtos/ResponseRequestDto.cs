namespace Core.DTOs.RequestDtos
{
	// DTO for returning maintenance request details, including category name
	public class ResponseRequestDto
	{
		public int Id { get; set; }
		public string Description { get; set; } = string.Empty;
		public string Status { get; set; } = string.Empty;
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public int CategoryId { get; set; }
		public string CategoryName { get; set; } = string.Empty;
	}
}
