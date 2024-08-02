using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string ConnectionId { get; set; } = string.Empty;
        public int? RoomId { get; set; }
        public Room? Room { get; set; }

    }
}