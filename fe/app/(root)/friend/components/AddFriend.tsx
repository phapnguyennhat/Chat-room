
import Button from '@/components/button';

interface IProps {
	searchParams : Promise<QueryUser>
}
export default  async function AddFriend({searchParams}: IProps) {
	
	const {keyword} = await searchParams

	return (
		<form action={'/friend/search'}  className=" max-w-sm mb-4">
			<label
				htmlFor="keyword"
				className=" uppercase block text-sm font-medium leading-6 text-gray-900"
			>
				Add friend by name or email
			</label>

			<div className=" mt-2 flex gap-4">
				<input
					name='keyword'
					defaultValue={keyword}
					placeholder="Search"
					className=" px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm  sm:leading-6 "
				/>
				<Button type="submit">Add</Button>
			</div>
			
		</form>
	);
}
