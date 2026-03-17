namespace Core.DTOs.Page
{
	/// <summary>
	/// Represents a paginated result set for list queries.
	/// </summary>
	/// <typeparam name="T">The item type contained in the paged result.</typeparam>
	public class ResultPage<T>
	{
		/// <summary>
		/// The items returned for the current page.
		/// </summary>
		public IEnumerable<T> Items { get; init; } = Array.Empty<T>();

		public int TotalItems { get; set; } = 0;

		public int TotalPages { get; set; }

		public int PageNumber { get; set; }

		public int PageSize { get; set; }


	}
}
