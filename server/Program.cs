using server.Hubs;
var builder = WebApplication.CreateBuilder(args);
var client_domain=Environment.GetEnvironmentVariable("CLIENT_DOMAIN");
var client_port=Environment.GetEnvironmentVariable("CLIENT_PORT");
var is_https=Environment.GetEnvironmentVariable("IS_HTTPS")=="true"?"https://":"http://";
var origin=$"{is_https}{client_domain}:{client_port}";
Console.WriteLine(origin);
// Add services to the container.
builder.Services.AddSignalR(opt=>{
opt.MaximumReceiveMessageSize=1024*500;
});
builder.Services.AddCors(options=>{
    options.AddPolicy(name:origin,policy=>{
        policy.WithOrigins(origin).SetIsOriginAllowedToAllowWildcardSubdomains().AllowAnyHeader();
       
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
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
