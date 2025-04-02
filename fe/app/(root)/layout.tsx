import { getProfile } from '@/API/user/query';
import NavSide from '@/components/NavSide';
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
		<main className=" flex flex-row">
			<NavSide user={profile} />
			<div className=' ml-[80px]'>{children}</div>
		</main>
	);
}
