
import AddFriend from '../components/AddFriend';
import InfinityUser from '../components/InfinityUser';
import LoadMoreUser from '../components/LoadMoreUser';
import SearchResult from '../components/SearchResult';

interface IProps {
	searchParams : Promise<QueryUser>
}
export default function SearchFriendPage({searchParams}: IProps) {
	return (
		<main className=' p-6' >
			<h1 className=" font-bold text-5xl mb-8 uppercase ">
				Search your friend
			</h1>

			<AddFriend textLabel='Add friend by name or email' searchParams={searchParams} />

			{/* REQUEST SENT */}

			{/* REQUEST RECEIVED */}

			{/* SEARCH RESULT */}
			<SearchResult searchParams={searchParams} />
			<InfinityUser/>
			{/* <LoadMoreUser/> */}

		</main>
	);
}
