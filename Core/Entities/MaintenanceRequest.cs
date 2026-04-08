using Core.Enums;

namespace Core.Entities
{
	public class MaintenanceRequest
	{
		public int Id { get; set; }
		public string Description { get; set; } = string.Empty;
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public RequestStatus Status { get; set; } = RequestStatus.Pending;

		// Who upload the request.
		public int CreatedByUserId { get; set; }
		public ApplicationUser CreatedBy { get; set; } = null!;

		// Who is assigned to handle the request (nullable, as it may not be assigned yet).
		public int? AssignedToUserId { get; set; }
		public ApplicationUser? AssignedTo { get; set; }

		public int CategoryId { get; set; }
		public Category Category { get; set; } = null!;

		public int ServiceRequestId { get; set; }
		public ServiceRequest ServiceRequest { get; set; } = null!;

		
	}
}
