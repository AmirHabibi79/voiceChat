using Microsoft.AspNetCore.SignalR;

namespace server.Hubs
{
    public class VoiceChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("receiveMessage", user, message);
        }
        public async Task SendVoice(string data)
        {
            await Clients.All.SendAsync("getVoice", data);
        }
    }
}