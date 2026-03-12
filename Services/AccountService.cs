using AutoMapper;
using Core.DTOs.AuthDtos;
using Core.Entities;
using Core.Enums;
using Core.Interfaces.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Repositories.Data;

namespace Services
{
	  public class AccountService : IAccountService
	  {
			private readonly AppDbContext _context;
			private readonly ITokenService _tokenService;
			private readonly UserManager<ApplicationUser> _userManager;
			private readonly IConfiguration _configuration;
			private readonly IMapper _mapper;

			public AccountService(
				 IMapper mapper,
				UserManager<ApplicationUser> userManager,
				ITokenService tokenService,
				AppDbContext context, IConfiguration configuration)
			{
				  _userManager = userManager;
				  _tokenService = tokenService;
				  _context = context;
				  _configuration = configuration;
				_mapper = mapper;
			}

			public async Task<Result<TokenResult>> LoginAsync(LoginDto dto)
			{
			  var user = await _userManager.FindByNameAsync(dto.UserName);
			  if (user is null)
				return Result<TokenResult>.Failure("Invalid username or password", AppError.Unauthorized);

			  var isValid = await _userManager.CheckPasswordAsync(user, dto.Password);
			  if (!isValid)
				return Result<TokenResult>.Failure("Invalid username or password", AppError.Unauthorized);

			  var accessToken = await _tokenService.GenerateAccessTokenAsync(user);
			   var refreshToken = await _tokenService.GenerateRefreshTokenAsync(user.Id);
			  var roles = await _userManager.GetRolesAsync(user);

				  return Result<TokenResult>.Success(new TokenResult
				  {
						AccessToken = accessToken,
						RefreshToken = refreshToken.RefreshToken,
						Role = roles.FirstOrDefault() ?? RoleName.Client.ToString(),
						UserName = user.UserName!
				  });	
			}

			public async Task<Result> CreateUserAsync(RegisterDto registerDto, RoleName roleName)
			{
				var strategy = _context.Database.CreateExecutionStrategy();
				return await strategy.ExecuteAsync(async () =>
				{
					await using var tx = await _context.Database.BeginTransactionAsync();
					try
					{
						var person = _mapper.Map<Person>(registerDto);
						await _context.People.AddAsync(person);
						await _context.SaveChangesAsync();

						var user = _mapper.Map<ApplicationUser>(registerDto);
						user.PersonId = person.Id;
						var result = await _userManager.CreateAsync(user, registerDto.Password);
						if (!result.Succeeded)
						{
							await tx.RollbackAsync();
							return Result.Failure(
									string.Join(", ", result.Errors.Select(e => e.Description)),
									AppError.BadRequest);
						}

						var role = await _userManager.AddToRoleAsync(user, roleName.ToString());
						if (!role.Succeeded)
						{
							await tx.RollbackAsync();
							return Result.Failure(string.Join(", ", role.Errors.Select(e => e.Description)), AppError.BadRequest);
						}

						await tx.CommitAsync();
						return Result.Success($"{roleName} Created Success");
					}
					catch (Exception)
					{
						try { await tx.RollbackAsync(); }
						catch { /* ignore rollback errors */ }
						throw;
					}
				});

			}

			public async Task<Result> RegisterAsync(RegisterDto registerDto)
			{
				return await CreateUserAsync(registerDto, RoleName.Client);
			}

			public async Task<Result> Logout(string refreshToken) =>
				 await _tokenService.RevokeTokenAsync(refreshToken);
			
	  }
}