import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupCardType } from "@/components/StartupCard";
import { auth } from "@/auth";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ query?: string }>;
}) {
	// Retrieve the 'query' parameter from the searchParams
	const query = (await searchParams).query;

	// Create a 'params' object with a 'search' property, setting it to 'query' or null if query is undefined
	const params = { search: query || null };

	// Authenticate the user and retrieve their session
	const session = await auth();

	// Fetching the posts of startups from sanity
	const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params });

	return (
		<>
			<section className="pink_container">
				<h1 className="heading">
					Pitch your startup, <br /> Connect with entrepreneurs
				</h1>

				{/*  " ! " is used to override some previous styles */}
				<p className="sub-heading !max-w-3xl">
					Submit Ideas, Vote on pitches, and Get noticed in virtual competitions
				</p>

				<SearchForm query={query} />
			</section>

			<section className="section_container">
				<p className="text-30-semibold">
					{query ? `Search results for ${query}` : "All Startups"}
				</p>

				<ul className="mt-7 card_grid">
					{posts?.length > 0 ? (
						posts.map((post: StartupCardType, index: number) => (
							<StartupCard key={post?._id} post={post} />
						))
					) : (
						<p className="no-results">No Startups Found</p>
					)}
				</ul>
			</section>

			<SanityLive />
		</>
	);
}
