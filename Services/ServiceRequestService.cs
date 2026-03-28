using Core.DTOs.Page;
using Core.DTOs.ServiceRequestDto;
using Core.Entities;
using Core.Enums;
using Core.Extensions;
using Core.Interfaces.Repository;
using Core.Interfaces.Service;
using Services.Mappers;

namespace Services
{
	public class ServiceRequestService : IServiceRequest
	{
		private readonly IServiceRequestRepository _repository;

		public ServiceRequestService(IServiceRequestRepository repository)
		{
			_repository = repository;
		}

		public async Task<Result> AddServiceRequestAsync(AddServiceRequestDto dto)
		{
			if (dto is null) return Result.Failure("Invalid Data", AppError.BadRequest);

			await _repository.AddAsync(new ServiceRequest
			{
				Name = dto.Name,
				Description = dto.Description,
				Price = dto.Price,
				CategoryId = dto.CategoryId,
			});

			await _repository.SaveChangesAsync();

			return Result.Success("New Service Created");

		}

		public async Task<Result> DeleteAsync(int id)
		{
			var isDeleted = await _repository.DeleteAsync(id);
			if (!isDeleted) return Result.Failure("Service Not Found", AppError.NotFound);

			await _repository.SaveChangesAsync();
			return Result.Success("Service Deleted");
		}

		public async Task<Result<ResultPage<ServiceRequestResponseDto>>> GetAllServiceAsync(
		int pageNumber,
		int pageSize,
		int? categoryId = null,
		string? searchByName = null)
		{
			var query = _repository.GetAllWithIncludesAsync();

			// Filter
			if (categoryId != null)
				query = query.Where(s => s.CategoryId == categoryId.Value);

			if (!string.IsNullOrWhiteSpace(searchByName))
				query = query.Where(s => s.Name.Contains(searchByName ?? string.Empty));

			var data = await query
				.OrderBy(s => s.Id)
				.Select(s=> s.ToDto())
				.ToPagedResultAsync(pageNumber, pageSize);

			return Result<ResultPage<ServiceRequestResponseDto>>.Success(data);
		}

		public async Task<Result> UpdateAsync(int id, UpdateServiceRequestDto dto)
		{
			if (dto is null) return Result.Failure("Invalid Data", AppError.BadRequest);

			var existing = await _repository.GetByIdAsync(id);
			if (existing is null) return Result.Failure("Service Not Found.", AppError.NotFound);

			existing = dto.ToEntity(existing);
			_repository.Update(existing);

			await _repository.SaveChangesAsync();
			return Result.Success("Service Updated");
		}
	}
}