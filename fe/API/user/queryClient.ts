import { fetcher, isErrorResponse } from "@/lib/utils";

export async function findUser({
	pageParam = 1,
	limit = 10,
	keyword = '',
}: {
	pageParam: number;
	limit: number;
	keyword: string;
}) {
	const searchParams = new URLSearchParams({
		page: pageParam,
		limit,
		keyword,
	} as any);
	const response = await fetcher<{
		data: User[];
		currentPage: number;
		nextPage: number;
	}>(`user?${searchParams.toString()}`, {
		method: 'GET',
		credentials: 'include',
		cache: 'no-cache',
	});
	if (isErrorResponse(response)) {
		return { data: [], currentPage: 1, nextPage: 1 };
	}
	return response;
}