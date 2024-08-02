using server.Models;
namespace server.Interfaces
{
    public interface IUserRepository : IDisposable
    {
        public Task<User?> GetUserByIdAsync(int id);
        public Task<User?> GetUserByCoonectionIdAsync(string connectionId);

        public Task<User> CraeteUserAsync(User user);
        public Task<int> GetUsersCountAsync();
        public Task<User?> DeleteUserByConnectionIdAsync(string connectionId);
        public Task<User?> UpdateUserRoomAsync(int id, Room room);
        public Task<User?> UpdateUserNameAsync(string connectionId, string username);

    }
}
