/**
 * GROQ queries.
 *
 * Kept in one file so the shape the app expects from Sanity is auditable in a
 * single place. Every projection lines up with a type in `src/types/content.ts`
 * and is normalised by `src/lib/cms/map.ts`.
 */

const IMAGE = `{
  "assetRef": asset,
  alt,
  credit,
  caption,
  "focalPoint": hotspot
}`;

const SPONSOR = `{
  _id, name, "slug": slug.current, description, website, tier, featured,
  activeFrom, activeUntil,
  "logoColor": logoColor${IMAGE},
  "logoMono": logoMono${IMAGE}
}`;

const AUTHOR = `{
  _id, name, "slug": slug.current, role, bio,
  "image": image${IMAGE},
  social[]{ label, href }
}`;

const VIDEO_SOURCE = `{
  provider, videoId, hash, url, mimeType, startAt, label
}`;

export const ARTICLE_FIELDS = `
  _id, title, "slug": slug.current, kind, dek,
  "hero": hero${IMAGE},
  heroVideo${VIDEO_SOURCE},
  publishedAt, updatedAt,
  "category": category->{ "slug": slug.current, label },
  tags, featured, sponsored, readingTime,
  "accessLevel": coalesce(accessLevel, "free"),
  "author": author->${AUTHOR},
  "sponsor": sponsor->${SPONSOR},
  seo{ title, description, noIndex, canonical, "image": image${IMAGE} }
`;

export const ARTICLE_DETAIL_FIELDS = `
  ${ARTICLE_FIELDS},
  body[]{
    ...,
    _type == "image" => { "image": @${IMAGE} },
    _type == "video" => { title, "source": source${VIDEO_SOURCE}, "poster": poster${IMAGE} }
  },
  "relatedArticleIds": relatedArticles[]->_id,
  "relatedVideoIds": relatedVideos[]->_id
`;

export const VIDEO_FIELDS = `
  _id, title, "slug": slug.current, summary, description,
  "source": source${VIDEO_SOURCE},
  "thumbnail": thumbnail${IMAGE},
  "cover": cover${IMAGE},
  "poster": poster${IMAGE},
  duration, releaseDate, categories, tags, badges,
  credits[]{ role, name }, director, ownership, featured,
  "accessLevel": coalesce(accessLevel, "free"),
  "sponsor": sponsor->${SPONSOR},
  "series": series->{ "slug": slug.current, title } ,
  season, episode,
  captions[]{ "src": file.asset->url, srcLang, label, kind, "default": isDefault },
  seo{ title, description, noIndex, canonical, "image": image${IMAGE} }
`;

/* ── Documents ─────────────────────────────────────────────────────────── */

export const articlesQuery = `
*[_type == "article" && defined(slug.current) && !(_id in path("drafts.**"))]
  | order(publishedAt desc) { ${ARTICLE_FIELDS} }
`;

export const articleBySlugQuery = `
*[_type == "article" && slug.current == $slug && !(_id in path("drafts.**"))][0]
  { ${ARTICLE_DETAIL_FIELDS} }
`;

export const articleSlugsQuery = `
*[_type == "article" && defined(slug.current) && !(_id in path("drafts.**"))].slug.current
`;

export const videosQuery = `
*[_type == "video" && defined(slug.current) && !(_id in path("drafts.**"))]
  | order(releaseDate desc) { ${VIDEO_FIELDS} }
`;

export const videoBySlugQuery = `
*[_type == "video" && slug.current == $slug && !(_id in path("drafts.**"))][0]
  { ${VIDEO_FIELDS} }
`;

export const videoSlugsQuery = `
*[_type == "video" && defined(slug.current) && !(_id in path("drafts.**"))].slug.current
`;

export const showsQuery = `
*[_type == "show" && defined(slug.current) && !(_id in path("drafts.**"))]
  | order(featured desc, title asc) {
    _id, title, "slug": slug.current, description, featured, ownership,
    "cover": cover${IMAGE},
    "poster": poster${IMAGE},
    seasons[]{ number, title, "episodeIds": episodes[]->_id }
  }
`;

export const sponsorsQuery = `
*[_type == "sponsor" && !(_id in path("drafts.**"))]
  | order(featured desc, name asc) ${SPONSOR}
`;

export const promotionsQuery = `
*[_type == "promotion" && active == true && !(_id in path("drafts.**"))]
  | order(_createdAt desc) {
    _id, label, placement, creativeType, headline, body, href,
    startDate, endDate, active,
    "image": image${IMAGE},
    "sponsor": sponsor->${SPONSOR}
  }
`;

/** Site settings are optional — the file config always provides defaults. */
export const siteSettingsQuery = `
*[_type == "siteSettings"][0]{
  name, shortName, description, tagline, editorialTagline,
  contactEmail, editorialEmail, sponsorshipEmail,
  social[]{ label, href, icon },
  seo{ defaultTitle, description, "image": image${IMAGE} },
  adSlots[]{ placement, enabled },
  "featuredSponsorIds": featuredSponsors[]->_id
}
`;
