"use client";

import MDEditor from "@uiw/react-md-editor";
import { z } from "zod";
import { Send } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { formSchema } from "@/lib/validation";
import { createPitch } from "@/lib/actions";
import { useActionState, useState } from "react";
import { FormState } from "sanity";


const StartupForm = () => {
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [pitch, setPitch] = useState("");
	const { toast } = useToast();
	const router = useRouter();

	// Function to handle form submission
	const handleFormSubmit = async (prevState: FormState, formData: FormData) => {
		try {
			// Extract form field values
			const formValues = {
				title: formData.get("title") as string,
				description: formData.get("description") as string,
				category: formData.get("category") as string,
				link: formData.get("link") as string,
				pitch, // Include pitch from state
			};

			// Validate the form values using the schema
			await formSchema.parseAsync(formValues);

			// Call API to create a pitch
			const result = await createPitch(formData, pitch);

			// Changed from === to ==
			//  successful submission
			if (result.status == "SUCCESS") {
				toast({
					title: "Success",
					description: "startup pitch has been created successfully",
				});

				// Navigate to the new startup page
				router.push(`/startup/${result._id}`);
			}

			return result;
		} catch (error) {
			// Handle validation errors
			if (error instanceof z.ZodError) {
				const fieldErrors = error.flatten().fieldErrors;

				// Update errors state
				setErrors(fieldErrors as unknown as Record<string, string>);

				toast({
					title: "Error",
					description: "Please check your inputs and try again",
					variant: "destructive",
				});

				return { ...prevState, error: "Validation failed", status: "ERROR" };
			}

			// Handle unexpected errors
			toast({
				title: "Error",
				description: "Something unexpected has happen",
				variant: "destructive",
			});

			return {
				...prevState,
				error: "Something unexpected has happen",
				status: "ERROR",
			};
		}
	};

	// Hook to manage form state and submission lifecycle
	const [, formAction, isPending] = useActionState(handleFormSubmit, {
		error: "",
		status: "INITIAL",
	});

	// Form to submit a pitch for your current startup
	return (
		<form action={formAction} className="startup-form">
			{/* Startup Title */}
			<div>
				<label htmlFor="title" className="startup-form_label">
					Title
				</label>
				<Input
					id="title"
					name="title"
					className="startup-form_input"
					placeholder="Startup Title"
					required
				/>

				{errors.title && <p className="startup-form_error">{errors.title}</p>}
			</div>

			{/* Description */}
			<div>
				<label htmlFor="description" className="startup-form_label">
					Description
				</label>
				<Textarea
					id="description"
					name="description"
					className="startup-form_textarea"
					placeholder="Startup Description"
					required
				/>

				{errors.description && (
					<p className="startup-form_error">{errors.description}</p>
				)}
			</div>

			{/* Category */}
			<div>
				<label htmlFor="category" className="startup-form_label">
					Category
				</label>
				<Input
					id="category"
					name="category"
					className="startup-form_input"
					placeholder="Startup Category (Tech, health, education)"
					required
				/>

				{errors.category && (
					<p className="startup-form_error">{errors.category}</p>
				)}
			</div>

			{/* Image link of your startup */}
			<div>
				<label htmlFor="link" className="startup-form_label">
					Image URL
				</label>
				<Input
					id="link"
					name="link"
					className="startup-form_input"
					placeholder="Paste a link to your demo or promotional media"
					required
				/>

				{errors.link && <p className="startup-form_error">{errors.link}</p>}
			</div>

			{/* MDEditor ( kinda like textarea ) for Startup Pitch */}
			<div data-color-mode="light">
				<label htmlFor="pitch" className="startup-form_label">
					Pitch
				</label>

				<MDEditor
					value={pitch}
					onChange={(value) => setPitch(value as string)}
					id="pitch"
					preview="edit"
					height={300}
					style={{ borderRadius: 20, overflow: "hidden" }}
					textareaProps={{
						placeholder:
							"Briefly describe your idea and what problem it solves",
					}}
					previewOptions={{
						disallowedElements: ["style"],
					}}
				/>
				{errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
			</div>

			{/* Submit Pitch button */}
			<Button
				type="submit"
				className="startup-form_btn text-white"
				disabled={isPending}
			>
				{isPending ? "Submitting...." : "Submit your pitch"}
				<Send className="size-6 ml-2" />
			</Button>
		</form>
	);
};

export default StartupForm;
