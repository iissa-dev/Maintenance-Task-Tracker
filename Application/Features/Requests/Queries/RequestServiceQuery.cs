using Application.DTOs.Page;
using Application.DTOs.RequestDto;
using Application.Extensions;
using Application.Interfaces.Common;
using Application.Interfaces.IServices;
using Application.Mapper;
using Application.Results;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Requests.Queries;

public class RequestServiceQuery : IRequestServiceQuery
{
    private readonly IAppDbContext _context;

    public RequestServiceQuery(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Result<ResultPage<ResponseRequestDto>>> GetAllAsync(int? categoryId, int pageNumber, int pageSize)
    {
        var query = _context.MaintenanceRequest
            .AsNoTracking()
            .ToResponseDto();

        if (categoryId != null && categoryId.Value > 0)
            query = query.Where(s => s.CategoryId == categoryId.Value);

        var data = await query
            .OrderBy(q => q.Id)
            .ToPagedResultAsync(pageNumber, pageSize);

        return Result<ResultPage<ResponseRequestDto>>.Success(data);
    }


    public async Task<Result<ResponseRequestDto>> GetByIdAsync(int id)
    {
        var existing = await _context.MaintenanceRequest
            .AsNoTracking()
            .ToResponseDto()
            .FirstOrDefaultAsync(m => m.Id == id);

        return existing == null
            ? Result<ResponseRequestDto>.Failure("Request not found.", AppError.NotFound)
            : Result<ResponseRequestDto>.Success(existing);
    }

    public async Task<Result<DashboardStatsDto>> GetDashboardStatsAsync()
    {
        var grouped = await _context.MaintenanceRequest
            .AsNoTracking()
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
        var data = await _context.MaintenanceRequest
            .AsNoTracking()
            .ToResponseDto()
            .OrderByDescending(q => q.CreatedAt)
            .Take(4)
            .ToListAsync();

        return Result<IEnumerable<ResponseRequestDto>>.Success(data);
    }
}