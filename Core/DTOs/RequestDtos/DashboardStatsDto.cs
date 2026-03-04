namespace Core.DTOs.RequestDtos
{
	public class DashboardStatsDto
	{
		public int TotalRequests { get; set; }
		public int PendingCount { get; set; }
		public int InProgressCount { get; set; }
		public int CompletedCount { get; set; }
	}
}
