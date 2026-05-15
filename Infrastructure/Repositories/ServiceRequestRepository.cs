using Application.Interfaces.IRepository;
using Domain.Entities;
using Infrastructure.Data;

namespace Infrastructure.Repositories
{
    public class ServiceRequestRepository(AppDbContext context)
        : GenericRepository<ServiceRequest>(context), IServiceRequestRepository
    {
    }
}