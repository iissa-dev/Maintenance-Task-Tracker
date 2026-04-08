using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Repositories.Migrations
{
    /// <inheritdoc />
    public partial class RemoveServiceRequestFromMaintenanceRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MaintenanceRequest_ServiceRequests_ServiceRequestId",
                table: "MaintenanceRequest");

            migrationBuilder.DropIndex(
                name: "IX_MaintenanceRequest_ServiceRequestId",
                table: "MaintenanceRequest");

            migrationBuilder.DropColumn(
                name: "ServiceRequestId",
                table: "MaintenanceRequest");

            migrationBuilder.AddColumn<int>(
                name: "MaintenanceRequestId",
                table: "ServiceRequests",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceRequests_MaintenanceRequestId",
                table: "ServiceRequests",
                column: "MaintenanceRequestId");

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceRequests_MaintenanceRequest_MaintenanceRequestId",
                table: "ServiceRequests",
                column: "MaintenanceRequestId",
                principalTable: "MaintenanceRequest",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceRequests_MaintenanceRequest_MaintenanceRequestId",
                table: "ServiceRequests");

            migrationBuilder.DropIndex(
                name: "IX_ServiceRequests_MaintenanceRequestId",
                table: "ServiceRequests");

            migrationBuilder.DropColumn(
                name: "MaintenanceRequestId",
                table: "ServiceRequests");

            migrationBuilder.AddColumn<int>(
                name: "ServiceRequestId",
                table: "MaintenanceRequest",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceRequest_ServiceRequestId",
                table: "MaintenanceRequest",
                column: "ServiceRequestId");

            migrationBuilder.AddForeignKey(
                name: "FK_MaintenanceRequest_ServiceRequests_ServiceRequestId",
                table: "MaintenanceRequest",
                column: "ServiceRequestId",
                principalTable: "ServiceRequests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
