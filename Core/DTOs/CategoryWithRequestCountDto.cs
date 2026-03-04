namespace Core.DTOs
{
	public class CategoryWithRequestCountDto
	{
		public int Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public int RequestCount { get; set; }
	}
}
