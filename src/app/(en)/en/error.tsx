'use client';

import { ErrorView } from '@/components/ErrorView';

export default function ErrorBoundary(props: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return <ErrorView locale="en" {...props} />;
}
