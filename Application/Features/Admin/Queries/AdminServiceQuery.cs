using Application.DTOs.Page;
using Application.DTOs.UserDto;
using Application.Extensions;
using Application.Interfaces.Common;
using Application.Interfaces.IServices;
using Application.Mapper;
using Application.Results;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Admin.Queries
{
    /// <summary>
    /// Provides read-only operations for Administrative dashboard.
    /// Uses No-Tracking queries for optimized performance.
    /// </summary>
    public class AdminServiceQuery : IAdminServiceQuery
    {
        private readonly IAppDbContext _context;

        public AdminServiceQuery(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<Result<ResultPage<UserResponseDto>>> GetAllUsersByRoleAsync(
            RoleName roleName,
            int pageNumber = 1,
            int pageSize = 10,
            string? searchByUserName = null)
        {
            var roleNameStr = roleName.ToString();
            var query = _context.Users
                .AsNoTracking()
                .Where(u => _context.UserRoles
                    .Any(ur => ur.UserId == u.Id &&
                               _context.Roles.Any(r => r.Id == ur.RoleId && r.Name == roleNameStr)));

            if (!string.IsNullOrWhiteSpace(searchByUserName))
                query = query.Where(u => u.UserName!.Contains(searchByUserName));

            var data = await query
                .OrderBy(u => u.Id)
                .ToUserDto(roleName)
                .ToPagedResultAsync(pageNumber, pageSize);

            return Result<ResultPage<UserResponseDto>>.Success(data);
        }

        public async Task<Result<UserResponseDto>> GetUserByIdAsync(int userId, RoleName roleName)
        {
            var user = await _context.Users
                .AsNoTracking()
                .ToUserDto(roleName)
                .FirstOrDefaultAsync(u => u.Id == userId);


            return user is null
                ? Result<UserResponseDto>.Failure("User Not Found", AppError.NotFound)
                : Result<UserResponseDto>.Success(user);
        }
    }
}