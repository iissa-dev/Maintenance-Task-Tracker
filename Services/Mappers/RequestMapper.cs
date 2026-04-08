using Core.DTOs.RequestDtos;
using Core.Entities;

namespace Services.Mappers
{
	public static class RequestMapper
	{
		public static ResponseRequestDto ToResponseDto(this MaintenanceRequest request)
		{
			return new ResponseRequestDto
			{
				Id = request.Id,
				Description = request.Description,
				Status = request.Status.ToString(),
				CreatedAt = request.CreatedAt,
				CategoryName = request.Category.Name,
				CategoryId = request.CategoryId,
				CustomerName = request.CreatedBy.UserName ?? "UnKnown"
			};
		}
	}
}
