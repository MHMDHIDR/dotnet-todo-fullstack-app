using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Models;

namespace TodoApi.Controllers
{
    public class TodoItemUpdateDto
    {
        public string? Title { get; set; }
        public bool? IsDone { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly TodoContext _context;

        public TodoController(TodoContext context)
        {
            _context = context;
        }

        // GET /api/todo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodos()
        {
            var todos = await _context.Todos.ToListAsync();
            return Ok(todos);
        }

        // GET /api/todo/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItem>> GetTodoItem(int id)
        {
            var todoItem = await _context.Todos.FindAsync(id);
            if (todoItem == null)
            {
                return NotFound();
            }
            return Ok(todoItem);
        }

        // POST /api/todo
        [HttpPost]
        public async Task<ActionResult<TodoItem>> CreateTodoItem(TodoItem todoItem)
        {
            _context.Todos.Add(todoItem);
            await _context.SaveChangesAsync();

            // Returns 201 Created with URI of the new resource
            return CreatedAtAction(nameof(GetTodoItem), new { id = todoItem.Id }, todoItem);
        }

        // PUT /api/todo/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<TodoItem>> UpdateTodoItem(int id, TodoItemUpdateDto updateDto)
        {
            var existingTodo = await _context.Todos.FindAsync(id);
            if (existingTodo == null)
            {
                return NotFound();
            }

            // Update only the provided fields
            if (updateDto.Title != null)
            {
                existingTodo.Title = updateDto.Title;
            }
            if (updateDto.IsDone.HasValue)
            {
                existingTodo.IsDone = updateDto.IsDone.Value;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TodoItemExists(id))
                    return NotFound();
                else
                    throw;
            }

            // Return the updated item
            return Ok(existingTodo);
        }

        // DELETE /api/todo/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoItem(int id)
        {
            var todoItem = await _context.Todos.FindAsync(id);
            if (todoItem == null)
            {
                return NotFound();
            }

            _context.Todos.Remove(todoItem);
            await _context.SaveChangesAsync();

            return NoContent(); // 204 No Content on successful delete
        }

        private bool TodoItemExists(int id)
        {
            return _context.Todos.Any(e => e.Id == id);
        }
    }
}
