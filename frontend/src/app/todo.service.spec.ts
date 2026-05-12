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
    const expectedTodos = [{ id: '0d32fe58-d2bf-42b1-8d50-db99ae3b7f07', title: 'Ship assessment' }];

    service.getTodos().subscribe((todos) => {
      expect(todos).toEqual(expectedTodos);
    });

    const request = httpMock.expectOne('http://localhost:5000/api/todos');
    expect(request.request.method).toBe('GET');
    request.flush(expectedTodos);
  });

  it('posts trimmed todo titles', () => {
    const createdTodo = { id: '4a22ee57-5511-4bbf-bd81-45e37cbac433', title: 'Write tests' };

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

    service.deleteTodo('f559cf06-3018-4985-97bf-40fdb94e66a1').subscribe(() => {
      deleted = true;
    });

    const request = httpMock.expectOne('http://localhost:5000/api/todos/f559cf06-3018-4985-97bf-40fdb94e66a1');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
    expect(deleted).toBe(true);
  });
});
