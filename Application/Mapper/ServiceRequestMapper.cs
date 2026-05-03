using Application.DTOs.CategoryDto;
using Application.DTOs.ServiceRequestDto;
using Domain.Entities;

namespace Application.Mapper
{
    public static class ServiceRequestMapper
    {
        public static IQueryable<ServiceRequestResponseDto> ToDto(this IQueryable<ServiceRequest> query)
        {
            return query.Select(s => new ServiceRequestResponseDto
            {
                CategoryDto = new CategoryResponseDto { Id = s.CategoryId, Name = s.Category.Name },
                Description = s.Description,
                Price = s.Price,
                Name = s.Name,
                ServiceId = s.Id
            });
        }

        public static ServiceRequest ToEntity(this AddServiceRequestDto dto)
        {
            return new ServiceRequest
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                CategoryId = dto.CategoryId,
            };
        }
    }
}