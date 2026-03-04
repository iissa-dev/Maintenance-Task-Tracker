using Core.DTOs.Page;
using Core.DTOs.RequestDtos;

namespace Core.Interfaces.Service
{
	public interface IRequestService
	{
		Task<ResultPage<ResponseRequestDto>> GetAllAsync(int pageNumber, int pageSize);
		Task<Result<ResponseRequestDto>> GetByIdAsync(int id);
		Task<Result> AddAsync(RequestDto request);
		Task<Result> UpdateAsync(int id, RequestDto request);
		Task<Result> DeleteAsync(int id);
		Task<Result> UpdateStatusAsync(int id, int status);
		Task <Result<IEnumerable<ResponseRequestDto>>> GetRecentActivity();

		Task<Result<DashboardStatsDto>> GetDashboardStatsAsync();
	}
}
