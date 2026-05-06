using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.RequestDto;

// DTO for creating or updating a maintenance request
public class RequestDto
{
    [Required]
    public string Description { get; set; } = string.Empty;
    [Required]
    public int CategoryId { get; set; }
    [Required]
    public int ServiceRequestId { get; set; }
}