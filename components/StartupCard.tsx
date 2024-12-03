import Image from "next/image";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Author, Startup } from "@/sanity/types";
import { Skeleton } from "./ui/skeleton";

// Define a type StartupCardType based on the Startup type
// Exclude the 'author' property from Startup
// Add a new optional 'author' property with type Author
export type StartupCardType = Omit<Startup, "author"> & { author?: Author };

export default function StartupCard({ post }: { post: StartupCardType }) {
	// Destructed the properties from the post object
	const {
		_createdAt,
		views,
		author,
		title,
		category,
		_id,
		image,
		description,
	} = post;

	return (
		<li className="startup-card group">
			<div className="flex-between">
				{/* Date of Creation */}
				<p className="startup_card_date">{formatDate(_createdAt)}</p>

				{/* Total views of the current startup  */}
				<div className="flex gap-1.5">
					<EyeIcon className="size-6 text-primary " />
					<span className="text-16-medium">{views}</span>
				</div>
			</div>

			{/* Author name and title of the startup */}
			<div className="flex-between mt-5 gap-5">
				<div className="flex-1">
					<Link href={`/user/${author?._id}`}>
						<p className="text-16-medium line-clamp-1">{author?.name}</p>
					</Link>

					<Link href={`/startup/${_id}`}>
						<h3 className="text-26-semibold line-clamp-1">{title}</h3>
					</Link>
				</div>

				{/* Author prfile image */}
				<Link href={`/user/${author?._id}`}>
					<Image
						src={author?.image || "/user.png"}
						alt={author?.name || "User"}
						width={48}
						height={48}
						className="rounded-full"
					/>
				</Link>
			</div>

			{/* Description and Image of startup */}
			<Link href={`/startup/${_id}`}>
				<p className="startup-card_desc">{description}</p>
				<img src={image} alt="image" className="startup-card_img" />
			</Link>

			{/* Category and Detail button */}
			<div className="flex-between gap-3 mt-5">
				<Link href={`/?query=${category?.toLowerCase()}`}>
					<p className="text-16-medium">{category}</p>
				</Link>

				<Button className="startup-card_btn" asChild>
					<Link href={`/startup/${_id}`}>Details</Link>
				</Button>
			</div>
		</li>
	);
}

export const StartupCardSkeleton = () => (
	<>
		{[0, 1, 2, 3, 4].map((index: number) => (
			<li key={cn("skeleton", index)}>
				<Skeleton className="startup-card_skeleton" />
			</li>
		))}
	</>
)
