using Application.DTOs.ServiceRequestDto;
using Application.Interfaces.IServices;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceRequestController : ControllerBase
    {
        private readonly IServiceRequestCommand _command;
        private readonly IServiceRequestQuery _query;

        public ServiceRequestController(IServiceRequestCommand command, IServiceRequestQuery query)
        {
            _command = command;
            _query = query;
        }

        [HttpPost("CreateNewService")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddNewServiceAsync([FromBody] AddServiceRequestDto dto)
        {
            var res = await _command.AddServiceRequestAsync(dto);
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
            var res = await _query.GetAllServiceAsync(pageNumber, pageSize, categoryId, searchByName);
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
            var res = await _command.UpdateAsync(id, dto);
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
            var res = await _command.DeleteAsync(id);
            if (!res.IsSuccess)
            {
                return BadRequest(res);
            }

            return Ok(res);
        }
    }
}