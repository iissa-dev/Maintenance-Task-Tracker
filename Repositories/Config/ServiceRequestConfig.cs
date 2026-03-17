using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repositories.Config
{
	internal class ServiceRequestConfig : IEntityTypeConfiguration<ServiceRequest>
	{
		public void Configure(EntityTypeBuilder<ServiceRequest> builder)
		{
			builder.HasKey(s => s.Id);

			builder.Property(s => s.Name)
				 .IsRequired()
				 .HasMaxLength(100);

			builder.Property(s => s.Description)
				.HasMaxLength(300);

			builder.Property(s => s.Price)
				.HasColumnType("decimal(18,2)");

			builder.HasOne(s => s.Category)
			.WithMany(c => c.ServiceRequests)
			.HasForeignKey(s => s.CategoryId)
			.OnDelete(DeleteBehavior.Restrict);
		}
	}
}
