using Application.DTOs.AuthDtos;
using Application.Interfaces.IServices;
using Application.Results;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly IIdentityService _identityService;
		private readonly IHostEnvironment _env;

		public AuthController(IHostEnvironment env, IIdentityService identityService)
		{

			_env = env;
			_identityService = identityService;
		}

		[HttpPost("register")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> Register([FromBody] RegisterDto dto)
		{
			var result = await _identityService.RegisterAsync(dto);
			return result.IsSuccess ? Ok(result) : BadRequest(result);
		}

		[HttpPost("login")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public async Task<IActionResult> Login([FromBody] LoginDto dto)
		{
			var result = await _identityService.LoginAsync(dto);
			if (!result.IsSuccess) return Unauthorized(result);

			Response.Cookies.Append("refreshToken", result.Data!.RefreshToken, new CookieOptions
			{
				HttpOnly = true,
				Secure = _env.IsProduction(),
				SameSite = SameSiteMode.Strict,
				Expires = DateTime.UtcNow.AddDays(7)
			});

			return Ok(result);
		}

		[HttpPost("refresh")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public async Task<IActionResult> Refresh()
		{
			var refreshToken = Request.Cookies["refreshToken"];
			if (refreshToken is null) return BadRequest(Result.Failure("Invalid Refresh Token Or you are not login", AppError.BadRequest));
			var result = await _identityService.RefreshTokenAsync(refreshToken);
			if (!result.IsSuccess) return Unauthorized(result.ErrorCode);

			Response.Cookies.Append("refreshToken", result.Data!.RefreshToken, new CookieOptions
			{
				HttpOnly = true,
				Secure = _env.IsProduction(),
				SameSite = SameSiteMode.Strict,
				Expires = DateTimeOffset.UtcNow.AddDays(7)
			});

			return Ok(new AuthResponseDto
			{
				AccessToken = result.Data.AccessToken,
				UserName = result.Data.UserName,
				Role = result.Data.Role
			});
		}

		[HttpPut("logout")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> Logout()
		{
			var refreshToken = Request.Cookies["refreshToken"];
			if (refreshToken is null) return BadRequest(Result.Failure("Invalid Refresh Token Or you are not login", AppError.BadRequest));

			var result = await _identityService.LogoutAsync(refreshToken);

			Response.Cookies.Delete("refreshToken"); // Clean Revoked Cookies
			return result.IsSuccess ? Ok(result) : BadRequest(result);
		}
	}
	
}
