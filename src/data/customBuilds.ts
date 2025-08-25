export type Tag = "Doors" | "Windows" | "Insulation" | "Paint/Branding" | "Power/HVAC" | "Security" | "Ventilation" | "Cut & Frame";

export interface CustomItem {
	id: string;
	title: string;
	caption: string;
	tags: Tag[];
	photo: string;  // path under /public
}

export const CUSTOM_BUILDS: CustomItem[] = [
	{
		id: "rollup-west-bay",
		title: "Roll-Up Door Access",
		caption: "20' unit with roll-up door cut-in for fast site access.",
		tags: ["Doors", "Security", "Cut & Frame"],
		photo: "/photos/container/custom/custom-modification-2.jpg"
	},
	{
		id: "double-rollup",
		title: "Dual Roll-Ups",
		caption: "Dual roll-up configuration for drive-through access.",
		tags: ["Doors", "Security", "Cut & Frame"],
		photo: "/photos/container/custom/custom-modification-3.jpg"
	},
	{
		id: "personnel-door-window",
		title: "Personnel Door + Window",
		caption: "Side personnel door with framed window for light.",
		tags: ["Doors", "Windows", "Cut & Frame"],
		photo: "/photos/container/custom/custom-modification-4.jpg"
	},
	{
		id: "fresh-paint-branding",
		title: "Fresh Paint & Branding",
		caption: "Exterior refinished for clean, branded presentation.",
		tags: ["Paint/Branding", "Security"],
		photo: "/photos/container/custom/custom-modification-5.jpg"
	},
	{
		id: "insulated-office",
		title: "Insulated Interior",
		caption: "Insulated panel interior—ready for finish-out.",
		tags: ["Insulation", "Power/HVAC"],
		photo: "/photos/container/custom/custom-modification-6.jpg"
	},
	{
		id: "vents-lockbox",
		title: "Vents & Lockbox",
		caption: "Security lockbox with added passive ventilation.",
		tags: ["Security", "Ventilation"],
		photo: "/photos/container/custom/custom-modification-7.jpg"
	},
	{
		id: "qc-paint-detail",
		title: "QC + Paint Detail",
		caption: "QA checkpoint and paint touch-ups at the yard.",
		tags: ["Paint/Branding"],
		photo: "/photos/container/custom/custom-modification-8.jpg"
	},
	{
		id: "cutout-framing",
		title: "Cut & Frame Openings",
		caption: "Clean structural framing for doors/windows.",
		tags: ["Cut & Frame", "Doors", "Windows"],
		photo: "/photos/container/custom/custom-modification-10.jpg"
	},
	{
		id: "shop-prep",
		title: "Shop Prep",
		caption: "Shop staging before final install—saves onsite time.",
		tags: ["Cut & Frame"],
		photo: "/photos/container/custom/custom-modification-11.jpg"
	},
	{
		id: "hvac-ready",
		title: "HVAC Ready",
		caption: "HVAC prep for comfort in office conversions.",
		tags: ["Power/HVAC", "Insulation"],
		photo: "/photos/container/custom/custom-modification-15.jpg"
	},
	{
		id: "window-trim",
		title: "Window Trim",
		caption: "Framed window with proper trim and sealing.",
		tags: ["Windows", "Cut & Frame"],
		photo: "/photos/container/custom/custom-modification-16.jpg"
	}
];
