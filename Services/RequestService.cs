using AutoMapper;
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
		private readonly IMapper _mapper;
		public RequestService(IRepository<MaintenanceRequest> repository, IMapper mapper, IRequestRepository requestRepository)
		{
			_repository = repository;
			_mapper = mapper;
			_requestRepository = requestRepository;
		}

		public async Task<Result> AddAsync(RequestDto request)
		{
			if(request == null || string.IsNullOrWhiteSpace(request.CustomerName))
				return Result.Failure("Invalid request data.", AppError.BadRequest);


			await _repository.AddAsync(_mapper.Map<MaintenanceRequest>(request));
			await _repository.SaveChangesAsync();
			return Result.Success("Request added successfully.");
		}

		public async Task<Result> DeleteAsync(int id)
		{
			if(id < 1) 
				return Result.Failure("Invalid request ID.", AppError.BadRequest);

			if (!await _repository.ExistsAsync(r => r.Id == id))
			{
				return Result.Failure("Request not found.", AppError.NotFound);
			}

			await _repository.Delete(id);
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

			var dto = _mapper.Map<IEnumerable<ResponseRequestDto>>(items);

			return new ResultPage<ResponseRequestDto>
			{
				Items = dto,
				TotalItems = totalItems,
				TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
				PageNumber = pageNumber,
				PageCount = pageSize
			};
		}
			
		public async Task<Result<ResponseRequestDto>> GetByIdAsync(int id)
		{
			var existing = await _requestRepository.GetByIdAsync(id);

			if (existing == null)
				return Result<ResponseRequestDto>.Failure("Request not found.", AppError.NotFound);

			var dto = _mapper.Map<ResponseRequestDto>(existing);

			return Result<ResponseRequestDto>.Success(dto);
		}

		public async Task<Result<DashboardStatsDto>> GetDashboardStatsAsync()
		{
			var query = _requestRepository.GetAllAsync();

			var groubed = await query
				.GroupBy(r => r.Status)
				.Select(g => new
				{
					Status = g.Key,
					Count = g.Count()
				})
				.ToListAsync();

			var status = new DashboardStatsDto
			{
				TotalRequests = groubed.Sum(g => g.Count),
				PendingCount = groubed.FirstOrDefault(g => g.Status == RequestStatus.Pending)?.Count ?? 0,
				InProgressCount = groubed.FirstOrDefault(g => g.Status == RequestStatus.InProgress)?.Count ?? 0,
				CompletedCount = groubed.FirstOrDefault(g => g.Status == RequestStatus.Completed)?.Count ?? 0
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

			var dto = _mapper.Map<IEnumerable<ResponseRequestDto>>(recentItems);

			return Result<IEnumerable<ResponseRequestDto>>.Success(dto);
		}

		public async Task<Result> UpdateAsync(int id, UpdateRequestDto request)
		{
			var existing = await _repository.GetByIdAsync(id);

			if(existing == null)
				return Result.Failure("Request not found.", AppError.NotFound);

			var entity = _mapper.Map(request, existing);

			_repository.Update(entity);
			await _repository.SaveChangesAsync();

			return Result.Success("Request updated successfully.");
		}

		public async Task<Result> UpdateStatusAsync(int id, int status)
		{
			var existing = await _repository.GetByIdAsync(id);

			if(existing == null)
				return Result.Failure("Request not found.", AppError.NotFound);

			if(existing.Status == (RequestStatus)status)
				return Result.Failure("Request already has the specified status.", AppError.BadRequest);

			if(existing.Status == RequestStatus.Completed)
				return Result.Failure("Cannot change status of a completed request.", AppError.BadRequest);

			await _requestRepository.UpdateStatusAsync(id, status);

			return Result.Success("Request status updated successfully.");
		}
	}
}