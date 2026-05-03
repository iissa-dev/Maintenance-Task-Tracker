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

    public async Task<Result<IEnumerable<CategoryWithRequestCountDto>>> GetTopThreeCategory()
    {
        var topThreeCategories = await _context.Category
            .Include(c => c.MaintenanceRequests)
            .OrderByDescending(c => c.MaintenanceRequests.Count)
            .Take(3)
            .Select(c => new CategoryWithRequestCountDto
            {
                Id = c.Id,
                Name = c.Name,
                RequestCount = c.MaintenanceRequests.Count
            })
            .ToListAsync();

        return Result<IEnumerable<CategoryWithRequestCountDto>>.Success(topThreeCategories);
    }
}