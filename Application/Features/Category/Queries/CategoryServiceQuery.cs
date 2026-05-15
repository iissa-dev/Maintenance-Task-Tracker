using Application.DTOs.CategoryDto;
using Application.Interfaces.Common;
using Application.Interfaces.IRepository;
using Application.Interfaces.IServices;
using Application.Results;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Category.Queries;

public class CategoryServiceQuery : ICategoryServiceQuery
{
    private readonly ICategoryRepository _repository;
    private readonly IAppDbContext _context;

    public CategoryServiceQuery(ICategoryRepository repository, IAppDbContext context)
    {
        _repository = repository;
        _context = context;
    }
    
    public async Task<Result<IEnumerable<CategoryResponseDto>>> GetAllAsync()
    {
        var dto = await _context.Category
            .AsNoTracking()
            .Select(c => new CategoryResponseDto { Id = c.Id, Name = c.Name })
            .ToListAsync();

        return Result<IEnumerable<CategoryResponseDto>>.Success(dto);
    }

    public async Task<Result<CategoryResponseDto>> GetByIdAsync(int id)
    {
        var category = await _repository.GetByIdAsync(id);

        if (category == null)
        {
            return Result<CategoryResponseDto>.Failure("Category not found.", AppError.NotFound);
        }

        var dto = new CategoryResponseDto { Name = category.Name, Id = category.Id };

        return Result<CategoryResponseDto>.Success(dto);
    }

    public async Task<Result<IEnumerable<CategoryWithRequestCountDto>>> GetTopThreeCategory(int userId, string role)
    {
        var query = _context.Category
            .AsNoTracking();
        
           var topThreeCategories = await query
            .Select(c => new CategoryWithRequestCountDto
            {
                Id = c.Id,
                Name = c.Name,
                RequestCount = role == nameof(RoleName.Client) 
                ? c.MaintenanceRequests.Count(r => r.CreatedByUserId == userId)
                : role == nameof(RoleName.Employee)
                ? c.MaintenanceRequests.Count(r => r.AssignedToUserId == userId)
                : c.MaintenanceRequests.Count
                
            })
            .Where(x => x.RequestCount > 0)
            .OrderByDescending(c => c.RequestCount)
            .Take(3)
            .ToListAsync();

        return Result<IEnumerable<CategoryWithRequestCountDto>>.Success(topThreeCategories);
    }
}