import { client } from "@/sanity/lib/client";
import { STARTUPS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import StartupCard, { StartupCardType } from "./StartupCard";

// Startups created by a specific user
const UserStartups = async ({ id }: { id: string }) => {

	// Fetch startups for the given user ID using a client query
	const startups = await client.fetch(STARTUPS_BY_AUTHOR_QUERY, { id });

	return (
		<>
		{/* If there are startups, render a list of StartupCards */}
			{startups.length > 0 ? (
				startups.map((startup: StartupCardType) => (
					<StartupCard key={startup._id} post={startup} />
				))
			) : (
				<p className="no-result">No posts yet</p>
			)}
		</>
	);
};

export default UserStartups;
