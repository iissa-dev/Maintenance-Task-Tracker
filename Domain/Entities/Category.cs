using Domain.Interfaces;

namespace Domain.Entities
{
    public class Category : ISoftDeleteable
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public ICollection<MaintenanceRequest> MaintenanceRequests { get; set; }
            = new List<MaintenanceRequest>();

        public ICollection<ServiceRequest> ServiceRequests { get; set; } = new List<ServiceRequest>();
        public bool IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}