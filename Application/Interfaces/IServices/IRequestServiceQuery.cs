using Application.DTOs.Page;
using Application.DTOs.RequestDto;
using Application.Results;

namespace Application.Interfaces.IServices
{
	public interface IRequestServiceQuery
	{
		Task<Result<ResultPage<ResponseRequestDto>>> GetAllAsync(int? categoryId, int pageNumber, int pageSize, int userId, string role);
		Task<Result<ResponseRequestDto>> GetByIdAsync(int id);
		Task<Result<DashboardStatsDto>> GetDashboardStatsAsync(int userId, string role);
		Task<Result<IEnumerable<ResponseRequestDto>>> GetRecentActivity(int userId, string role);
	}
}
