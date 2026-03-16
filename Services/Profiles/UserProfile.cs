using AutoMapper;
using Core.DTOs.AuthDtos;
using Core.DTOs.UserDtos;
using Core.Entities;

namespace Services.Profiles
{
	public class UserProfile : Profile
	{
		public UserProfile()
		{
			CreateMap<RegisterDto, ApplicationUser>()
				.ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
				.ForMember(dest => dest.PersonId, opt => opt.Ignore())
				.ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(s => s.PhoneNumber ?? string.Empty));

			CreateMap<UpdateUserDto, ApplicationUser>();
		}
	}
}
