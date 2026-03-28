using Core.DTOs.Page;
using Microsoft.EntityFrameworkCore;
namespace Core.Extensions
{
	/// <summary>
	/// Provides extension methods for querying and manipulating data using IQueryable sources.
	/// </summary>
	/// <remarks>These extension methods are intended to simplify common data access patterns, such as pagination,
	/// when working with query providers that support asynchronous execution. Methods in this class are typically used
	/// with LINQ providers like Entity Framework Core.</remarks>
	public static class QueryableExtensions
	{
		/// <summary>
		/// Asynchronously creates a paged result from the specified query by retrieving a single page of items and the total
		/// item count.
		/// </summary>
		/// <remarks>This method executes the query twice: once to count the total number of items and once to retrieve
		/// the items for the requested page. The method is intended for use with queries that support asynchronous execution,
		/// such as those provided by Entity Framework Core.</remarks>
		/// <typeparam name="T">The type of the elements in the query.</typeparam>
		/// <param name="query">The source query to paginate. Must not be null.</param>
		/// <param name="pageNumber">The one-based index of the page to retrieve. Must be greater than or equal to 1.</param>
		/// <param name="pageSize">The number of items to include in each page. Must be greater than 0.</param>
		/// <returns>A task that represents the asynchronous operation. The task result contains a ResultPage<T> with the items for the
		/// specified page, the total number of items, and pagination metadata.</returns>
		public static async Task<ResultPage<T>> ToPagedResultAsync<T>(this IQueryable<T> query, int pageNumber, int pageSize)
		{
			var totalItems = await query.CountAsync();
			var items = await query
				.Skip((pageNumber - 1) * pageSize)
				.Take(pageSize)
				.ToListAsync();

			return new ResultPage<T>
			{
				Items = items,
				TotalItems = totalItems,
				TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
				PageNumber = pageNumber,
				PageSize = pageSize
			};
		}
	}
}
