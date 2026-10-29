import { HomeHead } from '@/components/landing/home-head';
import { Landing } from '@/components/landing/Landing';

export default function Page() {
	return (
		<>
			<HomeHead locale="de" />
			<Landing locale="de" />
		</>
	);
}
