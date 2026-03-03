using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Repositories.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCategoryToDynamicString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CategoryType",
                table: "MaintenanceRequest");

            migrationBuilder.DropColumn(
                name: "CategoryType",
                table: "Category");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Category",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Category");

            migrationBuilder.AddColumn<int>(
                name: "CategoryType",
                table: "MaintenanceRequest",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CategoryType",
                table: "Category",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
