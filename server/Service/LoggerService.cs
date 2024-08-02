using server.Interfaces;
namespace server.Services
{
    public class LoggerService(IWebHostEnvironment environment) : ILoggerService
    {
        private readonly bool _isDev = environment.IsDevelopment();

        public void Log(string text)
        {
            if (_isDev)
            {
                var time = DateTime.Now.ToString("[hh:mm:ss]");
                Console.BackgroundColor = ConsoleColor.DarkGray;
                Console.Write(time + "[Info]" + ":" + text);
                Console.ResetColor();
                Console.WriteLine();
            }
        }
        public void User(string text)
        {
            if (_isDev)
            {
                var time = DateTime.Now.ToString("[hh:mm:ss]");
                Console.BackgroundColor = ConsoleColor.DarkBlue;
                Console.Write(time + "[User]" + ":" + text);
                Console.ResetColor();
                Console.WriteLine();
            }
        }
        public void Room(string text)
        {
            if (_isDev)
            {
                var time = DateTime.Now.ToString("[hh:mm:ss]");
                Console.BackgroundColor = ConsoleColor.DarkMagenta;
                Console.Write(time + "[Room]" + ":" + text);
                Console.ResetColor();
                Console.WriteLine();
            }
        }
    }
}