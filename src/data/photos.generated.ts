// GENERATED FILE — do not edit by hand.
// Produced by `node scripts/import-pexels.mjs`.
//
// Curated Pexels photography for seed/demo editorial content. Every photo is
// committed locally (no runtime hotlinking) and published under the Pexels
// license: https://www.pexels.com/license/

export type PexelsPhoto = {
  pexelsId: number;
  /** Source photo page on pexels.com. */
  pageUrl: string;
  photographer: string;
  photographerUrl: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Credit line rendered in editorial figcaptions. */
  credit: string;
  /** CSS object-position for art-directed crops. */
  focalPoint?: string;
  /** Surfaces this photo was curated for. */
  surfaces: string[];
  blurDataURL: string;
  /** Optional committed 2:3 portrait crop for TV key art. */
  poster?: { src: string; width: number; height: number; blurDataURL: string };
};

export const photos = {
  "cloud-sea": {
    pexelsId: 23430553,
    pageUrl:
      "https://www.pexels.com/photo/a-man-ski-touring-up-a-snowy-mountain-above-clouds-23430553/",
    photographer: "Fabienne De Geer",
    photographerUrl: "https://www.pexels.com/@fabienne-de-geer-1148405901/",
    src: "/photos/cloud-sea.jpg",
    width: 1920,
    height: 2560,
    alt: "A lone ski tourer skins up a high snow ridge above a sea of cloud",
    credit: "Photo: Fabienne De Geer · Pexels",
    focalPoint: "70% 40%",
    surfaces: ["home-hero", "feature-hero"],
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAVABADASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAIBBP/EAB0QAQACAgIDAAAAAAAAAAAAAAEAAgMREjEhIkH/xAAXAQADAQAAAAAAAAAAAAAAAAAAAQID/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A7h3K1v7JbFBXwElup69MtmZMZkrxemaV41A6IiMP/9k=",
  },
  skintrack: {
    pexelsId: 6575864,
    pageUrl: "https://www.pexels.com/photo/person-carrying-backpack-while-ski-touring-6575864/",
    photographer: "Alois Lackner",
    photographerUrl: "https://www.pexels.com/@alois-lackner-21432835/",
    src: "/photos/skintrack.jpg",
    width: 1920,
    height: 1280,
    alt: "A ski tourer with a heavy pack breaks trail up an open alpine slope",
    credit: "Photo: Alois Lackner · Pexels",
    surfaces: ["news-hero", "article-hero"],
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAwQF/8QAHxAAAgEEAgMAAAAAAAAAAAAAAQIDAAURIQQSIjFR/8QAFAEBAAAAAAAAAAAAAAAAAAAAA//EABgRAQEAAwAAAAAAAAAAAAAAAAEAAgMS/9oADAMBAAIRAxEAPwAY7ZLKAQNH7TRWpI+WEmPdcZ1W4oAX1U0XkrsdntjNL2sJrxL/2Q==",
  },
  "vast-traverse": {
    pexelsId: 6575875,
    pageUrl: "https://www.pexels.com/photo/a-man-ski-touring-on-snow-covered-mountain-6575875/",
    photographer: "Alois Lackner",
    photographerUrl: "https://www.pexels.com/@alois-lackner-21432835/",
    src: "/photos/vast-traverse.jpg",
    width: 1920,
    height: 1280,
    alt: "A tiny figure crosses a vast, wind-scoured snowfield below dark rock walls",
    credit: "Photo: Alois Lackner · Pexels",
    surfaces: ["feature-hero", "tv-cover"],
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAEF/8QAHhABAAICAQUAAAAAAAAAAAAAAQIDABEEEiExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAC/8QAFhEAAwAAAAAAAAAAAAAAAAAAAAES/9oADAMBAAIRAxEAPwDQr4UJkWFib9OWzg3Vu65RT4mNoidI68YnQnfHTBCP/9k=",
    poster: {
      src: "/photos/vast-traverse-poster.jpg",
      width: 1000,
      height: 1500,
      blurDataURL:
        "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAYABADASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAwACBf/EAB8QAAICAQQDAAAAAAAAAAAAAAECAAMEESIxgRITUf/EABQBAQAAAAAAAAAAAAAAAAAAAAP/xAAXEQEBAQEAAAAAAAAAAAAAAAAAARIT/9oADAMBAAIRAxEAPwBPXkIurYx6MytgPNDjqdhHW1QxBEZUVxtKsIu6LnKGlH8NwAPyJjUChSoPJ1lKGR//2Q==",
    },
  },
  "lift-fog": {
    pexelsId: 7257968,
    pageUrl: "https://www.pexels.com/photo/photo-of-ski-lifts-7257968/",
    photographer: "Anna Shvets",
    photographerUrl: "https://www.pexels.com/@shvetsa/",
    src: "/photos/lift-fog.jpg",
    width: 1400,
    height: 1867,
    alt: "Empty chairlifts climb into thick fog above a groomed piste",
    credit: "Photo: Anna Shvets · Pexels",
    surfaces: ["news-card"],
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAVABADASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAEFAgb/xAAbEAACAgMBAAAAAAAAAAAAAAAAAQIRBCFRA//EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A6VNdGTseMoZFT9ZXytFAqMqKW6GAAf/Z",
  },
  "gondola-forest": {
    pexelsId: 3383871,
    pageUrl: "https://www.pexels.com/photo/black-cable-cars-near-above-trees-in-foggy-day-3383871/",
    photographer: "Elena Todorova",
    photographerUrl: "https://www.pexels.com/@elena-todorova-1810689/",
    src: "/photos/gondola-forest.jpg",
    width: 1400,
    height: 1677,
    alt: "Gondola cabins hang over frosted forest on a flat, foggy day",
    credit: "Photo: Elena Todorova · Pexels",
    surfaces: ["news-card"],
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAATABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAQFBv/EACEQAAEEAQMFAAAAAAAAAAAAAAEAAgMEBSExYRESIzKh/8QAFAEBAAAAAAAAAAAAAAAAAAAAAv/EABcRAQADAAAAAAAAAAAAAAAAAAABEjH/2gAMAwEAAhEDEQA/AHKmWLpAzTyfEZS0YIm9h6E6rL1Z3NnY4HYp/ITvsMHG6VRslU9ZCqJ9COEITjBnX//Z",
  },
  "safety-netting": {
    pexelsId: 36650342,
    pageUrl: "https://www.pexels.com/photo/snowy-mountain-peaks-with-red-safety-netting-36650342/",
    photographer: "Artem Korolev",
    photographerUrl: "https://www.pexels.com/@artem-korolev-2159253660/",
    src: "/photos/safety-netting.jpg",
    width: 1400,
    height: 1867,
    alt: "Red course netting lines a ridge under heavy grey sky",
    credit: "Photo: Artem Korolev · Pexels",
    surfaces: ["news-card", "competition"],
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAVABADASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAMBAgUG/8QAHxAAAgIBBAMAAAAAAAAAAAAAAQIAAxEEITFxEhNh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAWEQEBAQAAAAAAAAAAAAAAAAAAEQH/2gAMAwEAAhEDEQA/AIsFlbYKnaLZ3HKmNuW3BIvyepnXLr/LAOR8MpQjpPWhG6iVbTVsOMdQhEN1/9k=",
  },
  "storm-peak": {
    pexelsId: 20546364,
    pageUrl: "https://www.pexels.com/photo/storm-clouds-over-mountain-peak-20546364/",
    photographer: "Francesco Ungaro",
    photographerUrl: "https://www.pexels.com/@francesco-ungaro/",
    src: "/photos/storm-peak.jpg",
    width: 1920,
    height: 2880,
    alt: "Storm cloud builds over a snowbound summit pyramid",
    credit: "Photo: Francesco Ungaro · Pexels",
    surfaces: ["news-hero", "tv-cover"],
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAYABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAQFAf/EAB4QAAIDAQACAwAAAAAAAAAAAAEDAAIEESFBIjJx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwBBe4AcIgzSo+jMQjOftYn8jF8CTXtexCnDTUD4+DKWfUhGerWM7f3WEJCf/9k=",
    poster: {
      src: "/photos/storm-peak-poster.jpg",
      width: 1000,
      height: 1500,
      blurDataURL:
        "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAYABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAQFAf/EAB8QAAIDAQABBQAAAAAAAAAAAAEDAAIEESEiMkFRcf/EABUBAQEAAAAAAAAAAAAAAAAAAAIB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AQXuAHCIM0qP3MRnQfdYn8jF8CTXtexCnDTUD0+DKWfUlGerWM7f5rCEhP//Z",
    },
  },
  "snowstorm-peak": {
    pexelsId: 9166682,
    pageUrl: "https://www.pexels.com/photo/view-of-a-mountain-peak-at-snowstorm-9166682/",
    photographer: "Vasily Kotlyarov",
    photographerUrl: "https://www.pexels.com/@vasilykot/",
    src: "/photos/snowstorm-peak.jpg",
    width: 1400,
    height: 933,
    alt: "A mountain face disappears into blowing snow mid-storm",
    credit: "Photo: Vasily Kotlyarov · Pexels",
    surfaces: ["news-card", "weather"],
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAgMEBf/EAB4QAAICAAcAAAAAAAAAAAAAAAEDAAIEESExMmFx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCHDqc7gs+mNuh1NDTM9TZTtDsBEm//2Q==",
  },
  lauterbrunnen: {
    pexelsId: 29517030,
    pageUrl:
      "https://www.pexels.com/photo/skiers-descending-alpine-slopes-in-switzerland-29517030/",
    photographer: "Ben Prater",
    photographerUrl: "https://www.pexels.com/@benprater/",
    src: "/photos/lauterbrunnen.jpg",
    width: 1920,
    height: 2560,
    alt: "Skiers descend a broad piste beneath sheer alpine rock faces",
    credit: "Photo: Ben Prater · Pexels",
    surfaces: ["news-hero", "resorts"],
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAVABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAEDBv/EAB0QAQACAgMBAQAAAAAAAAAAAAEAAgMREjFBIXH/xAAWAQEBAQAAAAAAAAAAAAAAAAABAgP/xAAVEQEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEQMRAD8A1BQH9ksttCHcnZtbPXJZ+B1EYwbPJeT7NYgt7YxeevNQhEP/2Q==",
  },
  "frosted-lift": {
    pexelsId: 15650885,
    pageUrl: "https://www.pexels.com/photo/abandoned-frosted-ski-lift-at-dusk-15650885/",
    photographer: "Kermo",
    photographerUrl: "https://www.pexels.com/@kermo-462547913/",
    src: "/photos/frosted-lift.jpg",
    width: 1920,
    height: 1280,
    alt: "A rime-crusted chairlift stands silent against a violet dusk",
    credit: "Photo: Kermo · Pexels",
    surfaces: ["tv-cover", "news-card"],
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAEF/8QAHBAAAgIDAQEAAAAAAAAAAAAAAREAAgMEEhMx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDMx7Xtj6SLlFrm3LrD69Kv5EgDpKKH/9k=",
    poster: {
      src: "/photos/frosted-lift-poster.jpg",
      width: 1000,
      height: 1500,
      blurDataURL:
        "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAYABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAIDBP/EABwQAAICAgMAAAAAAAAAAAAAAAECABEDEgQTIf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AMHctRTlWSyYURgA5NyycVGAJeVhNkBYFwfI2m1UxqEIH//Z",
    },
  },
  "chamonix-traverse": {
    pexelsId: 27301778,
    pageUrl:
      "https://www.pexels.com/photo/a-black-and-white-photo-of-people-skiing-down-a-snowy-mountain-27301778/",
    photographer: "Phil Evenden",
    photographerUrl: "https://www.pexels.com/@philevenphotos/",
    src: "/photos/chamonix-traverse.jpg",
    width: 1920,
    height: 1280,
    alt: "A rope team traverses a glaciated shoulder in high mountain light",
    credit: "Photo: Phil Evenden · Pexels",
    surfaces: ["feature-hero", "tv-cover"],
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQMG/8QAHhAAAgEEAwEAAAAAAAAAAAAAAQIAAwQRIgUSYVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AvataFh2c59jFIIqaAY8mWpDaMcU7EFSxI+QP/9k=",
  },
  "storm-team": {
    pexelsId: 30180378,
    pageUrl:
      "https://www.pexels.com/photo/snowy-adventure-group-skiing-in-harsh-winter-conditions-30180378/",
    photographer: "Christopher Simmons-Solomon",
    photographerUrl: "https://www.pexels.com/@christopher-simmons-solomon-2147656530/",
    src: "/photos/storm-team.jpg",
    width: 1920,
    height: 2400,
    alt: "A ski team leans into wind and spindrift on an exposed ridge",
    credit: "Photo: Christopher Simmons-Solomon · Pexels",
    surfaces: ["feature-hero", "safety"],
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAUABADASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAEDBAX/xAAaEAACAwEBAAAAAAAAAAAAAAAAAQIDERJR/8QAFgEBAQEAAAAAAAAAAAAAAAAAAgAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A0sFhFZG9TbjJZ4FTtdzU84wYLIsACa//2Q==",
  },
  "frosty-branches": {
    pexelsId: 1928073,
    pageUrl: "https://www.pexels.com/photo/people-walking-on-snow-1928073/",
    photographer: "Matt Hardy",
    photographerUrl: "https://www.pexels.com/@matthardy/",
    src: "/photos/frosty-branches.jpg",
    width: 1400,
    height: 1050,
    alt: "Skiers cross a snowfield framed by frost-covered branches",
    credit: "Photo: Matt Hardy · Pexels",
    surfaces: ["blog-card", "culture"],
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAMABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQQG/8QAHBABAAICAwEAAAAAAAAAAAAAAQIRAAMEBlFx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwBHTxZQ5ZrkChY5B2XROLq2zRtr5mlIl3RfuA9ra0Qyj//Z",
  },
  "stone-hut": {
    pexelsId: 15548903,
    pageUrl: "https://www.pexels.com/photo/shack-out-of-rocks-in-snow-15548903/",
    photographer: "Tom Forrest",
    photographerUrl: "https://www.pexels.com/@tom-forrest-34163540/",
    src: "/photos/stone-hut.jpg",
    width: 1400,
    height: 933,
    alt: "A dry-stone hut holds its ground on a wind-blown slope in Tignes",
    credit: "Photo: Tom Forrest · Pexels",
    surfaces: ["blog-card", "huts"],
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAIDBf/EABwQAQACAgMBAAAAAAAAAAAAAAEAAwIRBCFRMf/EABUBAQEAAAAAAAAAAAAAAAAAAAAC/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A1XkjaV5jr3XUs1V5kZxN/IAeSh//2Q==",
  },
  "remote-hut": {
    pexelsId: 31434499,
    pageUrl: "https://www.pexels.com/photo/snow-covered-mountain-landscape-with-hut-31434499/",
    photographer: "Anton Massalov",
    photographerUrl: "https://www.pexels.com/@antonhansenphotography/",
    src: "/photos/remote-hut.jpg",
    width: 1920,
    height: 1280,
    alt: "A solitary winter hut below a long, unbroken snow ridge",
    credit: "Photo: Anton Massalov · Pexels",
    surfaces: ["blog-card", "tv-cover"],
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAAF/8QAHhAAAgICAgMAAAAAAAAAAAAAAQIAAwQREhMhJFH/xAAUAQEAAAAAAAAAAAAAAAAAAAAC/8QAFREBAQAAAAAAAAAAAAAAAAAAABL/2gAMAwEAAhEDEQA/AK4UohYuIX13Xl2Ab+zUsxqSujWCIM4lAbxUsdBL/9k=",
    poster: {
      src: "/photos/remote-hut-poster.jpg",
      width: 1000,
      height: 1500,
      blurDataURL:
        "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAYABADASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAMCBP/EABwQAAIDAAMBAAAAAAAAAAAAAAEDAAIRBAUSUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMC/8QAFREBAQAAAAAAAAAAAAAAAAAAABH/2gAMAwEAAhEDEQA/ABVMWTO30rN9CSe5Sq6CLExKKJjgsqvBYb9MizrLkEi+kxEikj//2Q==",
    },
  },
  "vintage-skis": {
    pexelsId: 8960887,
    pageUrl:
      "https://www.pexels.com/photo/vintage-wooden-skies-leaning-against-wooden-wall-8960887/",
    photographer: "Anna Alexes",
    photographerUrl: "https://www.pexels.com/@anna-alexes-18139455/",
    src: "/photos/vintage-skis.jpg",
    width: 1400,
    height: 2100,
    alt: "Vintage wooden skis with cable bindings lean against weathered timber",
    credit: "Photo: Anna Alexes · Pexels",
    surfaces: ["blog-card", "gear"],
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAYABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQAG/8QAIhAAAQQBAwUBAAAAAAAAAAAAAQACBBEDBRMhEhUiMUFC/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAYEQEBAQEBAAAAAAAAAAAAAAABAEEiMf/aAAwDAQACEQMRAD8ACm4wzbr9UnoOBr9MxdQ5DyEPNt8ePkr0aK0ENp7WPhDrU05qHsG6Q1kN2EAeDr5SmnSNzSspvkFSknYmX//Z",
  },
  "skis-topdown": {
    pexelsId: 6113888,
    pageUrl: "https://www.pexels.com/photo/skis-on-the-snow-6113888/",
    photographer: "Lukas Schulz",
    photographerUrl: "https://www.pexels.com/@lukas-schulz-9753871/",
    src: "/photos/skis-topdown.jpg",
    width: 1400,
    height: 928,
    alt: "Fresh snow settles across a pair of skis seen from above",
    credit: "Photo: Lukas Schulz · Pexels",
    surfaces: ["blog-card", "gear"],
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAMF/8QAHBABAAICAwEAAAAAAAAAAAAAAQIDABEEBTFB/8QAFAEBAAAAAAAAAAAAAAAAAAAAAv/EABcRAAMBAAAAAAAAAAAAAAAAAAARIUH/2gAMAwEAAhEDEQA/ANd5FhfVAQg+5UhsSTs3g+xAga+OLqAprDzWF1B0/9k=",
  },
  "aerial-carve": {
    pexelsId: 5923340,
    pageUrl: "https://www.pexels.com/photo/a-person-skiing-on-snow-covered-mountain-5923340/",
    photographer: "Volker Meyer",
    photographerUrl: "https://www.pexels.com/@vome/",
    src: "/photos/aerial-carve.jpg",
    width: 1920,
    height: 1280,
    alt: "Seen from above, a skier draws a single arc across untouched snow",
    credit: "Photo: Volker Meyer · Pexels",
    surfaces: ["tv-cover", "home-hero-alt"],
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAEG/8QAGhABAAMBAQEAAAAAAAAAAAAAAQACAyERMf/EABQBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDROTm+ktsqb5pYi0E7D6gfORD/2Q==",
    poster: {
      src: "/photos/aerial-carve-poster.jpg",
      width: 1000,
      height: 1500,
      blurDataURL:
        "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAYABADASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAIDBAX/xAAaEAADAAMBAAAAAAAAAAAAAAAAAQIDESEx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAQD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDvy9dLJK0Io0/BcbqKab4Ia3BN4ugBF//Z",
    },
  },
  "powder-turn": {
    pexelsId: 36583064,
    pageUrl: "https://www.pexels.com/photo/skier-gliding-down-snowy-mountain-slope-36583064/",
    photographer: "Volker Meyer",
    photographerUrl: "https://www.pexels.com/@vome/",
    src: "/photos/powder-turn.jpg",
    width: 1920,
    height: 1280,
    alt: "A skier trails powder off a wide, sunlit face",
    credit: "Photo: Volker Meyer · Pexels",
    surfaces: ["tv-cover"],
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAQIDBv/EABYQAQEBAAAAAAAAAAAAAAAAAAABMf/EABQBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDV2EVC4Q//2Q==",
  },
  "action-turn": {
    pexelsId: 35712874,
    pageUrl: "https://www.pexels.com/photo/skier-descending-snowy-slope-in-trondelag-35712874/",
    photographer: "Lars Bugge Aarset",
    photographerUrl: "https://www.pexels.com/@lars-bugge-aarset-133603784/",
    src: "/photos/action-turn.jpg",
    width: 1400,
    height: 933,
    alt: "A skier drives through a hard turn, snow sheeting off the tails",
    credit: "Photo: Lars Bugge Aarset · Pexels",
    surfaces: ["tv-card", "competition"],
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAwEC/8QAHBAAAgMAAwEAAAAAAAAAAAAAAQMAAhEEBSFR/8QAFAEBAAAAAAAAAAAAAAAAAAAAAv/EABYRAQEBAAAAAAAAAAAAAAAAAAERAP/aAAwDAQACEQMRAD8ARYeimqAvX5sG/bMXoYogiTisuLYLHJjl+sO+xxWOFApv/9k=",
  },
  "sunrise-ascent": {
    pexelsId: 35022331,
    pageUrl: "https://www.pexels.com/photo/solo-skiing-adventure-at-sunrise-35022331/",
    photographer: "Enrico Musitelli",
    photographerUrl: "https://www.pexels.com/@enrico-musitelli-1035698384/",
    src: "/photos/sunrise-ascent.jpg",
    width: 1920,
    height: 1200,
    alt: "A skier ascends a snow crest into first light",
    credit: "Photo: Enrico Musitelli · Pexels",
    surfaces: ["tv-cover"],
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAKABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAQT/xAAgEAABAwIHAAAAAAAAAAAAAAACAAEDBBEFEhQhMTNh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAQP/xAAYEQEBAAMAAAAAAAAAAAAAAAABAAIDIf/aAAwDAQACEQMRAD8AY9RHZ4zJreqmHF6sXIS3yqcXe3KIe10OVU1g8v/Z",
    poster: {
      src: "/photos/sunrise-ascent-poster.jpg",
      width: 1000,
      height: 1500,
      blurDataURL:
        "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAYABADASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAQBAwUG/8QAIhAAAgIABgIDAAAAAAAAAAAAAQIAAwQFERIhMRNBMlFh/8QAFwEAAwEAAAAAAAAAAAAAAAAAAAECA//EABcRAQEBAQAAAAAAAAAAAAAAAAEAURH/2gAMAwEAAhEDEQA/ANivOUYrxoPcaTNcOx0Dczj8St1a+RTtA9fcZrctWrMOx3BMmOlZiyttWzb2edJOG2BSlh4HxP5CEhtx63//2Q==",
    },
  },
} as const satisfies Record<string, PexelsPhoto>;

export type PhotoKey = keyof typeof photos;
