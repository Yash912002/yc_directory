"use server";

import slugify from "slugify";
import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";
import { parseServerActionResponse } from "./utils";

export const createPitch = async (
	state: any, // Current state of the app (used for error/status tracking)
	form: FormData, // Form data containing pitch details
	pitch: string // The pitch text provided by the user
) => {
	// Fetch the authenticated user session
	const session = await auth();

	// If the user is not signed in, return an error response
	if (!session)
		return parseServerActionResponse({
			error: "Not signed in",
			status: "ERROR",
		});

	const { title, description, category, link } = Object.fromEntries(
		Array.from(form).filter(([key]) => key !== "pitch")
	);

	// Generate a slug for the startup title
	const slug = slugify(title as string, { lower: true, strict: true });

	try {
		const startup = {
			title,
			description,
			category,
			image: link,
			slug: {
				_type: slug,
				current: slug, // Slug value for the URL
			},
			author: {
				_type: "reference", // Reference type indicating the author relationship
				_ref: session?.id, // Reference to the authenticated user's ID
			},
			pitch,
		};

		// Save the startup object
		const result = await writeClient.create({ _type: "startup", ...startup });

		// Return a successful response including the saved startup data
		return parseServerActionResponse({
			...result, // Saved startup details
			error: "",
			status: "SUCCESS",
		});
	} catch (error) {
		console.log(error);

		return parseServerActionResponse({
			error: JSON.stringify(error), // Convert the error object to a string
			status: "ERROR",
		});
	}
};
