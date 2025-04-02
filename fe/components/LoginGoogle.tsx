'use client';
import { googleLogin } from '@/API/auth/action';
import { setSpinner } from '@/lib/features/spinner/spinnerSlice';

import { isErrorResponse } from '@/lib/utils';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

export default function LoginGoogle() {
	const dispatch = useDispatch();

	return (
        <GoogleLogin
			onSuccess={async (credentialResponse) => {
				try {
					const credential = credentialResponse.credential;
					dispatch(setSpinner(true));
					const response = await googleLogin(credential as string);
					if (isErrorResponse(response)) {
						toast.error('Authentication with Google failed', {
							description: 'Try again later',
							style: { backgroundColor: 'red', color: 'white' },
						});
					}
				} catch (error) {}
				dispatch(setSpinner(false));
			}}
			onError={() => {
				toast.error('Authentication with Google failed', {
					description: 'Try again later',
					style: { backgroundColor: 'red', color: 'white' },
				});
			}}
		/>
	);
}
