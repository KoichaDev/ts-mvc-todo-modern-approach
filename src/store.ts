type Todo = {
	id: string;
	todo?: string;
	completed?: boolean;
};

const todos: Todo[] = [
	{ id: window.crypto.randomUUID(), todo: 'Learning TS', completed: true },
	{ id: window.crypto.randomUUID(), todo: 'Learning JS', completed: false },
];

export const store = {
	getters: {
		getTodos: todos,
	},

	mutate: {
		createTodo(payload: Todo) {
			store.getters.getTodos = [...store.getters.getTodos, payload];
		},
		updateTodo(payload: Todo) {
			const findId = store.getters.getTodos.find((todo) => todo.id === payload.id);

			if (!findId) return;

			console.log(payload);

			store.getters.getTodos = [...store.getters.getTodos, payload];
		},
		deleteTodo(id: string) {
			store.getters.getTodos = store.getters.getTodos.filter((todo) => todo.id !== id);
		},
	},
};
