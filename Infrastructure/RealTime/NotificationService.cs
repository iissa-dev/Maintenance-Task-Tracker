using Application.Interfaces.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.RealTime;

public class NotificationService : INotificationService
{
    private readonly IHubContext<RequestHub> _hubContext;

    public NotificationService(IHubContext<RequestHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendNewOrderNotificationAsync(object data)
    {
        await _hubContext.Clients.All.SendAsync("ReceiveNewOrderNotification", data);
    }

    public async Task SendToUserAsync(int userId, string method, object data)
    {
        await _hubContext.Clients.User(userId.ToString()).SendAsync(method, data);
    }
}

[Authorize]
public class RequestHub : Hub
{
    public override async Task OnConnectedAsync()
    {

    }
}