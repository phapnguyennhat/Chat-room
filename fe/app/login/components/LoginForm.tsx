'use client';

import { login } from '@/API/auth/action';
import { LoginData, loginSchema } from '@/API/auth/schema';
import Button from '@/components/button';
import { Input } from '@/components/ui/input';
import { isErrorResponse } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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

	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async (data: LoginData) => {
		setIsLoading(true);

		const response = await login(data);

		if (isErrorResponse(response)) {
			toast.error('Login failed', {
				description: response.message,
				style: { backgroundColor: 'red', color: 'white' },
			});
		}

		setIsLoading(false);
	};

	return (
		<form
			className=" min-w-[500px] flex flex-col items-center space-y-3 "
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

			<Button isLoading={isLoading}>Login</Button>
		</form>
	);
}
