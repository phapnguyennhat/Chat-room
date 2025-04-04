'use client'
import Button from '@/components/button';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface IProps {
	searchParams: Promise<QueryUser>
	textLabel: string

}
export default  function AddFriend({searchParams, textLabel}: IProps) {
	
	const [keyword, setKeyword] = useState('')
	const router = useRouter()

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		router.push(`?keyword=${keyword}`)
	}
	

	return (
		<form onSubmit={handleSubmit}  className=" max-w-sm mb-4">
			<label
				htmlFor="keyword"
				className=" uppercase block text-sm font-medium leading-6 text-gray-900"
			>
				{textLabel}
			</label>

			<div className=" mt-2 flex gap-4">
				<input
					name='keyword'
					value={keyword}
					onChange={(e)=>setKeyword(e.target.value)}
					placeholder="Search"
					className=" px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm  sm:leading-6 "
				/>
				<Button type="submit"> <Search size={25} /></Button>
			</div>
				
		</form>
	);
}

