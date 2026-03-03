using AutoMapper;
using Core.DTOs;
using Core.Entities;
using Core.Enums;

namespace Services.Profiles
{
	public class CategoryProfile : Profile
	{
		public CategoryProfile()
		{
			// Entity → DTO
			CreateMap<Core.Entities.Category, Core.DTOs.CategoryDto>()
				.ReverseMap();
		}
	}
}
