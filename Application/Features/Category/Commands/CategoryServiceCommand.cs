using Application.DTOs.CategoryDto;
using Application.Interfaces.Common;
using Application.Interfaces.IRepository;
using Application.Interfaces.IServices;
using Application.Results;
using Domain.Enums;

namespace Application.Features.Category.Commands;

public class CategoryServiceCommand : ICategoryServiceCommand
{
    private readonly ICategoryRepository _repository;
    private readonly IAppDbContext _context;

    public CategoryServiceCommand(ICategoryRepository repository, IAppDbContext context)
    {
        _repository = repository;
        _context = context;
    }
    
    public async Task<Result> AddAsync(CategoryResponseDto category)
    {
        if (await _repository.ExistsAsync(c => c.Name == category.Name))
        {
            return Result.Failure("Category already exists.", AppError.Conflict);
        }


        _repository.Add(new Domain.Entities.Category { Name = category.Name });
        await _context.SaveChangesAsync();
        return Result.Success("Category added successfully.");
    }

    public async Task<Result> DeleteAsync(int id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing is null)
        {
            return Result.Failure("Category not found.", AppError.NotFound);
        }

        _repository.Delete(existing);
        await _context.SaveChangesAsync();
        return Result.Success("Category deleted successfully.");
    }

    public async Task<Result> UpdateAsync(CategoryResponseDto category)
    {
        var existingCategory = await _repository.GetByIdAsync(category.Id);

        if (existingCategory == null)
        {
            return Result.Failure("Category not found.", AppError.NotFound);
        }

        existingCategory.Name = category.Name;

        _repository.Update(existingCategory);
        await _context.SaveChangesAsync();
        return Result.Success("Category updated successfully.");
    }
}