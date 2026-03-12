using AutoMapper;
using Core.DTOs.AuthDtos;
using Core.Entities;

namespace Services.Profiles
{
	public class PersonProfile : Profile
	{
		public PersonProfile()
		{
			CreateMap<RegisterDto, Person>()
				.ForMember(dest => dest.BirthDate, opt => opt.MapFrom(src =>
					src.DateOfBirth.HasValue
						? src.DateOfBirth.Value.ToDateTime(TimeOnly.MinValue)
						: (DateTime?)null))
				.ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(s => s.PhoneNumber ?? string.Empty));
		}
	}
}
