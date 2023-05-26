'use strict';

import { store } from './store';
import './helpers/patterns/reactive/test';

document.addEventListener('DOMContentLoaded', () => {
	const App = {
		$: {
			form: document.getElementById('todo-form') as HTMLFormElement,
			todoId: document.getElementById('todo-id') as HTMLLIElement,
			viewTodos: document.getElementById('todos') as HTMLUListElement,
			enteredTodo: document.getElementById('entered-todo') as HTMLInputElement,
		},

		methods: {
			handleCreateTodo() {
				App.$.enteredTodo.addEventListener('change', (e: Event) => {
					const enteredTodo = (e.target as HTMLInputElement).value;

					const payload = {
						id: window.crypto.randomUUID(),
						todo: enteredTodo,
						completed: false,
					};

					store.mutate.createTodo(payload);
					App.renders.removeDisplayTodoList();
					App.renders.displayTodoList();
				});
			},
			handleUpdateTodo() {
				const viewTodo = App.$.viewTodos;

				App.watch.mutationObserver(viewTodo, () => {
					const inputTextElements = Array.from(viewTodo.querySelectorAll<HTMLInputElement>('li #update-todo'));

					inputTextElements.map((inputTextElement) => {
						inputTextElement.addEventListener('change', (e) => {
							const currentTarget = e.currentTarget as HTMLInputElement;
							const todoId = currentTarget.closest('li')?.getAttribute('data-todo-id');
							const updatedTodo = currentTarget.value as string;

							const payload = {
								id: todoId as string,
								todo: updatedTodo,
							};

							store.mutate.updateTodo(payload);
						});
					});
				});
			},

			handleUpdateCompleted() {
				const viewTodo = App.$.viewTodos;

				App.watch.mutationObserver(viewTodo, () => {
					const inputTextElements = Array.from(
						viewTodo.querySelectorAll<HTMLInputElement>('li #updated-completed-todo')
					);

					inputTextElements.map((inputTextElement) => {
						inputTextElement.addEventListener('change', (e) => {
							const currentTarget = e.currentTarget as HTMLInputElement;
							const todoId = currentTarget.closest('li')?.getAttribute('data-todo-id');
							const updatedCompleted = currentTarget.checked;

							const payload = {
								id: todoId as string,
								completed: updatedCompleted,
							};

							store.mutate.updateTodo(payload);
						});
					});
				});
			},
			handleDeleteTodo() {
				const viewTodo = App.$.viewTodos;

				App.watch.mutationObserver(viewTodo, () => {
					const buttons = Array.from(viewTodo.querySelectorAll('#delete-todo'));

					buttons.map((button) => {
						button.addEventListener('click', (e: Event) => {
							const todoId = (e.target as HTMLButtonElement).closest('li')!.getAttribute('data-todo-id') as string;

							store.mutate.deleteTodo(todoId);

							App.renders.removeDisplayTodoList();
							App.renders.displayTodoList();
						});
					});
				});
			},
			handleSubmit() {
				App.$.form?.addEventListener('submit', (e: SubmitEvent) => {
					e.preventDefault();

					App.$.enteredTodo.value = '';
				});
			},
		},

		watch: {
			mutationObserver(node: HTMLElement, fn: () => void, options = { childList: true }) {
				// Create a MutationObserver to observe changes in the #todos element
				const observer = new MutationObserver(fn);
				observer.observe(node, options);
			},
			eventListeners() {
				const propTypes = ['methods'];

				Object.keys(App).map((property) => {
					const isIncludedPropType = propTypes.includes(property);

					if (isIncludedPropType) {
						// type Element = {
						// 	[Key in keyof typeof App]: (typeof App)[Key];
						// }[keyof typeof App];

						const levelOne = (App as any)[property];

						Object.keys(levelOne).forEach((method) => {
							const currentMethod = levelOne[method];
							if (typeof currentMethod === 'function') {
								currentMethod(); // Execute the method
							}
						});
					}
				});
			},
		},

		renders: {
			displayTodoList() {
				store.getters.getTodos.map((todo) => {
					const liElement = document.createElement('li') as HTMLLIElement;
					const buttonElement = document.createElement('button') as HTMLButtonElement;
					const inputCheckboxElement = document.createElement('input') as HTMLInputElement;
					const inputTextElement = document.createElement('input') as HTMLInputElement;

					liElement.setAttribute('data-todo-id', todo.id);

					inputTextElement.value = todo.todo as string;
					inputTextElement.setAttribute('id', 'update-todo');

					inputCheckboxElement.type = 'checkbox';
					inputCheckboxElement.setAttribute('id', 'updated-completed-todo');
					inputCheckboxElement.checked = todo.completed as boolean;

					buttonElement.setAttribute('id', 'delete-todo');
					buttonElement.textContent = 'delete';

					App.$.viewTodos.appendChild(liElement);

					liElement.appendChild(inputTextElement);
					liElement.appendChild(inputCheckboxElement);
					liElement.appendChild(buttonElement);
				});
			},
			removeDisplayTodoList() {
				const Todos = Array.from(App.$.viewTodos.children);
				Todos.map((todo) => todo.remove());
			},
		},

		init() {
			this.watch.eventListeners();
			this.renders.displayTodoList();
		},
	};

	App.init();
});
