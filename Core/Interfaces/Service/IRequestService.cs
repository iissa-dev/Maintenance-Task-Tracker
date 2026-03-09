using Core.DTOs.Page;
using Core.DTOs.RequestDtos;

namespace Core.Interfaces.Service
{
	/// <include file='../../Docs/IRequestService.xml' path='doc/members/member[@name="T:Core.Interfaces.Service.IRequestService"]'/>
	public interface IRequestService
	{
		/// <include file='../../Docs/IRequestService.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.IRequestService.GetAllAsync(System.Int32,System.Int32)"]/*'/>
		Task<ResultPage<ResponseRequestDto>> GetAllAsync(int pageNumber, int pageSize);

		/// <include file='../../Docs/IRequestService.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.IRequestService.GetByIdAsync(System.Int32)"]/*'/>
		Task<Result<ResponseRequestDto>> GetByIdAsync(int id);

		/// <include file='../../Docs/IRequestService.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.IRequestService.AddAsync(Core.DTOs.RequestDtos.RequestDto)"]/*'/>
		Task<Result> AddAsync(RequestDto request, int userId);

		/// <include file='../../Docs/IRequestService.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.IRequestService.UpdateAsync(System.Int32,Core.DTOs.RequestDtos.UpdateRequestDto)"]/*'/>
		Task<Result> UpdateAsync(int id, UpdateRequestDto request);

		/// <include file='../../Docs/IRequestService.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.IRequestService.DeleteAsync(System.Int32)"]/*'/>
		Task<Result> DeleteAsync(int id);

		/// <include file='../../Docs/IRequestService.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.IRequestService.UpdateStatusAsync(System.Int32,System.Int32)"]/*'/>
		Task<Result> UpdateStatusAsync(int id, int status);

		/// <include file='../../Docs/IRequestService.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.IRequestService.GetRecentActivity"]/*'/>
		Task<Result<IEnumerable<ResponseRequestDto>>> GetRecentActivity();

		/// <include file='../../Docs/IRequestService.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.IRequestService.GetDashboardStatsAsync"]/*'/>
		Task<Result<DashboardStatsDto>> GetDashboardStatsAsync();
	}
}
