using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using server.Interfaces;
using server.Models;
using server.Repositories;

namespace server.Hubs
{
    public class VoiceChatHub(IUserRepository userRepository, IRoomRepository roomRepository, ILoggerService loggerService) : Hub
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IRoomRepository _roomRepository = roomRepository;
        private readonly ILoggerService _loggerService = loggerService;


        public async Task makeNewRoom(string roomName)
        {
            var createdUser = await _userRepository.GetUserByCoonectionIdAsync(Context.ConnectionId);

            if (createdUser != null)
            {

                if (await _roomRepository.RoomExistAsync(roomName))
                {
                    await Clients.Caller.SendAsync("roomExistsError", roomName);
                    _loggerService.Room($"{roomName} already created");

                }
                else
                {

                    var newRoom = new Room();
                    newRoom.Roomname = roomName;

                    newRoom.CreatorConnecionId = createdUser.ConnectionId;
                    newRoom.AddUser(createdUser);
                    var createdRoom = await _roomRepository.CraeteRoomAsync(newRoom);
                    await _userRepository.UpdateUserRoomAsync(createdUser.Id, createdRoom);

                    //TODO:only send the Id,Name,Creatorname,ParticipanceCount of room
                    //make DTO for it
                    await Clients.AllExcept(Context.ConnectionId).SendAsync("recevieNewRoom", createdRoom);

                    _loggerService.Room($"new room:{newRoom.Roomname} by:{createdUser.Username}");
                }



            }

        }
        public async Task GetRooms()
        {
            var rooms = await _roomRepository.GetRoomsAsync();
            await Clients.Caller.SendAsync("receiveRooms", rooms);
        }
        public async Task SendUsername(string userName)
        {
            var newUser = new User();
            newUser.Username = userName;
            newUser.ConnectionId = Context.ConnectionId;
            await _userRepository.CraeteUserAsync(newUser);
            var count = await _userRepository.GetUsersCountAsync();
            _loggerService.User($"new user:{userName}");
            _loggerService.User($"users count:{count}");




        }
        public async Task ChangeUsername(string userName)
        {
            var user = await _userRepository.GetUserByCoonectionIdAsync(Context.ConnectionId);
            if (user != null)
            {
                _loggerService.User($"{user.Username} change their username to {userName}");
                await _userRepository.UpdateUserNameAsync(Context.ConnectionId, userName);

            }
        }
        public async Task SendVoice(string data)
        {
            await Clients.All.SendAsync("getVoice", data);
        }
        public override async Task OnConnectedAsync()
        {
            await GetRooms();
        }


        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            //TODO:check if anyone was inside room,then delete them from room
            var user = await _userRepository.GetUserByCoonectionIdAsync(Context.ConnectionId);
            if (user == null) return;
            if (user.Room == null)
            {
                _loggerService.User($"{user.Username} disconnected.");

                await _userRepository.DeleteUserByConnectionIdAsync(Context.ConnectionId);
                await base.OnDisconnectedAsync(exception);
                return;
            }
            var isCreator = await _roomRepository.IsCreatorByConnectionIdAsync(user.ConnectionId);
            if (isCreator)
            {
                _loggerService.Log($"the creator of {user.Room.Roomname} disconnected. room will be deleted");
                await _roomRepository.DeleteRoomByNameAsync(user.Room.Roomname);

            }
            else
            {
                _loggerService.User($"{user.Username} disconnected. user will be removed from {user.Room.Roomname}");
                await _roomRepository.RemoveUserFromRoomByConnectionIdAsync(user.ConnectionId, user.Room.Roomname);

            }

            await _userRepository.DeleteUserByConnectionIdAsync(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }


    }
}