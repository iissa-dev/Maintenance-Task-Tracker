using Domain.Entities;
using Domain.Enums;

namespace Application.Extensions;

public static class MaintenanceRequestExtensions
{
    public static IQueryable<MaintenanceRequest> FilterByRole
        (this IQueryable<MaintenanceRequest> query, int userId, string role)
    {
        return role switch
        {
            nameof(RoleName.Client) => query.Where(r => r.CreatedByUserId == userId),
            nameof(RoleName.Employee) => query.Where(r => r.AssignedToUserId == userId),
            _ => query // Admin see everything
        };
    }
}