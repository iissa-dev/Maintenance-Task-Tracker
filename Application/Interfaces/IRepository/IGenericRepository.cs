using System.Linq.Expressions;

namespace Application.Interfaces.IRepository
{
	/// <include
	///     path='doc/members/member[@name="T:Core.Interfaces.Repository.IRepository`1"]/*'>
	///     <file>../../Docs/IRepository.xml</file>
	/// </include>
	public interface IGenericRepository<T> where T : class
	{
		/// <include file='../../Docs/IRepository.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Repository.IRepository`1.GetByIdAsync(System.Int32)"]/*'/>
		Task<T?> GetByIdAsync(int id);

		/// <include file='../../Docs/IRepository.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Repository.IRepository`1.AddAsync(`0)"]/*'/>
		void Add(T entity);

		/// <include file='../../Docs/IRepository.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Repository.IRepository`1.Update(`0)"]/*'/>
		void Update(T entity);

		/// <include file='../../Docs/IRepository.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Repository.IRepository`1.Delete(System.Int32)"]/*'/>
		void Delete(T entity);

		/// <include file='../../Docs/IRepository.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Repository.IRepository`1.SaveChangesAsync"]/*'/>
		Task SaveChangesAsync();

		/// <include file='../../Docs/IRepository.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Repository.IRepository`1.ExistsAsync(System.Linq.Expressions.Expression{System.Func{`0,System.Boolean}})"]/*'/>
		Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);

		/// <summary>
		/// Executes the specified asynchronous action using a predefined execution strategy, such as retry logic for
		/// transient failures.
		/// </summary>
		Task<TResult> ExecuteWithStrategyAsync<TResult>(Func<Task<TResult>> action);

	}
}
