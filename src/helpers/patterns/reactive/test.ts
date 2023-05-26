import { createStore, Reactive } from './reactive';

type Todo = { id: string | number; todo: string; completed: boolean };

type State = {
	todo: Todo[];
};

type Getters = {
	getTodos: () => Todo[];
};

type Mutation = {
	createTodo: (payload: Todo) => void;
	updateTodos: (id: string | number) => void;
};

const store: Reactive<State, Getters, Mutation> = createStore({
	state: {
		todo: [{ id: 0, todo: 'Build Store', completed: false }],
	},
	getters: {
		getTodos() {
			return store.state.todo;
		},
	},
	mutation: {
		createTodo(payload) {
			store.state.todo = [...store.state.todo, payload];
		},
		updateTodos() {
			store.state.todo;
		},
	},
});

const payload: Todo = {
	id: 2,
	todo: 'Testing this out',
	completed: true,
};

store.mutation.createTodo(payload);

console.log(store.getters.getTodos());
