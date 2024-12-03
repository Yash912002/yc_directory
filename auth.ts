// @ts-nocheck
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { client } from "./sanity/lib/client";
import { writeClient } from "./sanity/lib/write-client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";

// Initialize NextAuth authentication handlers with the GitHub provider
export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [GitHub], // Add GitHub as the authentication provider

	// Define authentication callbacks
	callbacks: {
		async signIn({
			user: { name, email, image }, // User details from GitHub
			profile: { id, login, bio }, // GitHub profile details
		}) {
			// Check if the user already exists in the Sanity database
			const existingUser = await client
				.withConfig({ useCdn: false }) // Disable CDN for fresh data
				.fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id });  // Fetch user by GitHub ID

			// If the user doesn't exist, create a new author document in Sanity
			if (!existingUser) {
				await writeClient.create({
					_type: "author", // Specify the document type in Sanity
					id,
					name,
					username: login,
					email,
					image,
					bio: bio || "",
				});
			}

			// Returns true to allow the sign-in process to complete
			return true;
		},

		// Callback triggered when a JWT (JSON Web Token) is created or updated
		async jwt({ token, account, profile }) {
			// If the account and profile are available, fetch the user from Sanity
			if (account && profile) {
				const user = await client
					.withConfig({ useCdn: false })
					.fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
						id: profile?.id, // Use GitHub ID to fetch the user
					});

				// Assign the user's Sanity _id to the JWT token
				token.id = user?._id;
			}
			// Return the updated token
			return token;
		},

		// Callback triggered when a session is created or updated
		async session({ session, token }) {
			// Add the user ID (from the JWT token) to the session object
			Object.assign(session, { id: token.id });

			// Return the updated session
			return session;
		},
	},
});
