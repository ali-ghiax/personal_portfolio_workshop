var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();  // looks for index.html by default
app.UseStaticFiles();

app.Run();
