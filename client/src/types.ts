export type User = {
  Id: number;
  Username: string;
  ConnectionId: string;
};

export type Room = {
  Id: number;
  Roomname: string;
  Users: User[];
  CreatedBy: User;
};
export type ReceivedRoom = {
  Id: number;
  CreatorConnecionId: string;
  Roomname: string;
  Users: User[];
};
