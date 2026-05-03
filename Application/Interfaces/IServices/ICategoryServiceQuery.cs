using Application.DTOs.CategoryDto;
using Application.Results;

namespace Application.Interfaces.IServices;

public interface ICategoryServiceQuery
{
    Task<Result<IEnumerable<CategoryResponseDto>>> GetAllAsync();
    Task<Result<IEnumerable<CategoryWithRequestCountDto>>> GetTopThreeCategory();
    Task<Result<CategoryResponseDto>> GetByIdAsync(int id);
}