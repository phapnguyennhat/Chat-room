
import AddFriend from '../components/AddFriend';
import LoadMoreUser from '../components/LoadMoreUser';
import SearchResult from '../components/SearchResult';

interface IProps {
	searchParams : Promise<QueryUser>
}
export default function SearchFriendPage({searchParams}: IProps) {
	return (
		<main className=' p-6' >
			<h1 className=" font-bold text-5xl mb-8 uppercase ">
				Search you friend
			</h1>

			<AddFriend searchParams={searchParams} />

			{/* REQUEST SENT */}

			{/* REQUEST RECEIVED */}

			{/* SEARCH RESULT */}
			<SearchResult searchParams={searchParams} />
			<LoadMoreUser/>

		</main>
	);
}
