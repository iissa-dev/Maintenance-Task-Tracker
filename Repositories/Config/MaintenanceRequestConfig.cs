using Core.Entities;
using Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repositories.Config
{
	public class MaintenanceRequestConfig : IEntityTypeConfiguration<MaintenanceRequest>
	{
		public void Configure(EntityTypeBuilder<MaintenanceRequest> builder)
		{
			builder.HasKey(m => m.Id);

			builder.HasOne(m => m.Category)
					.WithMany(c => c.MaintenanceRequests)
					.HasForeignKey(m => m.CategoryId);

			builder.Property(m => m.Description)
					.HasMaxLength(200);

			builder.Property(m => m.CreatedAt)
				.HasColumnType("datetime2")
				.IsRequired();

			builder
				.HasOne(m => m.CreatedBy)
				.WithMany()
				.HasForeignKey(m => m.CreatedByUserId)
				.OnDelete(DeleteBehavior.Restrict);

			builder
				.HasOne(m => m.AssignedTo)
				.WithMany()
				.HasForeignKey(m => m.AssignedToUserId)
				.OnDelete(DeleteBehavior.Restrict);

			builder.
			HasOne(m => m.ServiceRequest)
			.WithMany(m => m.MaintenanceRequests)
			.HasForeignKey(m => m.ServiceRequestId)
			.OnDelete(DeleteBehavior.Restrict);
		
		}
	}
}
