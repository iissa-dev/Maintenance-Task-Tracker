using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
	public class Category
	{
		public int Id { get; set; }

		[Required]
		[MaxLength(50)]
		public string Name { get; set; } = string.Empty;

		public ICollection<MaintenanceRequest> MaintenanceRequests { get; set; }
			= new List<MaintenanceRequest>();

		public ICollection<ServiceRequest> ServiceRequests { get; set; } = new List<ServiceRequest>();
	}
}
