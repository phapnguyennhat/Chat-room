'use server'

import { fetcher, isErrorResponse } from "@/lib/utils";
import { LoginData, RegisterData } from "./schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import getAuthCookies from "@/lib/getAuthCookie";


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



export const register = async (data: RegisterData) => {
	const body = {
		name: data.lastName + ' ' + data.firstName,
		username: data.username,
		password: data.password,
		email: data.email,
	};
	const responseRegister = await fetcher('auth/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});
	if (isErrorResponse(responseRegister)) {
		return responseRegister;
	}

	const responseLogin = await login({
		account: data.username,
		password: data.password,
	});
	if (isErrorResponse(responseLogin)) {
		return responseLogin;
	}
};

export const googleLogin = async (credential: string) => {
	const token = await fetcher<LoginToken>('google-auth', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ idToken: credential }),
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
	redirect('/');
};



export const logout = async () => {
	const authCookie = await getAuthCookies();
	const response = fetch(`${process.env.BACKEND_URL}/auth/logout`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			Cookie: authCookie,
		},
	});
	const cookieStore = await cookies();
	cookieStore.delete('Authentication');
	cookieStore.delete('Refresh');
	redirect('/login');
};




