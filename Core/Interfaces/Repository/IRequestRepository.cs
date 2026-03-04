using Core.DTOs.Page;
using Core.DTOs.RequestDtos;
using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Interfaces.Repository
{
	public interface IRequestRepository
	{
		Task<IQueryable<MaintenanceRequest>> GetAllAsync(int pageNumber, int pageSize);
		Task<MaintenanceRequest?> GetByIdAsync(int id);

		Task UpdateStatusAsync(int id, int status);
	}
}
