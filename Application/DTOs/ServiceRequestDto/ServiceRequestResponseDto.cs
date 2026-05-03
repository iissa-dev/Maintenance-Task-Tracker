using Application.DTOs.CategoryDto;

namespace Application.DTOs.ServiceRequestDto;

public class ServiceRequestResponseDto
{

    public int ServiceId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal? Price { get; set; }
    public CategoryResponseDto CategoryDto { get; set; } = null!;

}