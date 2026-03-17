using Core.DTOs.ServiceRequestDto;
using Core.Interfaces.Repository;
using Core.Interfaces.Service;
using Core.Enums;
using Core.Entities;
using Core.DTOs.Page;
using Microsoft.EntityFrameworkCore;
using Services.Mappers;

namespace Services
{
	public class ServiceRequestService : IServiceRequest
	{
		private readonly IRepository<ServiceRequest> _repository;

		public ServiceRequestService(IRepository<ServiceRequest> repository)
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
			var query = _repository.GetAllAsync();

			// Filter
			if (categoryId != null)
				query = query.Where(s => s.CategoryId == categoryId.Value);
			if (!string.IsNullOrWhiteSpace(searchByName))
				query = query.Where(s => s.Name.Contains(searchByName ?? string.Empty));

			var totalItems = await query.CountAsync();

			var dto = await query
				.Include(s => s.Category)
				.OrderBy(s => s.Id)
				.Skip((pageNumber - 1) * pageSize)
				.Take(pageSize).Select(s => s.ToDto()).ToListAsync();


			var data = new ResultPage<ServiceRequestResponseDto>
			{
				Items = dto,
				TotalItems = totalItems,
				TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
				PageNumber = pageNumber,
				PageSize = pageSize
			};

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