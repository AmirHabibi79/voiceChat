using System.Collections.ObjectModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using server.Interfaces;
using server.Models;

namespace server.Repositories
{

    public class RoomRepository : IRoomRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserRepository _userRepository;

        public RoomRepository(ApplicationDbContext context, IUserRepository userRepository)
        {
            this._context = context;
            this._userRepository = userRepository;

        }
        public async Task<Room?> GetRoomByNameAsync(string name)
        {
            var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Roomname == name);
            return room;
        }
        public async Task<bool> RoomExistAsync(string name)
        {
            var roomExist = await _context.Rooms.Where(r => r.Roomname == name).FirstOrDefaultAsync();
            if (roomExist != null)
            {
                return true;
            }
            return false;
        }
        public async Task<IEnumerable<Room>> GetRoomsAsync()
        {
            //TODO:add env for max of rooms
            var rooms = await _context.Rooms.Include(r => r.Users).AsNoTracking().Skip(0).Take(10).ToListAsync();
            return rooms;
        }

        public async Task<Room> CraeteRoomAsync(Room room)
        {

            await _context.Rooms.AddAsync(room);
            await _context.SaveChangesAsync();
            return room;
        }

        public async Task<Room?> DeleteRoomByNameAsync(string name)
        {
            var roomToRemove = await _context.Rooms.FirstOrDefaultAsync(r => r.Roomname == name);
            if (roomToRemove != null)
            {
                _context.Rooms.Remove(roomToRemove);
                await _context.SaveChangesAsync();
            }
            return roomToRemove;
        }
        public async Task<bool> IsCreatorByConnectionIdAsync(string coonectionId)
        {
            var room = await _context.Rooms.Where(r => r.CreatorConnecionId == coonectionId).FirstOrDefaultAsync();
            return room != null ? true : false;
        }
        public async Task<Room?> RemoveUserFromRoomByConnectionIdAsync(string connectionId, string roomName)
        {
            // var user=await _context.Users.Include(u=>u.Room).Where(u=>u.ConnectionId==connectionId).FirstOrDefaultAsync();
            // if(user!=null){
            //     var room=await _context.Rooms.Include(r=>r.Users).Where(r=>r.Roomname==user.)
            // }
            var room = await _context.Rooms.Include(r => r.Users).Where(r => r.Roomname == roomName).FirstOrDefaultAsync();
            if (room == null) return null;
            var user = await _userRepository.GetUserByCoonectionIdAsync(connectionId);
            if (user == null) return null;

            room.Users.ToList().Remove(user);
            if (room.Users.Count() == 0)
            {
                _context.Rooms.Remove(room);

            }

            await _context.SaveChangesAsync();
            return room;

        }


        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }


    }
}