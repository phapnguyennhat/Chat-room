import { findUser } from '@/API/user/query';
import CardUser from './CardUser';

interface IProps {
	searchParams: Promise<QueryUser>;
}

export default async function SearchResult({ searchParams }: IProps) {
	const { keyword='' } = await searchParams;

	const users: User[] = await findUser({ page: 1, limit: 10, keyword });


	return (
		<section>
			<h3 className=' mb-3' >
				{keyword
					? `Search result for ${keyword}`
					: 'Recommended friends'}
			</h3>

			{/* <ul className=' gap-4 w-full grid grid-cols-4' >
				{users.map((user, index) => (
					<li key={index}>
						<CardUser user={user} />
					</li>
				))}
			</ul> */}
		</section>
	);
}
