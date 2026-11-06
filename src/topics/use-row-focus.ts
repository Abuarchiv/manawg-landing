import { useEffect, useRef } from 'react';

/**
 * Keeps keyboard focus in the form when a row is removed: the removed row's button unmounts, so
 * focus would fall back to the top of the page. It goes to the name field of the next row, else
 * of the previous one, else to the add button.
 */
export function useRowFocus(rows: Array<{ id: number }>) {
	const target = useRef<number | null>(null);
	const names = useRef(new Map<number, HTMLInputElement>());
	const addButton = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		// Runs when the number of rows changes; the target is only set by a removal.
		const id = target.current;
		if (id === null || rows.length === 0) return;
		target.current = null;
		(names.current.get(id) ?? addButton.current)?.focus();
	}, [rows.length]);

	return {
		addButton,
		nameRef: (id: number) => (element: HTMLInputElement | null) => {
			if (element) names.current.set(id, element);
			else names.current.delete(id);
		},
		/** Call right before the row is removed. */
		beforeRemove: (id: number) => {
			const i = rows.findIndex((r) => r.id === id);
			target.current = (rows[i + 1] ?? rows[i - 1])?.id ?? -1;
		},
	};
}
