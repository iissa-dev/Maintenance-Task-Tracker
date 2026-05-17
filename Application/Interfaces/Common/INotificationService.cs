namespace Application.Interfaces.Common;

public interface INotificationService
{
    Task SendNewOrderNotificationAsync(object data);
    Task SendToUserAsync(int userId, string method, object data);
}
