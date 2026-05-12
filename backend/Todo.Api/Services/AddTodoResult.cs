using Todo.Api.Models;

namespace Todo.Api.Services;

public sealed record AddTodoResult(TodoItem? Todo, string? Error)
{
    public bool IsSuccess => Todo is not null && Error is null;

    public static AddTodoResult Success(TodoItem todo)
    {
        return new AddTodoResult(todo, null);
    }

    public static AddTodoResult Invalid(string error)
    {
        return new AddTodoResult(null, error);
    }
}
