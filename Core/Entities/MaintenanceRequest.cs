using Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace Core.Entities
{
	public class MaintenanceRequest
	{
		public int Id { get; set; }
		public string Description { get; set; } = string.Empty;
		[Required]
		public CategoryTypes CategoryType { get; set; }

		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

		public int CategoryId { get; set; }
		public Category Category { get; set; } = null!;
	}
}
