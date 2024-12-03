import { defineField, defineType } from "sanity";

// Define the "startup" document schema for Sanity
export const startup = defineType({
	name: "startup", // Unique identifier for this document type
	title: "Startup", // Human-readable title for the document type
	type: "document",
	fields: [
		defineField({
			name: "title",
			type: "string",
		}),
		defineField({
			name: "slug",
			type: "slug",
			options: {
				source: "title", // Automatically generate slug from the title
			},
		}),
		defineField({
			name: "author",
			type: "reference", // Data type: reference (relates to another document)
			to: { type: "author" }, // Points to documents of type "author"
		}),
		defineField({
			name: "views",
			type: "number",
		}),
		defineField({
			name: "description",
			type: "text",
		}),
		defineField({
			name: "category",
			type: "string",
			validation: (Rule) =>
				Rule.min(1).max(20).required().error("Please enter a category"),
		}),
    defineField({
			name: "image",
			type: "url",
      validation: (Rule) => Rule.required()
		}),
    defineField({
			name: "pitch",
			type: "markdown", // Allows formatted text using Markdown
		}),
	],
});
