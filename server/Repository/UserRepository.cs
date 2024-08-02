using Microsoft.EntityFrameworkCore;
using server.Interfaces;
using server.Models;

namespace server.Repositories
{

    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;
        public UserRepository(ApplicationDbContext context)
        {
            this._context = context;
        }


        public async Task<User?> GetUserByIdAsync(int id)
        {
            var User = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

            return User;
        }
        public async Task<User?> GetUserByCoonectionIdAsync(string connectionId)
        {
            var user = await _context.Users.Include(u => u.Room).FirstOrDefaultAsync(u => u.ConnectionId == connectionId);
            return user;
        }


        public async Task<User> CraeteUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }
        public async Task<int> GetUsersCountAsync()
        {
            var count = await _context.Users.CountAsync();
            return count;
        }
        public async Task<User?> DeleteUserByConnectionIdAsync(string connectionId)
        {
            var userToRemove = await _context.Users.FirstOrDefaultAsync(u => u.ConnectionId == connectionId);
            if (userToRemove != null)
            {
                _context.Users.Remove(userToRemove);
                await _context.SaveChangesAsync();

            }
            return userToRemove;
        }
        public async Task<User?> UpdateUserRoomAsync(int id, Room room)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user != null)
            {
                user.Room = room;
                await _context.SaveChangesAsync();
            }
            return user;
        }
        public async Task<User?> UpdateUserNameAsync(string connectionId, string username)
        {
            var user = await this.GetUserByCoonectionIdAsync(connectionId);
            if (user != null)
            {
                user.Username = username;
                await _context.SaveChangesAsync();
            }
            return user;
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