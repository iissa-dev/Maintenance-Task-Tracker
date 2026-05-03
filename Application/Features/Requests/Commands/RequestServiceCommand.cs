using Application.DTOs.RequestDto;
using Application.Interfaces.Common;
using Application.Interfaces.IRepository;
using Application.Interfaces.IServices;
using Application.Results;
using Domain.Entities;
using Domain.Enums;

namespace Application.Features.Requests.Commands
{
    public class RequestServiceCommand : IRequestServiceCommand
    {
        private readonly IRequestRepository _requestRepository;
        private readonly IAppDbContext _context;

        public RequestServiceCommand(IRequestRepository requestRepository, IAppDbContext context)
        {
            _requestRepository = requestRepository;
            _context = context;
        }

        public async Task<Result> AddAsync(RequestDto? request, int userId)
        {
            if (request == null)
                return Result.Failure("Invalid request data.", AppError.BadRequest);
            var entity = new MaintenanceRequest
            {
                Description = request.Description,
                CategoryId = request.CategoryId,
                CreatedByUserId = userId, // from token
                CreatedAt = DateTime.UtcNow,
                ServiceRequestId = request.ServiceRequestId
            };

            _requestRepository.Add(entity);
            await _context.SaveChangesAsync();
            return Result.Success("Request added successfully.");
        }

        public async Task<Result> DeleteAsync(int id)
        {
            if (id < 1)
                return Result.Failure("Invalid request ID.", AppError.BadRequest);

            var existing = await _requestRepository.GetByIdAsync(id);

            if (existing is null)
                return Result.Failure("Request not found.", AppError.NotFound);

            if (!existing.CanDelete)
                return Result.Failure("Cannot delete request of a completed status.", AppError.BadRequest);

            _requestRepository.Delete(existing);

            await _context.SaveChangesAsync();
            return Result.Success("Request deleted successfully.");
        }

        public async Task<Result> UpdateAsync(int id, UpdateRequestDto request)
        {
            var existing = await _requestRepository.GetByIdAsync(id);

            if (existing == null)
                return Result.Failure("Request not found.", AppError.NotFound);

            var (success, message) =
                existing.Update(request.Description, request.CategoryId, (RequestStatus)request.Status);

            if (!success)
                return Result.Failure(message, AppError.BadRequest);

            _requestRepository.Update(existing);
            await _context.SaveChangesAsync();

            return Result.Success("Request updated successfully.");
        }

        public async Task<Result> UpdateStatusAsync(int id, int status)
        {
            if (!Enum.IsDefined(typeof(RequestStatus), status))
                return Result.Failure("Invalid status value", AppError.BadRequest);

            var existing = await _requestRepository.GetByIdAsync(id);

            if (existing == null)
                return Result.Failure("Request not found.", AppError.NotFound);

            var (success, message) = existing.ChangeStatus((RequestStatus)status);
            if (!success)
                return Result.Failure(message, AppError.BadRequest);

            _requestRepository.Update(existing);
            await _context.SaveChangesAsync();
            return Result.Success("Request status updated successfully.");
        }
    }
}