using Core.DTOs;

namespace Core.Interfaces.Service
{
	/// <include file='../../Docs/ICategoryService.xml' 
	/// path='doc/members/member[@name="T:Core.Interfaces.Service.ICategoryService"]/*'/>
	public interface ICategoryService
	{

		/// <include file='../../Docs/ICategoryService.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.ICategoryService.GetAllAsync"]/*'/>
		Task<Result<IEnumerable<CategoryDto>>> GetAllAsync();

		/// <include file='../../Docs/ICategoryService.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.ICategoryService.GetByIdAsync(System.Int32)"]/*'/>
		Task<Result<CategoryDto>> GetByIdAsync(int id);

		/// <include file='../../Docs/ICategoryService.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.ICategoryService.AddAsync(Core.DTOs.CategoryDto)"]/*'/>
		Task<Result> AddAsync(CategoryDto category);

		/// <include file='../../Docs/ICategoryService.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.ICategoryService.UpdateAsync(Core.DTOs.CategoryDto)"]/*'/>
		Task<Result> UpdateAsync(CategoryDto category);

		/// <include file='../../Docs/ICategoryService.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.ICategoryService.DeleteAsync(System.Int32)"]/*'/>
		Task<Result> DeleteAsync(int id);

		/// <include file='../../Docs/ICategoryService.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Service.ICategoryService.GetTopThreeCategory"]/*'/>
		Task<Result<IEnumerable<CategoryWithRequestCountDto>>> GetTopThreeCategory();
	}
}
