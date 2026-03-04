using AutoMapper;

namespace Services.Profiles
{
	public class RequestProfile : Profile
	{
		public RequestProfile()
		{
			CreateMap<Core.DTOs.RequestDtos.RequestDto, Core.Entities.MaintenanceRequest>().ReverseMap();
			CreateMap<Core.Entities.MaintenanceRequest,Core.DTOs.RequestDtos.ResponseRequestDto >()
				.ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
		}
	}
}
