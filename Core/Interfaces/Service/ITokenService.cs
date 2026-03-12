using Core.DTOs.AuthDtos;
using Core.Entities;

namespace Core.Interfaces.Service
{

	/// <include file='../../Docs/ITokenService.xml' 
	///          path='doc/members/member[@name="T:Core.Interfaces.Service.ITokenService"]/*'/>
	public interface ITokenService
	{

		/// <include file='../../Docs/ITokenService.xml' 
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.ITokenService.GenerateAccessTokenAsync(Core.Entities.ApplicationUser)"]/*'/>
		Task<string> GenerateAccessTokenAsync(ApplicationUser user);

		/// <include file='../../Docs/ITokenService.xml' 
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.ITokenService.GenerateRefreshTokenAsync(System.Int32)"]/*'/>
		Task<UserRefreshToken> GenerateRefreshTokenAsync(int userId);

		/// <include file='../../Docs/ITokenService.xml' 
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.ITokenService.RefreshTokenAsync(System.String)"]/*'/>
		Task<Result<TokenResult>> RefreshTokenAsync(string refreshToken);

		/// <include file='../../Docs/ITokenService.xml' 
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.ITokenService.RevokeTokenAsync(System.String)"]/*'/>
		Task<Result> RevokeTokenAsync(string refreshToken);
	}
}
