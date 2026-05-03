using Application.DTOs.CategoryDto;
using Application.Results;

namespace Application.Interfaces.IServices;

public interface ICategoryServiceCommand
{
    
    Task<Result> AddAsync(CategoryResponseDto category);

    Task<Result> UpdateAsync(CategoryResponseDto category);

    Task<Result> DeleteAsync(int id);

}