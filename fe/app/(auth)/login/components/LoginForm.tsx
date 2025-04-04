'use client';

import { login } from '@/API/auth/action';
import { LoginData, loginSchema } from '@/API/auth/schema';
import Button from '@/components/button';
import LoginGoogle from '@/components/LoginGoogle';
import { Input } from '@/components/ui/input';
import { setSpinner } from '@/lib/features/spinner/spinnerSlice';
import { isErrorResponse } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

export default function LoginForm() {
	const {
		register,
		handleSubmit,
		setValue,
		setError,

		formState: { errors },
	} = useForm({
		resolver: zodResolver(loginSchema),
	});

	const dispatch = useDispatch()
	const router = useRouter()

	const queryClient = useQueryClient()

	

	const handleLogin = async (data: LoginData) => {
		dispatch(setSpinner(true))

		const response = await login(data);

		if (isErrorResponse(response)) {
			toast.error('Login failed', {
				description: response.message,
				style: { backgroundColor: 'red', color: 'white' },
			});
		} else {
		
			queryClient.removeQueries({ queryKey: ['users'], exact: false})
			queryClient.removeQueries({ queryKey: ['friends'], exact: false})
			
			router.replace('/')
		}

		dispatch(setSpinner(false))

	};

	return (
		<form
			className=" px-3 w-full max-w-[500px] flex flex-col items-center space-y-3 "
			onSubmit={handleSubmit(handleLogin)}
		>
			<div className=' w-full' >
				<Input placeholder='Email or Username'  {...register('account')} />
				{errors.account && (
					<p className="  text-left text-red-500">
						{errors.account.message}
					</p>
				)}
			</div>

			<div className=' w-full' >
				<Input type='password' placeholder='Password' {...register('password')} />
				{errors.password && (
					<p className="  text-left text-red-500">
						{errors.password.message}
					</p>
				)}
			</div>

			<Button type='submit' className='w-40  ' >Login</Button>

			<p>- OR -</p>
			<LoginGoogle/>
		</form>
	);
}
