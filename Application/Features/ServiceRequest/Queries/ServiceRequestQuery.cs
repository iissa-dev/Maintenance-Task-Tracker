using Application.DTOs.Page;
using Application.DTOs.ServiceRequestDto;
using Application.Extensions;
using Application.Interfaces.Common;
using Application.Interfaces.IRepository;
using Application.Interfaces.IServices;
using Application.Mapper;
using Application.Results;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.ServiceRequest.Queries;

public class ServiceRequestQuery :  IServiceRequestQuery
{
    private readonly IAppDbContext _context;

    public ServiceRequestQuery(IAppDbContext context)
    {
        _context = context;
    }
    public async Task<Result<ResultPage<ServiceRequestResponseDto>>> GetAllServiceAsync(
        int pageNumber,
        int pageSize,
        int? categoryId = null,
        string? searchByName = null)
    {
        var query = _context.ServiceRequests.AsNoTracking();

        // Filter
        if (categoryId != null)
            query = query.Where(s => s.CategoryId == categoryId.Value);

        if (!string.IsNullOrWhiteSpace(searchByName))
            query = query.Where(s => s.Name.Contains(searchByName));

        var data = await query
            .OrderBy(s => s.Id)
            .ToDto()
            .ToPagedResultAsync(pageNumber, pageSize);

        return Result<ResultPage<ServiceRequestResponseDto>>.Success(data);
    }
}