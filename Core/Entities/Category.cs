using Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace Core.Entities
{
	public class Category
	{
		public int Id { get; set; }

		[Required]
		[MaxLength(50)]
		public string Name { get; set; } = string.Empty;

		public ICollection<MaintenanceRequest> MaintenanceRequests { get; set; } 
			= new List<MaintenanceRequest>();
	}
}
