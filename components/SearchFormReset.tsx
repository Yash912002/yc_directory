"use client";
import { X } from "lucide-react";
import Link from "next/link";

// Clears the query from the search bar and URL
const SearchFormReset = () => {
	const reset = () => {
		// It finds the form with className "search-form" 
		const form = document.querySelector(".search-form") as HTMLFormElement;
		// If form exists, it clears all the form fields
		if (form) form.reset();
	};

	return (
		<button type="reset" onClick={reset} className="search-btn text-white">
      <Link href="/" className="search-btn text-white">
        <X className="size-5" />
      </Link>
		</button>
	);
};

export default SearchFormReset;
