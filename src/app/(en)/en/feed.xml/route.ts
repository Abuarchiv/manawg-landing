import { atomFeed } from '@/topics/machine-readable';

export const dynamic = 'force-static';

export const GET = () => atomFeed('en');
