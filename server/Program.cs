using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using server.Hubs;
using server.Interfaces;
using server.Repositories;
using server.Services;
var builder = WebApplication.CreateBuilder(args);
var client_domain = Environment.GetEnvironmentVariable("CLIENT_DOMAIN");
var client_port = Environment.GetEnvironmentVariable("CLIENT_PORT");
var is_https = Environment.GetEnvironmentVariable("IS_HTTPS") == "true" ? "https://" : "http://";
var origin = $"{is_https}{client_domain}:{client_port}";
// Add services to the container.
builder.Services.AddSignalR(opt =>
{
    opt.MaximumReceiveMessageSize = 1024 * 500;
}).AddJsonProtocol(options =>
    {
        options.PayloadSerializerOptions.PropertyNamingPolicy = null;
        options.PayloadSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    }); ;
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: origin, policy =>
    {
        policy.WithOrigins(origin).SetIsOriginAllowedToAllowWildcardSubdomains().AllowAnyHeader();

    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

builder.Services.AddScoped<ILoggerService, LoggerService>();


builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRoomRepository, RoomRepository>();


builder.Services.AddDbContext<ApplicationDbContext>(
    options => options.UseInMemoryDatabase("voice_chat_db"));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // app.UseSwagger();
    // app.UseSwaggerUI();
}
app.UseCors(origin);

app.UseHttpsRedirection();


app.UseAuthorization();

app.MapControllers();
var webSocketOptions = new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromMinutes(2)
};
app.UseWebSockets(webSocketOptions);
app.MapHub<VoiceChatHub>("/voiceChatHub");

app.Run();
