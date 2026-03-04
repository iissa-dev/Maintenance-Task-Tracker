using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Interfaces.Repository
{
	public interface ICategoryRepository
	{
		IQueryable<Category> GetTopThreeCategory(); 
	}
}
	