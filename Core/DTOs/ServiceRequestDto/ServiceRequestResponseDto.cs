namespace Core.DTOs.ServiceRequestDto
{
	public class ServiceRequestResponseDto {

		public int ServiceId { get; set; }
		public string Name { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;
		public decimal? Price { get; set; }
		public CategoryDto CategoryDto { get; set; } = null!;

	}
}
