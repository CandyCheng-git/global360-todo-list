using System.Collections.Concurrent;
using Todo.Api.Models;

namespace Todo.Api.Repositories;

public sealed class InMemoryTodoRepository : ITodoRepository
{
    private readonly ConcurrentDictionary<Guid, TodoItem> _todos = new();

    public IReadOnlyCollection<TodoItem> GetAll()
    {
        return _todos.Values
            .OrderBy(todo => todo.CreatedAtUtc)
            .ToArray();
    }

    public TodoItem Add(string title)
    {
        var todo = new TodoItem(Guid.NewGuid(), title, DateTimeOffset.UtcNow);

        _todos[todo.Id] = todo;

        return todo;
    }

    public bool Delete(Guid id)
    {
        return _todos.TryRemove(id, out _);
    }
}
