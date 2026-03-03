using Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace Core.Entities
{
	public class Category
	{
		public int Id { get; set; }

		[Required]
		public CategoryTypes CategoryType { get; set; }

		public ICollection<MaintenanceRequest> MaintenanceRequests { get; set; } 
			= new List<MaintenanceRequest>();
	}
}
