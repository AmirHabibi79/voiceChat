using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    public class Room
    {
        private readonly List<User> _users = new();
        public int Id { get; set; }
        public string Roomname { get; set; } = string.Empty;
        public IEnumerable<User> Users => _users.ToList();
        public void AddUser(User user) => _users.Add(user);
        public string CreatorConnecionId { get; set; } = string.Empty;

    }
}