using Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace Core.Entities
{
	public class MaintenanceRequest
	{
		public int Id { get; set; }
		public string Description { get; set; } = string.Empty;
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public int CategoryId { get; set; }
		public Category Category { get; set; } = null!;
	}
}
