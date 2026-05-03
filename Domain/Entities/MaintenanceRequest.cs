using Domain.Enums;

namespace Domain.Entities
{
    public class MaintenanceRequest
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public RequestStatus Status { get; private set; } = RequestStatus.Pending;

        // Who upload the request.
        public int CreatedByUserId { get; set; }
        public ApplicationUser CreatedBy { get; set; } = null!;

        // Who is assigned to handle the request (nullable, as it may not be assigned yet).
        public int? AssignedToUserId { get; private set; }
        public ApplicationUser? AssignedTo { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        public int ServiceRequestId { get; set; }
        public ServiceRequest ServiceRequest { get; set; } = null!;

        private bool IsAlreadyAssigned => AssignedToUserId != null;
        public bool CanDelete => Status != RequestStatus.Completed;

        public (bool, string) AssignEmployee(int employeeId)
        {
            if (Status == RequestStatus.Completed)
                return (false, "Cannot update a request that is already marked as completed.");

            if (IsAlreadyAssigned)
                return (false, "This request is already assigned");

            AssignedToUserId = employeeId;
            Status = RequestStatus.InProgress;
            return (true, "Assigned to user");
        }

        public (bool Success, string Message) Update(string description, int categoryId, RequestStatus newStatus)
        {
            if (Status == RequestStatus.Completed)
                return (false, "Cannot update a request that is already marked as completed.");

            Description = description;
            CategoryId = categoryId;
            Status = newStatus;

            return (true, "Updated successfully");
        }

        public (bool Success, string Message) ChangeStatus(RequestStatus newStatus)
        {
            if (Status == RequestStatus.Completed)
                return (false, "Cannot update a request that is already marked as completed.");

            if (Status == newStatus)
                return (false, "This request is already assigned");

            Status = newStatus;
            return (true, "Updated successfully");
        }
    }
}