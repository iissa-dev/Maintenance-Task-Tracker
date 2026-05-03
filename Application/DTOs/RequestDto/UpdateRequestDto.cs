namespace Application.DTOs.RequestDto;

public class UpdateRequestDto
{
    public string Description { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public int Status { get; set; }
}