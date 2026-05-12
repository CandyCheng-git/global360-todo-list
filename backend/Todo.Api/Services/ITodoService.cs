using Todo.Api.Models;

namespace Todo.Api.Services;

public interface ITodoService
{
    IReadOnlyCollection<TodoItem> GetAll();

    AddTodoResult Add(string? title);

    bool Delete(Guid id);
}
