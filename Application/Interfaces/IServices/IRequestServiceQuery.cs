using Application.DTOs.Page;
using Application.DTOs.RequestDto;
using Application.Results;

namespace Application.Interfaces.IServices
{
	public interface IRequestServiceQuery
	{
		Task<Result<ResultPage<ResponseRequestDto>>> GetAllAsync(int? categoryId, int pageNumber, int pageSize);
		Task<Result<ResponseRequestDto>> GetByIdAsync(int id);
		Task<Result<DashboardStatsDto>> GetDashboardStatsAsync();
		Task<Result<IEnumerable<ResponseRequestDto>>> GetRecentActivity();
	}
}
