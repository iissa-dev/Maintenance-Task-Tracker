using AutoMapper;
using Core.DTOs.RequestDtos;
using Core.Entities;

namespace Services.Profiles
{
	public class RequestProfile : Profile
	{
		public RequestProfile()
		{
			CreateMap<RequestDto, MaintenanceRequest>().ReverseMap();
			CreateMap<MaintenanceRequest, ResponseRequestDto>()
				.ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

			CreateMap<UpdateRequestDto, MaintenanceRequest>().ReverseMap();
		}
	}
}
