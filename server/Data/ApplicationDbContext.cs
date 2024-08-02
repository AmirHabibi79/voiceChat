
using Microsoft.EntityFrameworkCore;
using server.Models;
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : base(options)
    {

    }

    public DbSet<User> Users { get; set; }
    public DbSet<Room> Rooms { get; set; }

}