using Application.DTOs.ServiceRequestDto;
using Application.Results;

namespace Application.Interfaces.IServices;

public interface IServiceRequestCommand
{
    Task<Result> AddServiceRequestAsync(AddServiceRequestDto dto);
        
    Task<Result> DeleteAsync(int id);

    Task<Result> UpdateAsync(int id, UpdateServiceRequestDto dto);
}