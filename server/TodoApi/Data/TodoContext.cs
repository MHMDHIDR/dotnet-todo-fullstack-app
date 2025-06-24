using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Data {
 public class TodoContext : DbContext
{
    public TodoContext(DbContextOptions<TodoContext> opts) : base(opts)
    {
    }

    public DbSet<TodoItem> Todos { get; set; }
}
}
