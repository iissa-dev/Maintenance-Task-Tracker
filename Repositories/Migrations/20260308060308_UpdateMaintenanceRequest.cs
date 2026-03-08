using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Repositories.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMaintenanceRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CustomerName",
                table: "MaintenanceRequest");

            migrationBuilder.AddColumn<int>(
                name: "AssignedToUserId",
                table: "MaintenanceRequest",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "MaintenanceRequest",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceRequest_AssignedToUserId",
                table: "MaintenanceRequest",
                column: "AssignedToUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceRequest_CreatedByUserId",
                table: "MaintenanceRequest",
                column: "CreatedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_MaintenanceRequest_AspNetUsers_AssignedToUserId",
                table: "MaintenanceRequest",
                column: "AssignedToUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MaintenanceRequest_AspNetUsers_CreatedByUserId",
                table: "MaintenanceRequest",
                column: "CreatedByUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MaintenanceRequest_AspNetUsers_AssignedToUserId",
                table: "MaintenanceRequest");

            migrationBuilder.DropForeignKey(
                name: "FK_MaintenanceRequest_AspNetUsers_CreatedByUserId",
                table: "MaintenanceRequest");

            migrationBuilder.DropIndex(
                name: "IX_MaintenanceRequest_AssignedToUserId",
                table: "MaintenanceRequest");

            migrationBuilder.DropIndex(
                name: "IX_MaintenanceRequest_CreatedByUserId",
                table: "MaintenanceRequest");

            migrationBuilder.DropColumn(
                name: "AssignedToUserId",
                table: "MaintenanceRequest");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "MaintenanceRequest");

            migrationBuilder.AddColumn<string>(
                name: "CustomerName",
                table: "MaintenanceRequest",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }
    }
}
