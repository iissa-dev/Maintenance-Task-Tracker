using Core.DTOs.ServiceRequestDto;
using Core.Interfaces.Service;
using Microsoft.AspNetCore.Mvc;

namespace Maintenance_Task_Tracker.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ServiceRequestController : ControllerBase
	{
		private readonly IServiceRequest _service;

		public ServiceRequestController(IServiceRequest service)
		{
			_service = service;
		}

		[HttpPost("CreateNewService")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> AddNewServiceAsync([FromBody] AddServiceRequestDto dto)
		{
			var res = await _service.AddServiceRequestAsync(dto);
			if (!res.IsSuccess)
			{
				return BadRequest(res);
			}

			return Ok(res);
		}

		[HttpGet("Services")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> GetAllServiceAsync(
		int pageNumber = 1,
		int pageSize = 10,
		int? categoryId = null,
		string? searchByName = null)
		{
			var res = await _service.GetAllServiceAsync(pageNumber, pageSize, categoryId, searchByName);
			if (!res.IsSuccess)
			{
				return BadRequest(res);
			}

			return Ok(res);
		}

		[HttpPut("UpdateService/{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> UpdateServiceAsync(int id, [FromBody] UpdateServiceRequestDto dto)
		{
			var res = await _service.UpdateAsync(id, dto);
			if (!res.IsSuccess)
			{
				return BadRequest(res);
			}

			return Ok(res);
		}

		[HttpDelete("DeleteService/{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> DeleteServiceAsync(int id)
		{
			var res = await _service.DeleteAsync(id);
			if (!res.IsSuccess)
			{
				return BadRequest(res);
			}

			return Ok(res);
		}


	}
}
