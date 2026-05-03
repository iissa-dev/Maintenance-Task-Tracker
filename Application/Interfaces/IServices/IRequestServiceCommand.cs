using Application.DTOs.RequestDto;
using Application.Results;

namespace Application.Interfaces.IServices
{
	public interface IRequestServiceCommand
	{
		Task<Result> AddAsync(RequestDto request, int userId);
		Task<Result> DeleteAsync(int id);
		Task<Result> UpdateAsync(int id, UpdateRequestDto request);
		Task<Result> UpdateStatusAsync(int id, int status);
	}

}
