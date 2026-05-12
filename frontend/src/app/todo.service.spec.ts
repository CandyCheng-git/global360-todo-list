import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('gets todos from the API', () => {
    const expectedTodos = [{ id: 1, title: 'Ship assessment' }];

    service.getTodos().subscribe((todos) => {
      expect(todos).toEqual(expectedTodos);
    });

    const request = httpMock.expectOne('http://localhost:5000/api/todos');
    expect(request.request.method).toBe('GET');
    request.flush(expectedTodos);
  });

  it('posts trimmed todo titles', () => {
    const createdTodo = { id: 2, title: 'Write tests' };

    service.addTodo('  Write tests  ').subscribe((todo) => {
      expect(todo).toEqual(createdTodo);
    });

    const request = httpMock.expectOne('http://localhost:5000/api/todos');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ title: 'Write tests' });
    request.flush(createdTodo);
  });

  it('deletes a todo by id', () => {
    let deleted = false;

    service.deleteTodo(7).subscribe(() => {
      deleted = true;
    });

    const request = httpMock.expectOne('http://localhost:5000/api/todos/7');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
    expect(deleted).toBe(true);
  });
});
