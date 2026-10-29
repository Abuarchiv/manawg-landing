import { Landing } from '@/components/landing/Landing';
import { HomeHead } from '@/components/landing/home-head';

export default function Page() {
	return (
		<>
			<HomeHead locale="en" />
			<Landing locale="en" />
		</>
	);
}
