export type Reactive<S = {}, G = {}, M = {}> = {
	state: S extends infer TState ? TState : never;
	getters: G extends infer TGetters ? TGetters : never;
	mutation: M extends infer TMutation ? TMutation : never;
};

const reactive: Reactive<any, any, any> = {
	state: {},
	getters: {},
	mutation: {},
};

export const createStore = <S = {}, G = {}, M = {}>(module: Reactive<S, G, M> = reactive): Reactive<S, G, M> => {
	const { state, getters, mutation } = module;

	return Object.freeze({
		state,
		getters,
		mutation,
	});
};
