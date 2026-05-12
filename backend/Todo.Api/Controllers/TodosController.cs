using Microsoft.AspNetCore.Mvc;
using Todo.Api.DTOs;
using Todo.Api.Models;
using Todo.Api.Services;

namespace Todo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class TodosController : ControllerBase
{
    private readonly ITodoService _todoService;

    public TodosController(ITodoService todoService)
    {
        _todoService = todoService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyCollection<TodoResponse>), StatusCodes.Status200OK)]
    public ActionResult<IReadOnlyCollection<TodoResponse>> GetTodos()
    {
        var todos = _todoService.GetAll()
            .Select(ToResponse)
            .ToArray();

        return Ok(todos);
    }

    [HttpPost]
    [ProducesResponseType(typeof(TodoResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult<TodoResponse> AddTodo([FromBody] CreateTodoRequest? request)
    {
        var result = _todoService.Add(request?.Title);

        if (!result.IsSuccess || result.Todo is null)
        {
            return BadRequest(new { error = result.Error });
        }

        var response = ToResponse(result.Todo);

        return Created($"/api/todos/{response.Id}", response);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult DeleteTodo(Guid id)
    {
        return _todoService.Delete(id) ? NoContent() : NotFound();
    }

    private static TodoResponse ToResponse(TodoItem todo)
    {
        return new TodoResponse(todo.Id, todo.Title, todo.CreatedAtUtc);
    }
}
