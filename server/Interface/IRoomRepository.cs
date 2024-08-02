using System.Collections.ObjectModel;
using server.Models;
namespace server.Interfaces
{
    public interface IRoomRepository : IDisposable
    {
        public Task<Room?> GetRoomByNameAsync(string name);
        public Task<IEnumerable<Room>> GetRoomsAsync();
        public Task<bool> RoomExistAsync(string name);


        public Task<Room> CraeteRoomAsync(Room room);
        public Task<Room?> DeleteRoomByNameAsync(string name);
        public Task<bool> IsCreatorByConnectionIdAsync(string coonectionId);
        public Task<Room?> RemoveUserFromRoomByConnectionIdAsync(string connectionId, string roomName);


    }
}
