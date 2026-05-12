import { Component, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { TodoItem } from './todo-item.model';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly todos = signal<TodoItem[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly deletingIds = signal<ReadonlySet<string>>(new Set());
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly titleControl = new FormControl('', { nonNullable: true });

  constructor(private readonly todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  protected get isAddDisabled(): boolean {
    return this.isSaving() || this.titleControl.value.trim().length === 0;
  }

  protected loadTodos(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.todoService
      .getTodos()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (todos) => this.todos.set(todos),
        error: () => this.errorMessage.set('Unable to load todos. Please check the API and try again.'),
      });
  }

  protected addTodo(event?: Event): void {
    event?.preventDefault();

    const title = this.titleControl.value.trim();

    if (!title) {
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);

    this.todoService
      .addTodo(title)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: (todo) => {
          this.todos.update((todos) => [...todos, todo]);
          this.titleControl.reset('');
        },
        error: () => this.errorMessage.set('Unable to add this todo. Please try again.'),
      });
  }

  protected deleteTodo(todo: TodoItem): void {
    this.deletingIds.update((ids) => new Set(ids).add(todo.id));
    this.errorMessage.set(null);

    this.todoService
      .deleteTodo(todo.id)
      .pipe(
        finalize(() => {
          this.deletingIds.update((ids) => {
            const nextIds = new Set(ids);
            nextIds.delete(todo.id);
            return nextIds;
          });
        }),
      )
      .subscribe({
        next: () => this.todos.update((todos) => todos.filter((item) => item.id !== todo.id)),
        error: () => this.errorMessage.set('Unable to delete this todo. Please try again.'),
      });
  }
}
