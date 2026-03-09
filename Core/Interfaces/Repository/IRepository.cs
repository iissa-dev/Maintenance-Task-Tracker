using System.Linq.Expressions;

namespace Core.Interfaces.Repository
{
	/// <include file='../../Docs/IRepository.xml'
	///          path='doc/members/member[@name="T:Core.Interfaces.Repository.IRepository`1"]/*'/>
	public interface IRepository<T> where T : class
	{
		/// <include file='../../Docs/IRepository.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Repository.IRepository`1.GetByIdAsync(System.Int32)"]/*'/>
		Task<T?> GetByIdAsync(int id);

		/// <include file='../../Docs/IRepository.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Repository.IRepository`1.GetAllAsync"]/*'/>
		Task<IEnumerable<T>> GetAllAsync();

		/// <include file='../../Docs/IRepository.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Repository.IRepository`1.AddAsync(`0)"]/*'/>
		Task AddAsync(T entity);

		/// <include file='../../Docs/IRepository.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Repository.IRepository`1.Update(`0)"]/*'/>
		void Update(T entity);

		/// <include file='../../Docs/IRepository.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Repository.IRepository`1.Delete(System.Int32)"]/*'/>
		Task Delete(int id);

		/// <include file='../../Docs/IRepository.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Repository.IRepository`1.SaveChangesAsync"]/*'/>
		Task SaveChangesAsync();

		/// <include file='../../Docs/IRepository.xml'
		///          path='doc/members/member[@name="M:Core.Interfaces.Repository.IRepository`1.ExistsAsync(System.Linq.Expressions.Expression{System.Func{`0,System.Boolean}})"]/*'/>
		Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);
	}
}
