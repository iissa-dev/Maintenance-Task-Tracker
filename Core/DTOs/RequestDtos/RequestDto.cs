namespace Core.DTOs.RequestDtos
{
	// DTO for creating or updating a maintenance request
	public class RequestDto
	{
		public string Description { get; set; } = string.Empty;
		public string CustomerName { get; set; } = string.Empty;
		public int CategoryId { get; set; }
	}
}
