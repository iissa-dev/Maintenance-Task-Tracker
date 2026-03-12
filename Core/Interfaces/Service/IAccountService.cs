using Core.DTOs.AuthDtos;
using Core.Enums;

namespace Core.Interfaces.Service
{
	/// <include file='../../Docs/IAccountService.xml'
	///          path='doc/members/member[@name="T:Core.Interfaces.Service.IAccountService"]/*'/>
	public interface IAccountService
	{

		Task<Result> CreateUserAsync(RegisterDto dto, RoleName roleName);

		/// <include file='../../Docs/IAccountService.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.IAccountService.LoginAsync(Core.DTOs.AuthDtos.LoginDto)"]/*'/>
		Task<Result<TokenResult>> LoginAsync(LoginDto dto);

		/// <include file='../../Docs/IAccountService.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.IAccountService.RegisterAsync(Core.DTOs.AuthDtos.RegisterDto)"]/*'/>
		Task<Result> RegisterAsync(RegisterDto registerDto);

		Task<Result> Logout(string refreshToken);
	}
}
