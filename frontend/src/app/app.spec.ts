import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, Subject, of, throwError } from 'rxjs';
import { App } from './app';
import { TodoItem } from './todo-item.model';
import { TodoService } from './todo.service';

class TodoServiceStub {
  todos: TodoItem[] = [];
  getTodosResponse?: Observable<TodoItem[]>;
  addSubject = new Subject<TodoItem>();
  deleteSubject = new Subject<void>();

  getTodos(): Observable<TodoItem[]> {
    return this.getTodosResponse ?? of(this.todos);
  }

  addTodo(_title: string): Observable<TodoItem> {
    return this.addSubject.asObservable();
  }

  deleteTodo(_id: number): Observable<void> {
    return this.deleteSubject.asObservable();
  }
}

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let service: TodoServiceStub;

  beforeEach(async () => {
    service = new TodoServiceStub();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: TodoService, useValue: service }],
    }).compileComponents();
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
  }

  function addButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.primary-button') as HTMLButtonElement;
  }

  it('loads and displays todos', () => {
    service.todos = [
      { id: 1, title: 'Write API tests' },
      { id: 2, title: 'Polish README' },
    ];

    createComponent();

    const items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Write API tests');
    expect(fixture.nativeElement.textContent).toContain('Polish README');
  });

  it('shows a loading state while todos load', () => {
    const getTodosSubject = new Subject<TodoItem[]>();
    service.getTodosResponse = getTodosSubject.asObservable();

    createComponent();

    expect(fixture.nativeElement.textContent).toContain('Loading todos...');

    getTodosSubject.next([]);
    getTodosSubject.complete();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Loading todos...');
  });

  it('disables add when the title is empty or whitespace', () => {
    createComponent();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '   ';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(addButton().disabled).toBe(true);
  });

  it('adds a todo and clears the form', () => {
    createComponent();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const addTodoSpy = vi.spyOn(service, 'addTodo');

    input.value = 'Review submission';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

    expect(addTodoSpy).toHaveBeenCalledWith('Review submission');
    service.addSubject.next({ id: 3, title: 'Review submission' });
    service.addSubject.complete();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Review submission');
    expect(input.value).toBe('');
  });

  it('deletes a todo', () => {
    service.todos = [{ id: 1, title: 'Remove me' }];
    createComponent();

    const deleteButton = fixture.debugElement.query(By.css('.delete-button')).nativeElement as HTMLButtonElement;
    deleteButton.click();
    service.deleteSubject.next();
    service.deleteSubject.complete();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Remove me');
    expect(fixture.nativeElement.textContent).toContain('No todos yet');
  });

  it('shows a friendly error when loading fails', () => {
    vi.spyOn(service, 'getTodos').mockReturnValue(throwError(() => new Error('offline')));

    createComponent();

    expect(fixture.nativeElement.textContent).toContain('Unable to load todos. Please try again.');
  });
});
