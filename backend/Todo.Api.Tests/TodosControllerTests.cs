using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Todo.Api.DTOs;

namespace Todo.Api.Tests;

public class TodosApiTests
{
    [Fact]
    public async Task AddTodo_ReturnsCreatedTodo()
    {
        using var factory = new WebApplicationFactory<Program>();
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/todos", new CreateTodoRequest("  Write tests  "));

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var todo = await response.Content.ReadFromJsonAsync<TodoResponse>();
        Assert.NotNull(todo);
        Assert.Equal("Write tests", todo.Title);
        Assert.NotEqual(Guid.Empty, todo.Id);
    }

    [Fact]
    public async Task GetTodos_ReturnsTodos()
    {
        using var factory = new WebApplicationFactory<Program>();
        var client = factory.CreateClient();
        await AddTodo(client, "First todo");

        var response = await client.GetAsync("/api/todos");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var todos = await response.Content.ReadFromJsonAsync<TodoResponse[]>();
        Assert.NotNull(todos);
        var todo = Assert.Single(todos);
        Assert.Equal("First todo", todo.Title);
    }

    [Fact]
    public async Task DeleteTodo_WhenTodoExists_ReturnsNoContentAndRemovesTodo()
    {
        using var factory = new WebApplicationFactory<Program>();
        var client = factory.CreateClient();
        var todo = await AddTodo(client, "Remove me");

        var deleteResponse = await client.DeleteAsync($"/api/todos/{todo.Id}");
        var listResponse = await client.GetAsync("/api/todos");

        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
        var todos = await listResponse.Content.ReadFromJsonAsync<TodoResponse[]>();
        Assert.NotNull(todos);
        Assert.Empty(todos);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public async Task AddTodo_WhenTitleIsEmpty_ReturnsBadRequest(string title)
    {
        using var factory = new WebApplicationFactory<Program>();
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/todos", new CreateTodoRequest(title));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task DeleteTodo_WhenTodoDoesNotExist_ReturnsNotFound()
    {
        using var factory = new WebApplicationFactory<Program>();
        var client = factory.CreateClient();

        var response = await client.DeleteAsync($"/api/todos/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    private static async Task<TodoResponse> AddTodo(HttpClient client, string title)
    {
        var response = await client.PostAsJsonAsync("/api/todos", new CreateTodoRequest(title));
        response.EnsureSuccessStatusCode();

        var todo = await response.Content.ReadFromJsonAsync<TodoResponse>();
        Assert.NotNull(todo);

        return todo;
    }
}
