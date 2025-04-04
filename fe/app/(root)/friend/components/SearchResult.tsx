interface IProps {
	searchParams: Promise<QueryUser>;
}

export default async function SearchResult({ searchParams }: IProps) {
	const { keyword='' } = await searchParams;

	return (
		<section>
			<h3 className=' mb-3' >
				{keyword
					? `Search result for ${keyword}`
					: 'Recommended friends'}
			</h3>

		</section>
	);
}
