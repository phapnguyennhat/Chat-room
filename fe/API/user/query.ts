import { TIME_CACHE } from "@/common/constant";
import getAuthCookies from "@/lib/getAuthCookie";
import { fetcher, isErrorResponse } from "@/lib/utils";

export const getProfile = async () => {
	const authCookie = await getAuthCookies();
	if (!authCookie) {
		return undefined;
	}

	const profile = await fetcher<User>('user/profile', {
		method: 'GET',
		headers: {
			Cookie: authCookie,
		},
		credentials: 'include',
		next: {
			revalidate: TIME_CACHE,
			tags: ['profile'],
		},
	});
	if (isErrorResponse(profile)) {
		return undefined;
	}
	return profile;
};


export const findUserByEmail = async (email: string) => {
	
}