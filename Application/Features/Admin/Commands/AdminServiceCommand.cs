using Application.DTOs.AuthDtos;
using Application.DTOs.UserDto;
using Application.Interfaces.Common;
using Application.Interfaces.IRepository;
using Application.Interfaces.IServices;
using Application.Results;
using Domain.Enums;

namespace Application.Features.Admin.Commands
{
    /// <summary>
    /// Handles state-changing operations for Admin tasks.
    /// Orchestrates between Identity and Business repositories within transactions.
    /// </summary>
    public class AdminServiceCommand : IAdminServiceCommand
    {
        private readonly IRequestRepository _requestRepository;
        private readonly IPersonRepository _personRepository;
        private readonly IAppDbContext _context;
        private readonly IIdentityService _identityService;

        public AdminServiceCommand(
            IRequestRepository requestRepository,
            IPersonRepository personRepository,
            IAppDbContext context,
            IIdentityService identityService)
        {
            _requestRepository = requestRepository;
            _personRepository = personRepository;
            _context = context;
            _identityService = identityService;
        }

        public async Task<Result> AssignEmployee(int requestId, int employeeId)
        {
            var request = await _requestRepository.GetByIdAsync(requestId);
            if (request is null)
                return Result.Failure("Request not found.", AppError.NotFound);

            var isEmployee = await _identityService.IsInRoleAsync(employeeId, RoleName.Employee);
            if (!isEmployee)
                return Result.Failure("User is not in the Employee role", AppError.NotFound);

            var (ok, mes) = request.AssignEmployee(employeeId);
            if (!ok)
                return Result.Failure($"{mes}", AppError.Conflict);

            _requestRepository.Update(request);
            await _context.SaveChangesAsync();

            return Result.Success("Employee assigned successfully");
        }

        public async Task<Result> CreateEmployeeAsync(RegisterDto registerDto)
        {
            var userAdd = await _identityService.RegisterAsync(registerDto, RoleName.Employee);

            return !userAdd.IsSuccess
                ? Result.Failure(userAdd?.Message ?? "Failed to Create employee", AppError.BadRequest)
                : Result.Success("Employee registered successfully");
        }


        public async Task<Result> DeleteUserAsync(int userId)
            => await _identityService.DeleteUserAsync(userId);

        /// <summary>
        /// Updates core identity fields. 
        /// Identity Framework will automatically handle normalization and database persistence.
        /// </summary>
        public async Task<Result> UpdateUserAsync(int id, UpdateUserDto dto)
        {
            // We use a transaction to ensure both Person and Identity details are updated atomically.
            await using var transaction = await _context.BeginTransactionAsync();

            try
            {
                var person = await _personRepository.GetByUserIdAsync(id);
                if (person is null)
                    return Result.Failure("Associated person record not found", AppError.NotFound);

                person.FirstName = dto.FirstName;
                person.LastName = dto.LastName;

                _personRepository.Update(person);
                await _context.SaveChangesAsync();

                var identityUpdate = await _identityService.UpdateAccountAsync(id, dto.Email, dto.UserName);

                if (!identityUpdate.IsSuccess)
                {
                    await transaction.RollbackAsync();
                    return identityUpdate;
                }

                await transaction.CommitAsync();
                return Result.Success("User updated successfully.");
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}