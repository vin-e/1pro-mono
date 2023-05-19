declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof AnyEntryMap> = AnyEntryMap[C][keyof AnyEntryMap[C]];

	// TODO: Remove this when having this fallback is no longer relevant. 2.3? 3.0? - erika, 2023-04-04
	/**
	 * @deprecated
	 * `astro:content` no longer provide `image()`.
	 *
	 * Please use it through `schema`, like such:
	 * ```ts
	 * import { defineCollection, z } from "astro:content";
	 *
	 * defineCollection({
	 *   schema: ({ image }) =>
	 *     z.object({
	 *       image: image(),
	 *     }),
	 * });
	 * ```
	 */
	export const image: never;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<
				import('astro/zod').AnyZodObject,
				import('astro/zod').AnyZodObject
		  >;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"services": {
"annual-fire-hydrant-testing.mdx": {
	id: "annual-fire-hydrant-testing.mdx";
  slug: "annual-fire-hydrant-testing";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-alarm-installation.mdx": {
	id: "fire-alarm-installation.mdx";
  slug: "fire-alarm-installation";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-alarm-repair.mdx": {
	id: "fire-alarm-repair.mdx";
  slug: "fire-alarm-repair";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-alarm-testing.mdx": {
	id: "fire-alarm-testing.mdx";
  slug: "fire-alarm-testing";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-alarm.mdx": {
	id: "fire-alarm.mdx";
  slug: "fire-alarm";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-extinguisher-annual-certification.mdx": {
	id: "fire-extinguisher-annual-certification.mdx";
  slug: "fire-extinguisher-annual-certification";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-extinguisher-inspection.mdx": {
	id: "fire-extinguisher-inspection.mdx";
  slug: "fire-extinguisher-inspection";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-extinguisher-installation.mdx": {
	id: "fire-extinguisher-installation.mdx";
  slug: "fire-extinguisher-installation";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-extinguisher-recharge.mdx": {
	id: "fire-extinguisher-recharge.mdx";
  slug: "fire-extinguisher-recharge";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-extinguisher-refill.mdx": {
	id: "fire-extinguisher-refill.mdx";
  slug: "fire-extinguisher-refill";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-extinguisher-service.mdx": {
	id: "fire-extinguisher-service.mdx";
  slug: "fire-extinguisher-service";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-extinguisher-six-year-breakdown.mdx": {
	id: "fire-extinguisher-six-year-breakdown.mdx";
  slug: "fire-extinguisher-six-year-breakdown";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-extinguisher-training.mdx": {
	id: "fire-extinguisher-training.mdx";
  slug: "fire-extinguisher-training";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-hydrant-backflow-testing.mdx": {
	id: "fire-hydrant-backflow-testing.mdx";
  slug: "fire-hydrant-backflow-testing";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-hydrant-installations.mdx": {
	id: "fire-hydrant-installations.mdx";
  slug: "fire-hydrant-installations";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-hydrant-maintenance.mdx": {
	id: "fire-hydrant-maintenance.mdx";
  slug: "fire-hydrant-maintenance";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-hydrant-repair.mdx": {
	id: "fire-hydrant-repair.mdx";
  slug: "fire-hydrant-repair";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-hydrant-replacement.mdx": {
	id: "fire-hydrant-replacement.mdx";
  slug: "fire-hydrant-replacement";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-hydrant.mdx": {
	id: "fire-hydrant.mdx";
  slug: "fire-hydrant";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-kitchen-service.mdx": {
	id: "fire-kitchen-service.mdx";
  slug: "fire-kitchen-service";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-sprinkler-design.mdx": {
	id: "fire-sprinkler-design.mdx";
  slug: "fire-sprinkler-design";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-sprinkler-installation.mdx": {
	id: "fire-sprinkler-installation.mdx";
  slug: "fire-sprinkler-installation";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-sprinkler-service.mdx": {
	id: "fire-sprinkler-service.mdx";
  slug: "fire-sprinkler-service";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-sprinkler-test.mdx": {
	id: "fire-sprinkler-test.mdx";
  slug: "fire-sprinkler-test";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fire-system-service.mdx": {
	id: "fire-system-service.mdx";
  slug: "fire-system-service";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"hydrostatic-testing.mdx": {
	id: "hydrostatic-testing.mdx";
  slug: "hydrostatic-testing";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"new-fire-extinguisher.mdx": {
	id: "new-fire-extinguisher.mdx";
  slug: "new-fire-extinguisher";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"refurbished-fire-extinguisher.mdx": {
	id: "refurbished-fire-extinguisher.mdx";
  slug: "refurbished-fire-extinguisher";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"restaurant-sprinkler-inspections.mdx": {
	id: "restaurant-sprinkler-inspections.mdx";
  slug: "restaurant-sprinkler-inspections";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"restaurant-sprinkler-repair.mdx": {
	id: "restaurant-sprinkler-repair.mdx";
  slug: "restaurant-sprinkler-repair";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"restaurant-sprinkler-testing.mdx": {
	id: "restaurant-sprinkler-testing.mdx";
  slug: "restaurant-sprinkler-testing";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"ul-300-compliance.mdx": {
	id: "ul-300-compliance.mdx";
  slug: "ul-300-compliance";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
