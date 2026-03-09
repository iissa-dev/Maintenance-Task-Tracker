using Core.DTOs.AuthDtos;
using Core.Enums;
using Core.Interfaces.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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

			if(result.IsSuccess) 
				return Ok(result);

			return BadRequest(result);
		}

		[HttpGet("Employees")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> GetAllEmployeeAsync(int pageNumber, int pageSize)
		{
			var result = await _adminService.GetAllUsersByRoleAsync(RoleName.Employee, pageNumber, pageSize);
			if (result.IsSuccess)
				return Ok(result);

			return BadRequest(result);
		}

		[HttpGet("Clients")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> GetAllClientsAsync(int pageNumber, int pageSize)
		{
			var result = await _adminService.GetAllUsersByRoleAsync(RoleName.Client, pageNumber, pageSize);
			if (result.IsSuccess)
				return Ok(result);

			return BadRequest(result);
		}

		[HttpPut("request/{requestId}/assgin/{employeeId}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> AssignEmployee(int requestId, int employeeId) 
		{
			var result = await _adminService.AssignEmployee(requestId, employeeId);
			if (result.IsSuccess)
				return Ok(result);

			return BadRequest(result);
		}

	}
}
