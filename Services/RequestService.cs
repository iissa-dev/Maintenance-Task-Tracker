using Core.DTOs.Page;
using Core.DTOs.RequestDtos;
using Core.Entities;
using Core.Enums;
using Core.Interfaces.Repository;
using Core.Interfaces.Service;
using Microsoft.EntityFrameworkCore;

namespace Services
{
	public class RequestService : IRequestService
	{
		private readonly IRepository<MaintenanceRequest> _repository;
		private readonly IRequestRepository _requestRepository;
		public RequestService(IRepository<MaintenanceRequest> repository, IRequestRepository requestRepository)
		{
			_repository = repository;
			_requestRepository = requestRepository;
		}

		public async Task<Result> AddAsync(RequestDto request, int userId)
		{
			if (request == null)
				return Result.Failure("Invalid request data.", AppError.BadRequest);
			var entity = new MaintenanceRequest
			{
				Description = request.Description,
				CategoryId = request.CategoryId,
				CreatedByUserId = userId, // from token
				Status = RequestStatus.Pending,
				CreatedAt = DateTime.UtcNow
			};

			await _repository.AddAsync(entity);
			await _repository.SaveChangesAsync();
			return Result.Success("Request added successfully.");
		}

		public async Task<Result> DeleteAsync(int id)
		{
			if (id < 1)
				return Result.Failure("Invalid request ID.", AppError.BadRequest);
			var deleted = await _repository.DeleteAsync(id);
			if (!deleted)
				return Result.Failure("Request not found.", AppError.NotFound);

			await _repository.SaveChangesAsync();
			return Result.Success("Request deleted successfully.");
		}

		public async Task<ResultPage<ResponseRequestDto>> GetAllAsync(int pageNumber, int pageSize)
		{
			var query = _requestRepository.GetAllAsync();

			var totalItems = await query.CountAsync();
			var items = await query
				.OrderBy(q => q.Id)
				.Skip((pageNumber - 1) * pageSize)
				.Take(pageSize)
				.ToListAsync();

			var dto = items.Select(r => new ResponseRequestDto
			{
				Id = r.Id,
				Description = r.Description,
				Status = r.Status.ToString(),
				CreatedAt = r.CreatedAt,
				CategoryName = r.Category.Name,
				CategoryId = r.CategoryId
			});

			return new ResultPage<ResponseRequestDto>
			{
				Items = dto,
				TotalItems = totalItems,
				TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
				PageNumber = pageNumber,
				PageSize = pageSize
			};
		}

		public async Task<Result<ResponseRequestDto>> GetByIdAsync(int id)
		{
			var existing = await _requestRepository.GetByIdAsync(id);

			if (existing == null)
				return Result<ResponseRequestDto>.Failure("Request not found.", AppError.NotFound);

			var dto = new ResponseRequestDto
			{
				Id = existing.Id,
				Description = existing.Description,
				Status = existing.Status.ToString(),
				CreatedAt = existing.CreatedAt,
				CategoryName = existing.Category.Name,
				CategoryId = existing.CategoryId
			};

			return Result<ResponseRequestDto>.Success(dto);
		}

		public async Task<Result<DashboardStatsDto>> GetDashboardStatsAsync()
		{
			var query = _requestRepository.GetAllAsync();

			var grouped = await query
				.GroupBy(r => r.Status)
				.Select(g => new
				{
					Status = g.Key,
					Count = g.Count()
				})
				.ToListAsync();

			var status = new DashboardStatsDto
			{
				TotalRequests = grouped.Sum(g => g.Count),
				PendingCount = grouped.FirstOrDefault(g => g.Status == RequestStatus.Pending)?.Count ?? 0,
				InProgressCount = grouped.FirstOrDefault(g => g.Status == RequestStatus.InProgress)?.Count ?? 0,
				CompletedCount = grouped.FirstOrDefault(g => g.Status == RequestStatus.Completed)?.Count ?? 0
			};

			return Result<DashboardStatsDto>.Success(status);
		}

		public async Task<Result<IEnumerable<ResponseRequestDto>>> GetRecentActivity()
		{
			var query = _requestRepository.GetAllAsync();
			var recentItems = await query
				.OrderByDescending(q => q.CreatedAt)
				.Take(4)
				.ToListAsync();

			var dto = recentItems.Select(i => new ResponseRequestDto
			{
				Id = i.Id,
				CategoryId = i.CategoryId,
				Description = i.Description,
				CreatedAt = i.CreatedAt,
				Status = i.Status.ToString()
			});

			return Result<IEnumerable<ResponseRequestDto>>.Success(dto);
		}

		public async Task<Result> UpdateAsync(int id, UpdateRequestDto request)
		{
			var existing = await _repository.GetByIdAsync(id);

			if (existing == null)
				return Result.Failure("Request not found.", AppError.NotFound);

			existing.Description = request.Description;
			existing.CategoryId = request.CategoryId;
			existing.Status = (RequestStatus)request.Status;

			_repository.Update(existing);
			await _repository.SaveChangesAsync();

			return Result.Success("Request updated successfully.");
		}

		public async Task<Result> UpdateStatusAsync(int id, int status)
		{

			if (!Enum.IsDefined(typeof(RequestStatus), status))
				return Result.Failure("Invalid status value", AppError.BadRequest);

			var existing = await _repository.GetByIdAsync(id);

			if (existing == null)
				return Result.Failure("Request not found.", AppError.NotFound);

			if (existing.Status == (RequestStatus)status)
				return Result.Failure("Request already has the specified status.", AppError.BadRequest);

			if (existing.Status == RequestStatus.Completed)
				return Result.Failure("Cannot change status of a completed request.", AppError.BadRequest);

			await _requestRepository.UpdateStatusAsync(id, (RequestStatus)status);

			return Result.Success("Request status updated successfully.");
		}
	}
}