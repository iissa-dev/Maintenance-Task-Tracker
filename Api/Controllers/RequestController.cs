using Application.DTOs.RequestDto;
using Application.Interfaces.IServices;
using Application.Results;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class RequestController : ControllerBase
	{
		private readonly IRequestServiceCommand _command;
		private readonly IRequestServiceQuery _query;

		public RequestController(IRequestServiceCommand command, IRequestServiceQuery query)
		{
			_command = command;
			_query = query;
		}

		[HttpPost("addNewRequest")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[Authorize]
		public async Task<IActionResult> AddRequest([FromBody] RequestDto request)
		{
			var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
			if (userIdClaim is null)
				return Unauthorized(Result.Failure("User not identified.", AppError.Unauthorized));

			var userId = int.Parse(userIdClaim.Value);
			var result = await _command.AddAsync(request, userId);
			if (result.IsSuccess)
				return Ok(result);

			return BadRequest(result);
		}

		[HttpGet("GetAllRequest")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		public async Task<IActionResult> GetAllRequests(int? categoryId, int pageNumber = 1, int pageSize = 10)
		{
			var result = await _query.GetAllAsync(categoryId, pageNumber, pageSize);
			return Ok(result);
		}

		[HttpGet("{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<IActionResult> GetRequestById(int id)
		{
			var result = await _query.GetByIdAsync(id);
			if (result.IsSuccess)
				return Ok(result);

			return NotFound(result);
		}

		[HttpPut("{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		public async Task<IActionResult> UpdateRequest(int id, [FromBody] UpdateRequestDto request)
		{
			var result = await _command.UpdateAsync(id, request);
			if (result.IsSuccess)
				return Ok(result);

			return BadRequest(result);
		}

		[HttpDelete("{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		public async Task<IActionResult> DeleteRequest(int id)
		{
			var result = await _command.DeleteAsync(id);
			if (result.IsSuccess)
				return Ok(result);

			return BadRequest(result);
		}

		[HttpPut("status/{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> UpdateRequestStatus(int id, [FromQuery] int status)
		{
			var result = await _command.UpdateStatusAsync(id, status);
			if (result.IsSuccess)
				return Ok(result);

			return BadRequest(result);
		}

		[HttpGet("recentActivity")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		public async Task<IActionResult> GetRecentActivity()
		{
			var result = await _query.GetRecentActivity();
			return Ok(result);
		}

		[HttpGet("dashboardStats")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		public async Task<IActionResult> GetDashboardStats()
		{
			var result = await _query.GetDashboardStatsAsync();
			return Ok(result);
		}
	}

}
