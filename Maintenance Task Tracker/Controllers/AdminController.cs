using Core.DTOs.AuthDtos;
using Core.DTOs.UserDtos;
using Core.Enums;
using Core.Interfaces.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Maintenance_Task_Tracker.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AdminController : ControllerBase
	{
		private readonly IAdminService _adminService;

		public AdminController(IAdminService adminService)
		{
			_adminService = adminService;
		}

		[HttpPost("CreateEmployeeAsync")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> CreateEmployeeAsync([FromBody] RegisterDto dto)
		{
			var result = await _adminService.CreateEmployeeAsync(dto);

			if (result.IsSuccess)
				return Ok(result);

			return BadRequest(result);
		}

		[HttpGet("Users")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> GetAllUsersAsync(int roleId, int pageNumber, int pageSize, string? searchByUserName)
		{

			if (!Enum.IsDefined((RoleName)roleId))
			{
				return BadRequest(Result.Failure("Invalid Role", AppError.BadRequest));
			}
			var result = await _adminService.GetAllUsersByRoleAsync((RoleName)roleId, pageNumber, pageSize, searchByUserName);
			if (result.IsSuccess)
				return Ok(result);

			return BadRequest(result);
		}
		[HttpPut("request/{requestId}/assign/{employeeId}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> AssignEmployee(int requestId, int employeeId)
		{
			var result = await _adminService.AssignEmployee(requestId, employeeId);
			if (result.IsSuccess)
				return Ok(result);

			return BadRequest(result);
		}

		[HttpDelete("Delete/{userId}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<IActionResult> DeleteUserAsync([Range(1, int.MaxValue)]int userId)
		{
			var result = await _adminService.DeleteUserAsync(userId);
			if (result.IsSuccess) return Ok(result);
			return NotFound(result);
		}

		[HttpPut("UpdateUser/{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<IActionResult> UpdateUser(int id, [FromForm] UpdateUserDto dto)
		{
			var result = await _adminService.UpdateUserAsync(id, dto);
			if (result.IsSuccess)
				return Ok(result);

			return BadRequest(result);
		}
	}
}
