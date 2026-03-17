using Core.DTOs.Page;
using Core.DTOs.ServiceRequestDto;
using System.Linq.Expressions;

namespace Core.Interfaces.Service
{
	public interface IServiceRequest {

		Task<Result> AddServiceRequestAsync(AddServiceRequestDto dto);

		Task<Result<ResultPage<ServiceRequestResponseDto>>> 
		GetAllServiceAsync(int pageNumber, int pageSize, int? categoryId = null, string? search = null);

		Task<Result> DeleteAsync(int id);

		Task<Result> UpdateAsync(int id, UpdateServiceRequestDto dto);
		
	}
}
