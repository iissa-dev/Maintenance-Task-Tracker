using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Repositories.Migrations
{
    /// <inheritdoc />
    public partial class RestoreServiceRequestIdInMaintenanceRequestMain1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MaintenanceRequest_ServiceRequests_ServiceRequestId",
                table: "MaintenanceRequest");

            migrationBuilder.AddForeignKey(
                name: "FK_MaintenanceRequest_ServiceRequests_ServiceRequestId",
                table: "MaintenanceRequest",
                column: "ServiceRequestId",
                principalTable: "ServiceRequests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MaintenanceRequest_ServiceRequests_ServiceRequestId",
                table: "MaintenanceRequest");

            migrationBuilder.AddForeignKey(
                name: "FK_MaintenanceRequest_ServiceRequests_ServiceRequestId",
                table: "MaintenanceRequest",
                column: "ServiceRequestId",
                principalTable: "ServiceRequests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
