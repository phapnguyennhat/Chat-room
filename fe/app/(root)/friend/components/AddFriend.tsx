'use client';

import { keyWordSchema } from '@/API/user/schema';
import Button from '@/components/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export default function AddFriend() {
	const {
		register,
		setError,
		formState: { errors },
		
		handleSubmit,
	} = useForm({ resolver: zodResolver(keyWordSchema) });

	const router = useRouter()

	const handleSearch =  (data: {keyword: string}) => {
		router.replace(`?keyword=${data.keyword}`)
	};

	return (
		<form onSubmit={handleSubmit(handleSearch)} className=" max-w-sm">
			<label
				htmlFor="email"
				className=" uppercase block text-sm font-medium leading-6 text-gray-900"
			>
				Add friend by name or email
			</label>

			<div className=" mt-2 flex gap-4">
				<input
					{...register('keyword')}
					placeholder="Name or Email"
					className=" px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm  sm:leading-6 "
				/>
				<Button type="submit">Add</Button>
			</div>
			{errors.keyword && (
				<p className=" text-left text-red-500">
					{errors.keyword.message}
				</p>
			)}
		</form>
	);
}
