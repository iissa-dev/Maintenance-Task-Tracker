using Core.DTOs.UserDtos;
using Core.Entities;
using Core.Enums;

namespace Services.Mappers
{
	public static class UserMapper
	{
		public static UserReponseDto ToDto(this ApplicationUser entity, RoleName roleName)
		=> new UserReponseDto
		{
			Id = entity.Id,
			UserName = entity.UserName!,
			Email = entity.Email!,
			FullName = entity?.Person.FirstName + " " + entity?.Person.LastName,
			PhoneNumber = entity?.Person?.PhoneNumber ?? "",
			Role = roleName.ToString()

		};
	}
}
