using Core.DTOs.AuthDtos;
using Core.Entities;
using Core.Enums;
using Core.Interfaces.Service;
using Microsoft.AspNetCore.Identity;
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
    public AccountService(
    UserManager<ApplicationUser> userManager,
    ITokenService tokenService,
    AppDbContext context, IConfiguration configuration)
    {
      _userManager = userManager;
      _tokenService = tokenService;
      _context = context;
      _configuration = configuration;
    }

    public async Task<Result<AuthResponseDto>> LoginAsync(LoginDto dto)
    {
      var user = await _userManager.FindByNameAsync(dto.UserName);
      if (user is null)
        return Result<AuthResponseDto>.Failure("Invalid username or password", AppError.Unauthorized);

      var isValid = await _userManager.CheckPasswordAsync(user, dto.Password);
      if (!isValid)
        return Result<AuthResponseDto>.Failure("Invalid username or password", AppError.Unauthorized);

      var accessToken = await _tokenService.GenerateAccessTokenAsync(user);
      var refreshToken = await _tokenService.GenerateRefreshTokenAsync(user.Id);
      var roles = await _userManager.GetRolesAsync(user);

      return Result<AuthResponseDto>.Success(new AuthResponseDto
      {
        AccessToken = accessToken,
        RefreshToken = refreshToken.RefreshToken,
        Role = roles.FirstOrDefault() ?? RoleName.Client.ToString(),
        ExpiresAt = DateTime.UtcNow.AddMinutes(
              double.Parse(_configuration["Jwt:ExpiryMinutes"]!)),
        UserName = user.UserName!
      });
    }

	public async Task<Result<AuthResponseDto>> RegisterAsync(RegisterDto dto)
	{
		var person = new Person
		{
			FirstName = dto.FirstName,
			LastName = dto.LastName,
			PhoneNumber = dto.PhoneNumber ?? "",
			BirthDate = dto.DateOfBirth.HasValue
				? dto.DateOfBirth.Value.ToDateTime(TimeOnly.MinValue)
				: null	
		};

		await _context.People.AddAsync(person);
		await _context.SaveChangesAsync();

		var user = new ApplicationUser
		{
			UserName = dto.UserName,
			Email = dto.Email,
			PersonId = person.Id
		};

		var result = await _userManager.CreateAsync(user, dto.Password);
		if (!result.Succeeded)
		{
			_context.People.Remove(person);
			await _context.SaveChangesAsync();

			return Result<AuthResponseDto>.Failure(
				string.Join(", ", result.Errors.Select(e => e.Description)),
				AppError.BadRequest);
		}

		var savedUser = await _userManager.FindByNameAsync(user.UserName!);

		await _userManager.AddToRoleAsync(user, RoleName.Client.ToString());


		var accessToken = await _tokenService.GenerateAccessTokenAsync(savedUser!);
		var refreshToken = await _tokenService.GenerateRefreshTokenAsync(savedUser!.Id);
		var roles = await _userManager.GetRolesAsync(user);

		return Result<AuthResponseDto>.Success(new AuthResponseDto
		{
			AccessToken = accessToken,
			RefreshToken = refreshToken.RefreshToken,
			ExpiresAt = DateTime.UtcNow.AddMinutes(
				double.Parse(_configuration["Jwt:ExpiryMinutes"]!)),
			UserName = user.UserName!,
			Role = roles.FirstOrDefault() ?? RoleName.Client.ToString()
		});
			
	}
  }
}