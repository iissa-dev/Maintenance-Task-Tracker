using Domain.Interfaces;

namespace Domain.Entities
{
    public class ServiceRequest : ISoftDeleteable
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal? Price { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        public ICollection<MaintenanceRequest> MaintenanceRequests { get; set; } = new List<MaintenanceRequest>();
        public bool IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; }

        public void UpdateDetails(string name, string description, decimal? price,
            int categoryId)
        {
            Name = name;
            Description = description;
            Price = price;
            CategoryId = categoryId;
        }

        public void Delete()
        {
            IsDeleted = true;
            DeletedAt = DateTime.UtcNow;
        }

        public void UndoDelete()
        {
            IsDeleted = false; 
            DeletedAt = null;
        }
    }
}