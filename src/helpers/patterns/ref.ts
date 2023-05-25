type Ref<T> = {
	current: T | (() => T);
};

type InitialValue<T> = T | (() => T);

export function ref<T>(initialValue: InitialValue<T>): Ref<T> {
	let current: T;

	if (typeof initialValue === 'function') {
		current = (initialValue as () => T)();
	} else {
		current = initialValue;
	}

	return Object.seal({
		current,
	});
}
