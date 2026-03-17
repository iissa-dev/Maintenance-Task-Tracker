using Core.DTOs.ServiceRequestDto;
using Core.Entities;

namespace Services.Mappers
{
	public static class ServiceRequestMapper
	{
		public static ServiceRequestResponseDto ToDto(this ServiceRequest s) =>
		new ServiceRequestResponseDto
		{
			CategoryName = s.Category.Name,
			Description = s.Description,
			Price = s.Price,
			Name = s.Name,
			ServiceId = s.Id
		};

		public static ServiceRequest ToEntity(this UpdateServiceRequestDto dto, ServiceRequest existing)
		{
			existing.Name = dto.Name;
			existing.Description = dto.Description;
			existing.Price = dto.Price;
			existing.CategoryId = dto.CategoryId;
			return existing;
		}
	}
}
