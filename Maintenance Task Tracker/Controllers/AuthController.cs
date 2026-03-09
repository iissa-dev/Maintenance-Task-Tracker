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

        public AuthController(IAccountService accountService, ITokenService tokenService)
        {
            _accountService = accountService;
            _tokenService = tokenService;
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
            if (!result.IsSuccess)
                return Unauthorized(result);

            return Ok(result);
        }


        [HttpPost("refresh")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public async Task<IActionResult> Refresh([FromBody] string refreshToken)
        {
            var result = await _tokenService.RefreshTokenAsync(refreshToken);
            if (!result.IsSuccess)
                return Unauthorized(result);

            return Ok(result);
        }
    }
}
