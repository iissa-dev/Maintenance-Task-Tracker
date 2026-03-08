
namespace Core.DTOs.RequestDtos;

public class UpdateRequestDto
{
    	public string Description { get; set; } = string.Empty;
		public string CustomerName { get; set; } = string.Empty;
		public int CategoryId { get; set; }
        public int Status { get; set; }
}
