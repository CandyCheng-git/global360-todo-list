using Todo.Api.Models;
using Todo.Api.Repositories;

namespace Todo.Api.Services;

public sealed class TodoService : ITodoService
{
    private const int MaxTitleLength = 200;

    private readonly ITodoRepository _todoRepository;

    public TodoService(ITodoRepository todoRepository)
    {
        _todoRepository = todoRepository;
    }

    public IReadOnlyCollection<TodoItem> GetAll()
    {
        return _todoRepository.GetAll();
    }

    public AddTodoResult Add(string? title)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            return AddTodoResult.Invalid("Title is required.");
        }

        var trimmedTitle = title.Trim();

        if (trimmedTitle.Length > MaxTitleLength)
        {
            return AddTodoResult.Invalid($"Title must be {MaxTitleLength} characters or fewer.");
        }

        return AddTodoResult.Success(_todoRepository.Add(trimmedTitle));
    }

    public bool Delete(Guid id)
    {
        return _todoRepository.Delete(id);
    }
}
