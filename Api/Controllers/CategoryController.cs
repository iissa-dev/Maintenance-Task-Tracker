using Application.DTOs.CategoryDto;
using Application.Interfaces.IServices;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CategoryController : ControllerBase
	{
		private readonly ICategoryServiceQuery _query;
		private readonly ICategoryServiceCommand _command;


		public CategoryController(ICategoryServiceQuery query, ICategoryServiceCommand command)
		{
			_query = query;
			_command = command;
		}

		[HttpPost("AddCategory")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> AddCategory(CategoryResponseDto category)
		{
			var result = await _command.AddAsync(category);
			if (result.IsSuccess)
				return Ok(result);

			return BadRequest(result);
		}

		[HttpGet("GetAllCategories")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		public async Task<IActionResult> GetAllCategories()
		{
			var result = await _query.GetAllAsync();
			return Ok(result);
		}

		[HttpGet("GetCategoryById/{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<IActionResult> GetCategoryById(int id)
		{
			var result = await _query.GetByIdAsync(id);
			if (result.IsSuccess)
				return Ok(result);

			return NotFound(result);
		}

		[HttpPut("UpdateCategory")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<IActionResult> UpdateCategory(CategoryResponseDto category)
		{
			var result = await _command.UpdateAsync(category);
			if (result.IsSuccess)
				return Ok(result);

			return BadRequest(result);
		}

		[HttpDelete("DeleteCategory/{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<IActionResult> DeleteCategory(int id)
		{
			var result = await _command.DeleteAsync(id);
			if (result.IsSuccess)
				return Ok(result);
			return NotFound(result);
		}

		[HttpGet("GetTopThreeCategories")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		public async Task<IActionResult> GetTopThreeCategories()
		{
			var result = await _query.GetTopThreeCategory();
			return Ok(result);
		}
	}

}
