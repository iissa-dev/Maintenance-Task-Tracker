using Core.DTOs.AuthDtos;

namespace Core.Interfaces.Service
{
	/// <include file='../../Docs/IAccountService.xml'
	///          path='doc/members/member[@name="T:Core.Interfaces.Service.IAccountService"]/*'/>
	public interface IAccountService
	{

		/// <include file='../../Docs/IAccountService.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.IAccountService.RegisterAsync(Core.DTOs.AuthDtos.RegisterDto)"]/*'/>
		Task<Result<AuthResponseDto>> RegisterAsync(RegisterDto dto);

		/// <include file='../../Docs/IAccountService.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.IAccountService.LoginAsync(Core.DTOs.AuthDtos.LoginDto)"]/*'/>
		Task<Result<AuthResponseDto>> LoginAsync(LoginDto dto);
	}
}
