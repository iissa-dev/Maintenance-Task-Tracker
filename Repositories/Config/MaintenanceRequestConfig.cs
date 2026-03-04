using Core.Entities;
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

			builder.Property(m => m.CustomerName)
				.HasMaxLength(100);

			builder.Property(m => m.CreatedAt)
				.HasColumnType("datetime2")
				.IsRequired();	
		}
	}
}
