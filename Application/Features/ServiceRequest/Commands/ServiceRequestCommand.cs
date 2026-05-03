using Application.DTOs.ServiceRequestDto;
using Application.Interfaces.Common;
using Application.Interfaces.IRepository;
using Application.Interfaces.IServices;
using Application.Mapper;
using Application.Results;
using Domain.Enums;

namespace Application.Features.ServiceRequest.Commands;

public class ServiceRequestCommand : IServiceRequestCommand
{
    private readonly IServiceRequestRepository _repository;
    private readonly IAppDbContext _context;

    public ServiceRequestCommand(IServiceRequestRepository repository, IAppDbContext context)
    {
        _repository = repository;
        _context = context;
    }

    public async Task<Result> AddServiceRequestAsync(AddServiceRequestDto? dto)
    {
        if (dto is null) return Result.Failure("Invalid Data", AppError.BadRequest);

        _repository.Add(dto.ToEntity());

        await _context.SaveChangesAsync();

        return Result.Success("New Service Created");
    }

    public async Task<Result> DeleteAsync(int id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing is null)
            return Result.Failure("Service Not Found", AppError.NotFound);

        _repository.Delete(existing);

        await _context.SaveChangesAsync();
        return Result.Success("Service Deleted");
    }

    public async Task<Result> UpdateAsync(int id, UpdateServiceRequestDto? dto)
    {
        if (dto is null) return Result.Failure("Invalid Data", AppError.BadRequest);

        var existing = await _repository.GetByIdAsync(id);
        if (existing is null) return Result.Failure("Service Not Found.", AppError.NotFound);

        existing.UpdateDetails(dto.Name, dto.Description, dto.Price, dto.CategoryId);

        _repository.Update(existing);
        await _context.SaveChangesAsync();
        return Result.Success("Service Updated");
    }
}