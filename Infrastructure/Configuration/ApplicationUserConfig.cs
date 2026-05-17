using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configuration;

internal class ApplicationUserConfig : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder.HasOne(u => u.Person)
            .WithOne()
            .HasForeignKey<ApplicationUser>(u => u.PersonId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(u => !u.IsDeleted);

        builder.Property(u => u.UserName)
            .IsRequired()
            .HasMaxLength(50);

        builder.ToTable("Users");
    }
}