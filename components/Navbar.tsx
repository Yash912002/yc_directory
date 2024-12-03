import Image from "next/image";
import Link from "next/link";
import { auth, signOut, signIn } from "@/auth";
import { BadgePlus, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navbar = async () => {
	// Await the authentication session
	const session = await auth();

	return (
		<header className="px-5 py-3 bg-white shadow-sm font-work-sans">
			<nav className="flex justify-between items-center">
				<Link href="/">
					<Image src="/logo.png" alt="Logo" width={144} height={30} />
				</Link>

				<div className="flex items-center gap-5 text-black">
					{/* If the user session exists, create a startup */}
					{session && session?.user ? (
						<>
							<Link href="/startup/create">
								<span className="max-sm:hidden">Create</span>
								<BadgePlus className="size-6 sm:hidden" />
							</Link>

							{/* Logout form to sign out the user */}
							<form
								action={async () => {
									"use server";
									await signOut({ redirectTo: "/" });
								}}
							>
								<button type="submit">
									<span className="max-sm:hidden">Logout</span>
									<LogOut className="size-6 sm:hidden text-red-500" />
								</button>
							</form>
							
							{/* Link to the user's profile with an avatar */}
							<Link href={`/user/${session?.id}`}>
								<Avatar className="size-10">
									<AvatarImage
										src={session?.user?.image || ""}
										alt={session?.user?.name || ""}
									/>
									<AvatarFallback>Avatar</AvatarFallback>
								</Avatar>
							</Link>
						</>
					) : (
						// Login form to sign in the user
						<form
							action={async () => {
								"use server";
								await signIn("github");
							}}
						>
							<button type="submit">Login</button>
						</form>
					)}
				</div>
			</nav>
		</header>
	);
};

export default Navbar;
