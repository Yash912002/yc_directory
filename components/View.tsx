import Ping from "./Ping";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import { STARTUPS_VIEWS_QUERY } from "@/sanity/lib/queries";
import { after } from "next/server";

const View = async ({ id }: { id: string }) => {
	// Fetch the total views for a specific startup
	const { views: totalViews } = await client
		.withConfig({ useCdn: false }) // Ensure fresh data by disabling the CDN cache
		.fetch(STARTUPS_VIEWS_QUERY, { id }); // Execute the query using the startup ID

	// Increment and update the number of views
	after(
		// Perform the update operation after some specific action or lifecycle
		async () =>
			await writeClient
				.patch(id) // Select the document to update using its ID
				.set({ views: totalViews + 1 }) // Increment the views count by 1
				.commit() // Commit the changes
	);

	return (
		/* Displays the total views received by the startup */
		<div className="view-container">
			<div className="absolute -top-2 -right-2">
				<Ping />
			</div>

			<p className="view-text">
				<span className="font-black">{totalViews} views</span>
			</p>
		</div>
	);
};

export default View;
