'use server'

import { fetcher, isErrorResponse } from "@/lib/utils";
import { LoginData } from "./schema";
import { cookies } from "next/headers";


export const login = async (data: LoginData) => {
	const token = await fetcher<LoginToken>('auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (isErrorResponse(token)) {
		return token;
	}
	const cookieStore = await cookies();
	cookieStore.set('Authentication', token.accessTokenCookie.token, {
		httpOnly: true,
		path: '/',
		maxAge: token.accessTokenCookie.accessTime,
	});
	cookieStore.set('Refresh', token.refreshTokenCookie.token, {
		httpOnly: true,
		path: '/',
		maxAge: token.refreshTokenCookie.accessTime,
	});
};




