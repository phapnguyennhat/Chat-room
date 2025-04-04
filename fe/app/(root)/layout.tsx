import { getProfile } from '@/API/user/query';
import BellNotification from '@/components/BellNotification';
import NavSide from '@/components/NavSide';
import { SocketProvider } from '@/provider/SocketProvider';
import { notFound } from 'next/navigation';

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const profile = await getProfile();
	if (!profile) {
		notFound();
	}

	return (
		<SocketProvider>
			<main>
				<NavSide user={profile} />
				<div className="ml-[340px]">
					{children}
				</div>
				
			</main>
		</SocketProvider>
	);
}
