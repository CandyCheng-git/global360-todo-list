namespace Todo.Api.DTOs;

public sealed record TodoResponse(Guid Id, string Title, DateTimeOffset CreatedAtUtc);
