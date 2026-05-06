using Application.DTOs.UserDto;
using Domain.Entities;
using Domain.Enums;

namespace Application.Mapper
{
	public static class UserMapper
	{
		public static IQueryable<UserResponseDto> ToUserDto(this IQueryable<ApplicationUser> query, RoleName roleName)
		{
			return query.Select(u => new UserResponseDto
			{
				Id = u.Id,
				UserName = u.UserName!,
				Email = u.Email!,
				FullName = u.Person.FirstName + " " + u.Person.LastName,
				PhoneNumber = u.Person.PhoneNumber ?? "",
				Role = roleName.ToString()
			});
		}
	}

}
