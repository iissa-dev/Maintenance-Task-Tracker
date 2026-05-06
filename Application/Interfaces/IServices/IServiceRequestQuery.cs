using Application.DTOs.Page;
using Application.DTOs.ServiceRequestDto;
using Application.Results;

namespace Application.Interfaces.IServices;

public interface IServiceRequestQuery
{
    Task<Result<ResultPage<ServiceRequestResponseDto>>>
        GetAllServiceAsync(int pageNumber, int pageSize, int? categoryId = null, string? search = null);
}