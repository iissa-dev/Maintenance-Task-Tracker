using AutoMapper;

namespace Services.Profiles
{
	public class CategoryProfile : Profile
	{
		public CategoryProfile()
		{
			CreateMap<Core.Entities.Category, Core.DTOs.CategoryDto>().ReverseMap();
		}
	}
}
