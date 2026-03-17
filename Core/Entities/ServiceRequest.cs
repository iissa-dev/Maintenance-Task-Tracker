namespace Core.Entities
{
	public class ServiceRequest
	{
		public int Id { get; set; }

		public string Name { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;
		public decimal? Price { get; set; }
		public int CategoryId { get; set; }
		public Category Category { get; set; } = null!;

		public ICollection<MaintenanceRequest> MaintenanceRequests { get; set; } = new List<MaintenanceRequest>();
	}
}
