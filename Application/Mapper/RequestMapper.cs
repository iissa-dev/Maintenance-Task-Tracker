using Application.DTOs.RequestDto;
using Domain.Entities;

namespace Application.Mapper
{
	public static class RequestMapper
	{
		public static IQueryable<ResponseRequestDto> ToResponseDto(this IQueryable<MaintenanceRequest> query)
		{
			return query.Select(request => new ResponseRequestDto
			{
				Id = request.Id,
				Description = request.Description,
				Name = request.ServiceRequest.Name,
				Status = request.Status.ToString(),
				CreatedAt = request.CreatedAt,
				CategoryName = request.Category.Name,
				CategoryId = request.CategoryId,
				CustomerName = request.CreatedBy.UserName ?? "UnKnown"
			});
		}
	}
}