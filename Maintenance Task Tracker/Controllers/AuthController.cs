using Core.DTOs.AuthDtos;
using Core.Interfaces.Service;
using Microsoft.AspNetCore.Mvc;

namespace Maintenance_Task_Tracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly ITokenService _tokenService;
        private readonly IHostEnvironment _env;

        public AuthController(IAccountService accountService, ITokenService tokenService, IHostEnvironment env)
        {
            _accountService = accountService;
            _tokenService = tokenService;
            _env = env;
        }

        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var result = await _accountService.RegisterAsync(dto);
            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await _accountService.LoginAsync(dto);
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
            if (refreshToken is null) return BadRequest(Result.Failure("Invalid Refresh Token Or you are not login", Core.Enums.AppError.BadRequest));
			var result = await _tokenService.RefreshTokenAsync(refreshToken);
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
		public async Task<IActionResult> Logout() {
            var refreshToken = Request.Cookies["refreshToken"];
            if (refreshToken is null) return BadRequest(Result.Failure("Invalid Refresh Token Or you are not login", Core.Enums.AppError.BadRequest));

            var result = await _accountService.Logout(refreshToken);
			if (!result.IsSuccess)
				return BadRequest(result);

			return Ok(result);
		}
	}
}
