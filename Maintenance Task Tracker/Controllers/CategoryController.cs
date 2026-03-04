using Core.DTOs;
using Core.Interfaces.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Maintenance_Task_Tracker.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CategoryController : ControllerBase
	{
		private readonly ICategoryService _service;
		public CategoryController(ICategoryService service)
		{
			_service = service;
		}

		[HttpPost("AddCategory")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> AddCategory(CategoryDto category)
		{
			var result = await _service.AddAsync(category);
			if (result.IsSuccess)
				return Ok(result);

			return BadRequest(result);
		}

		[HttpGet("GetAllCategories")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		public async Task<IActionResult> GetAllCategories()
		{
			var result = await _service.GetAllAsync();
			return Ok(result);
		}

		[HttpGet("GetCategoryById/{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<IActionResult> GetCategoryById(int id)
		{
			var result = await _service.GetByIdAsync(id);
			if (result.IsSuccess)
				return Ok(result);

			return NotFound(result);
		}

		[HttpPut("UpdateCategory")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<IActionResult> UpdateCategory(CategoryDto category)
		{
			var result = await _service.UpdateAsync(category);
			if (result.IsSuccess)
				return Ok(result);

			return BadRequest(result);
		}

		[HttpDelete("DeleteCategory/{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<IActionResult> DeleteCategory(int id)
		{
			var result = await _service.DeleteAsync(id);
			if (result.IsSuccess)
				return Ok(result);
			return NotFound(result);
		}

		[HttpGet("GetTopThreeCategories")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		public async Task<IActionResult> GetTopThreeCategories()
		{
			var result = await _service.GetTopThreeCategory();
			return Ok(result);
		}
	}
}
