import { author } from "./authors";
import { photo } from "./media";
import { a, b, body, divider, embed, figure, h, i, list, p, quote, t } from "./rich-text";
import { sponsor } from "./sponsors";
import type { Article } from "@/types/content";

/**
 * Development seed data — realistic ski-media copy, no lorem ipsum.
 *
 * Everything here is invented: the resorts, the studies, the quotes and the
 * people. It exists so the site can be designed, reviewed and demoed before a
 * CMS is connected. Once `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, the CMS takes
 * over and this file is no longer read. See docs/CMS.md.
 */

const cat = {
  snow: { slug: "snow-report", label: "Snow report" },
  resorts: { slug: "resorts", label: "Resorts" },
  competition: { slug: "competition", label: "Competition" },
  safety: { slug: "safety", label: "Safety" },
  environment: { slug: "environment", label: "Environment" },
  industry: { slug: "industry", label: "Industry" },
  culture: { slug: "culture", label: "Culture" },
  opinion: { slug: "opinion", label: "Opinion" },
  gear: { slug: "gear", label: "Gear" },
  travel: { slug: "travel", label: "Travel" },
  technique: { slug: "technique", label: "Technique" },
} as const;

export const articles: Article[] = [
  /* ── Lead feature ─────────────────────────────────────────────────────── */
  {
    _id: "article-the-last-cold-aspect",
    title: "The last cold aspect",
    slug: "the-last-cold-aspect",
    kind: "feature",
    dek: "A north-facing couloir above Tarnvik has held snow every year since records began. This season it went bare in April. What that means for the people who ski it — and for the forecasters who read it.",
    hero: photo("cloud-sea", {
      caption: "Above the inversion on the Tarnvik divide, early season.",
    }),
    body: body(
      p(
        "The couloir has no official name. On the regional avalanche bulletin it is a line of six characters — TVK-N4 — and for thirty-one consecutive winters it has been the reference aspect for the whole Tarnvik basin. If TVK-N4 was holding, the forecasters wrote, the basin was holding.",
      ),
      p(
        "On the eleventh of April, a patroller skinning the ridge above it photographed bare rock from the apron to the choke. The photograph went out on the bulletin the same evening with two sentences of comment and no adjectives. It has since been reproduced in four national newspapers, none of which used it to talk about skiing.",
      ),
      quote(
        "We do not have a category on the form for 'the reference slope is gone'. I wrote it in the free-text box.",
        "Regional forecaster, Tarnvik basin",
      ),
      h("Reading a mountain by one slope"),
      p([
        t(
          "Reference aspects are a working shortcut, not a scientific instrument. A forecaster picks a slope that is ",
        ),
        i("representative"),
        t(
          " — steep enough to slide, sheltered enough to preserve a record, visible enough to check from a road — and then reads the whole range through it. It is a habit built out of scarcity: there has never been enough staff to pit every aspect every week.",
        ),
      ]),
      p(
        "The habit works until the reference stops being representative. Three of the eight forecasters we spoke to for this piece said they had already quietly stopped weighting TVK-N4 as heavily as the manual suggests. None had written that down.",
      ),
      figure(
        photo("chamonix-traverse", {
          caption: "A guided party crosses the basin's glaciated shoulder in March.",
        }),
      ),
      embed(
        { provider: "youtube", videoId: "aqz-KE-bpKQ" },
        "How a weak layer forms and persists — snowpack explainer",
        photo("skintrack", { alt: "Poster frame for the snowpack explainer" }),
      ),
      h("What the guides changed first"),
      p(
        "Guides moved before the bulletins did. The two operators working the basin commercially both rewrote their spring programmes across the last four seasons — not dramatically, and not with any announcement, but the pattern is unambiguous once you line up the itineraries.",
      ),
      list("bullet", [
        "Spring descents moved roughly eleven days earlier across four seasons.",
        "Two classic April objectives were dropped from the published programme entirely.",
        "A north-east variant, historically considered a consolation line, is now the default.",
        "Client briefings added a written note about early-season rock cover.",
      ]),
      p([
        t(
          "None of this is presented to clients as an adaptation to a warming snowpack. It is presented, ",
        ),
        b("accurately"),
        t(
          ", as conditions-led programming. But the direction of the drift is one way, and everyone involved knows what it is.",
        ),
      ]),
      divider(),
      h("The forecasting problem is a staffing problem"),
      p(
        "There is a version of this story where the fix is technical: more automated stations, more remote sensing, a denser observation network that does not depend on a single slope. That version exists, and it is being built, slowly, in most of the ranges we cover.",
      ),
      p([
        t(
          "It is also expensive in exactly the way that public avalanche forecasting has never been funded to be. We put the cost question to three regional services; the fullest answer is in our ",
        ),
        a("interview with the Tarnvik service", "/articles/tarnvik-forecast-service-interview"),
        t(
          ", but the short version is that instrumentation budgets have been flat for a decade while the terrain being forecast has become less legible.",
        ),
      ]),
      quote(
        "The mountain didn't get harder to read. We got fewer people reading it, and the handwriting changed.",
      ),
      h("What happens to the line"),
      p(
        "TVK-N4 will fill in again. Almost certainly this coming winter, and probably to something close to its historic depth — the point of a reference aspect was never that it was immune, only that it was reliable. Reliability is what has actually been lost.",
      ),
      p(
        "For the people who ski it, that is a scheduling problem and a small grief. For the people who forecast around it, it is the removal of a thirty-one-year baseline in a discipline that runs almost entirely on baselines.",
      ),
    ),
    author: author("mera-lindqvist"),
    publishedAt: "2026-07-28T06:00:00.000Z",
    updatedAt: "2026-07-29T09:15:00.000Z",
    category: cat.environment,
    tags: ["snowpack", "avalanche forecasting", "climate", "tarnvik"],
    featured: true,
    sponsored: false,
    accessLevel: "free",
    relatedArticleIds: [
      "article-transceiver-recall",
      "article-glacier-water-rights",
      "article-forecast-service-interview",
    ],
    relatedVideoIds: ["video-cold-aspect-film", "video-snowpack-explained"],
    seo: {
      description:
        "A north-facing couloir held snow for thirty-one winters and then didn't. What losing a reference aspect does to avalanche forecasting.",
    },
  },

  /* ── News ─────────────────────────────────────────────────────────────── */
  {
    _id: "article-transceiver-recall",
    title: "Corniche Labs recalls two transceiver batches over antenna fault",
    slug: "corniche-labs-transceiver-recall",
    kind: "news",
    dek: "Roughly 4,000 units are affected. The manufacturer says the fault reduces secondary-antenna range in cold conditions and is offering free replacement.",
    hero: photo("storm-team"),
    body: body(
      p(
        "Corniche Labs has issued a voluntary recall covering two production batches of its mid-range avalanche transceiver, citing a soldering fault on the secondary antenna that can reduce effective search range below −12°C.",
      ),
      p(
        "The company said roughly 4,000 units are affected, all manufactured within a six-week window last autumn, and that no field incidents have been attributed to the fault. Owners can check their serial number against the published range and request a free replacement.",
      ),
      list("bullet", [
        "Affected serials begin CL-24A and CL-24B.",
        "Search range in the affected units degrades progressively below −12°C.",
        "Replacement units ship within 10 working days; the recall has no end date.",
        "The primary antenna and transmit function are unaffected.",
      ]),
      p(
        "Two national mountain-rescue bodies have advised members to verify serials before autumn training rather than waiting for the season. We have asked whether either intends to audit its own inventory and will update this story.",
      ),
    ),
    author: author("tobias-renner"),
    publishedAt: "2026-07-29T14:20:00.000Z",
    category: cat.safety,
    tags: ["avalanche safety", "recall", "transceivers", "gear"],
    featured: true,
    sponsored: false,
    accessLevel: "free",
    relatedArticleIds: ["article-beacon-test-protocol", "article-the-last-cold-aspect"],
    relatedVideoIds: ["video-companion-rescue"],
  },
  {
    _id: "article-southern-season-report",
    title: "Southern season: a metre in four days ends a slow start",
    slug: "southern-season-metre-in-four-days",
    kind: "news",
    dek: "After the driest June in a decade across the southern ranges, a stalled low has delivered the season's first sustained cold cycle.",
    hero: photo("storm-peak"),
    body: body(
      p(
        "Four consecutive days of orographic snowfall have reset a southern season that, until last week, looked like it might not properly begin. Upper-mountain totals across the main range are between 95 and 130 centimetres, with the deepest accumulations on south and south-east aspects above 1,600 metres.",
      ),
      p(
        "The cycle arrived on a stalled low that parked west of the divide and fed cold, moist air across the ranges for the better part of a hundred hours — an unusually long window, and the reason totals are being described in metres rather than centimetres.",
      ),
      quote(
        "We went from thirty per cent terrain open to full mountain in five days. I have not seen that flip that fast.",
        "Operations manager, southern main range",
      ),
      p(
        "Forecasters have flagged the obvious caveat: a metre landing on a thin, faceted early-season base is a loading problem before it is a powder day. Regional bulletins moved to considerable on all aspects above treeline within 24 hours of the cycle ending.",
      ),
    ),
    author: author("newsroom"),
    publishedAt: "2026-07-27T08:00:00.000Z",
    category: cat.snow,
    tags: ["snow report", "southern hemisphere", "storm cycle"],
    featured: false,
    sponsored: false,
    accessLevel: "free",
    relatedVideoIds: ["video-storm-cycle-edit"],
  },
  {
    _id: "article-lift-replacement-vote",
    title: "Valley votes down gondola replacement for a third time",
    slug: "valley-votes-down-gondola-replacement",
    kind: "news",
    dek: "The margin narrowed to 91 votes. The operator says the existing lift has four seasons left; opponents say the plan was always about property, not skiing.",
    hero: photo("gondola-forest"),
    body: body(
      p(
        "Residents have rejected a proposed gondola replacement for the third time in seven years, this time by 91 votes out of just over 4,300 cast — the narrowest margin the project has faced.",
      ),
      p(
        "The lift company has said publicly that the existing installation has four seasons of certified life remaining and that no alternative capacity plan exists. Opponents have consistently argued the replacement is inseparable from the associated development approvals, which would add 340 beds to a valley with a housing waiting list.",
      ),
      p(
        "Both sides have signalled a fourth attempt. The question that has not been answered in three campaigns is what happens to the winter economy if the lift reaches its certification limit before anything replaces it.",
      ),
    ),
    author: author("newsroom"),
    publishedAt: "2026-07-26T16:45:00.000Z",
    category: cat.resorts,
    tags: ["resorts", "infrastructure", "planning"],
    featured: false,
    sponsored: false,
    accessLevel: "free",
  },
  {
    _id: "article-fwt-qualifier-format",
    title: "Freeride qualifier series drops its two-run format",
    slug: "freeride-qualifier-drops-two-run-format",
    kind: "news",
    dek: "Organisers cite weather windows and athlete safety. Riders are split on whether a single run rewards the right kind of skiing.",
    hero: photo("action-turn"),
    body: body(
      p(
        "The qualifier series will move to a single scored run from the coming season, ending a two-run format that has been in place since 2019. Organisers say the change is driven by shrinking weather windows and by the cumulative risk of asking athletes to commit twice on degrading snow.",
      ),
      p(
        "The reaction from riders has been genuinely split. Those who favour a technical, high-consequence line read the change as a reward for judgement. Those who build runs around a single trick feature argue it removes the margin that made progression possible.",
      ),
      quote(
        "One run means you ski the line you can actually ski. I think that's honest. I also think it's going to be less fun to watch.",
        "Qualifier competitor, speaking on condition of anonymity",
      ),
      p(
        "Judging criteria are unchanged. Organisers have confirmed the scoring weights will be reviewed after one season under the new format.",
      ),
    ),
    author: author("mera-lindqvist"),
    publishedAt: "2026-07-25T11:30:00.000Z",
    category: cat.competition,
    tags: ["freeride", "competition", "rules"],
    featured: false,
    sponsored: false,
    accessLevel: "free",
    relatedVideoIds: ["video-qualifier-highlights"],
  },
  {
    _id: "article-glacier-water-rights",
    title: "Snowmaking licence dispute reaches the water court",
    slug: "snowmaking-licence-water-court",
    kind: "news",
    dek: "Three resorts and two downstream municipalities are arguing over an abstraction limit written in 1974, before any of them made snow.",
    hero: photo("lift-fog"),
    body: body(
      p(
        "A dispute over winter water abstraction has moved to the regional water court, with three resort operators and two downstream municipalities contesting an interpretation of a licence drafted half a century ago.",
      ),
      p(
        "The 1974 licence sets a seasonal abstraction ceiling but predates industrial snowmaking entirely; it does not distinguish between water withdrawn and water returned to the catchment as snow that later melts into it. Resorts argue that most of what they take comes back. Municipalities argue it comes back late, and in the wrong place.",
      ),
      p(
        "The court is not expected to rule before the season starts. Whatever it decides will be read closely by every operator working under a similarly-aged licence, which is most of them.",
      ),
    ),
    author: author("ines-cabrera"),
    publishedAt: "2026-07-24T09:10:00.000Z",
    category: cat.environment,
    tags: ["water", "snowmaking", "policy", "environment"],
    featured: false,
    sponsored: false,
    accessLevel: "free",
    relatedArticleIds: ["article-the-last-cold-aspect"],
  },
  {
    _id: "article-forecast-service-interview",
    title: "“We are forecasting a mountain we can no longer afford to measure”",
    slug: "tarnvik-forecast-service-interview",
    kind: "news",
    dek: "The head of the Tarnvik avalanche service on flat budgets, thinning observation networks and why the bulletin has quietly got more cautious.",
    hero: photo("snowstorm-peak"),
    body: body(
      p(
        "The Tarnvik service covers 900 square kilometres with four full-time forecasters and a network of eleven automated stations, three of which have been out of service since spring. Its head agreed to a long interview on the condition that we publish the budget figures in full.",
      ),
      h("On the observation network"),
      p(
        "“Eleven stations sounds like a lot until you put them on a map. Two of them are within four kilometres of each other because that is where the access road goes. We are not instrumenting the terrain; we are instrumenting the terrain we can reach in a morning.”",
      ),
      h("On caution"),
      p(
        "“If you compare our bulletins from ten years ago to now, we use the higher of two adjacent danger levels more often. That is not because the snowpack is more dangerous. It is because we have less information, and the honest response to less information is more margin.”",
      ),
      h("On what would actually help"),
      p(
        "“Field observers. Not sensors. A person who skis a slope and writes down what they found is worth four stations, and costs less than one.”",
      ),
    ),
    author: author("tobias-renner"),
    publishedAt: "2026-07-22T07:00:00.000Z",
    category: cat.safety,
    tags: ["avalanche forecasting", "interview", "funding"],
    featured: false,
    sponsored: false,
    accessLevel: "free",
    relatedArticleIds: ["article-the-last-cold-aspect"],
  },
  {
    _id: "article-heli-permit-decision",
    title: "Heli-ski permit cap held at 2019 levels for a fifth year",
    slug: "heli-ski-permit-cap-held",
    kind: "news",
    dek: "Operators wanted a 15 per cent increase. The land agency declined without setting out a review date.",
    hero: photo("aerial-carve"),
    body: body(
      p(
        "The regional land agency has declined to raise the heli-ski permit cap for a fifth consecutive year, rejecting an industry submission that sought a 15 per cent increase in permitted landings.",
      ),
      p(
        "The decision notice runs to two pages and does not commit to a review date, which operators have described as the more significant problem. Without a scheduled review, capital planning for aircraft and guide staffing has no horizon to work against.",
      ),
    ),
    author: author("newsroom"),
    publishedAt: "2026-07-21T13:00:00.000Z",
    category: cat.industry,
    tags: ["heli-skiing", "permits", "policy"],
    featured: false,
    sponsored: false,
    accessLevel: "free",
  },
  {
    _id: "article-beacon-test-protocol",
    title: "New beacon-check protocol adopted by four national schools",
    slug: "beacon-check-protocol-adopted",
    kind: "news",
    dek: "The revised trailhead check adds a transmit-range step and drops a habit that instructors have quietly considered useless for years.",
    hero: photo("skintrack"),
    body: body(
      p(
        "Four national ski-instruction bodies have adopted a revised trailhead transceiver check that adds an explicit transmit-range verification and removes the group-wide receive sweep that has been standard practice for two decades.",
      ),
      p(
        "The change follows a working-group review that found the receive sweep produced a high rate of false confidence: it confirms that a device receives, which is rarely the failure mode, and does not confirm useful transmit range, which is.",
      ),
      list("number", [
        "Leader switches to receive; each member passes at 1 metre.",
        "Leader verifies transmit range at 5 metres for each device, one at a time.",
        "Leader's own device is checked by a nominated second.",
        "Group confirms all devices are in transmit before departure.",
      ]),
      p(
        "Instructors we spoke to were near-unanimously in favour, with several noting they had been teaching a version of this informally for years.",
      ),
    ),
    author: author("tobias-renner"),
    publishedAt: "2026-07-20T10:00:00.000Z",
    category: cat.safety,
    tags: ["avalanche safety", "instruction", "transceivers"],
    featured: false,
    sponsored: false,
    accessLevel: "free",
    relatedVideoIds: ["video-companion-rescue"],
  },
  {
    _id: "article-hut-network-funding",
    title: "Alpine hut network wins five-year maintenance settlement",
    slug: "alpine-hut-network-settlement",
    kind: "news",
    dek: "Eighty-one huts, one funding line, and the first multi-year commitment since 2011.",
    hero: photo("stone-hut"),
    body: body(
      p(
        "The federation that maintains 81 high-alpine huts has secured a five-year maintenance settlement, ending a decade of annual funding rounds that made structural work almost impossible to schedule.",
      ),
      p(
        "Roughly a third of the network is over eighty years old. The federation has said the first two years will be spent on water and waste systems rather than anything guests will notice.",
      ),
    ),
    author: author("newsroom"),
    publishedAt: "2026-07-18T09:30:00.000Z",
    category: cat.industry,
    tags: ["huts", "funding", "backcountry"],
    featured: false,
    sponsored: false,
    accessLevel: "free",
  },

  /* ── Blog / opinion / culture ─────────────────────────────────────────── */
  {
    _id: "article-against-the-powder-day",
    title: "Against the powder day",
    slug: "against-the-powder-day",
    kind: "opinion",
    dek: "Skiing's defining unit of value is a single morning. That is a strange thing to build a culture — and an industry — around.",
    hero: photo("powder-turn"),
    body: body(
      p(
        "The powder day is skiing's reserve currency. Films are cut around it, marketing budgets are timed to it, and an enormous amount of individual life planning is organised in service of being in the right valley on the right morning.",
      ),
      p(
        "It is also, as a unit of experience, unusually poorly matched to how most people actually ski. The average committed skier in our audience gets perhaps four genuine powder mornings a season. The other fifty-odd days are wind board, spring corn, refrozen crud and the flat grey light that no one photographs.",
      ),
      quote("We built the entire aesthetic of the sport around four per cent of the days."),
      h("What the other days teach"),
      p([
        t("There is a real argument that the non-powder day is where skiing is actually "),
        i("learned"),
        t(
          ". Variable snow demands a range of technique that a metre of cold smoke actively hides. Anyone can ski powder badly and enjoy it. Very few people ski breakable crust badly and enjoy anything.",
        ),
      ]),
      p(
        "This is not a call for asceticism. Powder is wonderful, and the pursuit of it has produced most of what is good about ski culture, including the tolerance for early alarms and long drives that makes the rest of it possible.",
      ),
      h("The cost of a single metric"),
      p(
        "But a culture with one dominant metric distorts. It pushes people into avalanche terrain on the days the terrain is least stable. It concentrates traffic. And it quietly tells a large majority of skiers that the day they actually had was the consolation version.",
      ),
      p(
        "The most interesting skiers we film are, almost without exception, the ones who are visibly delighted by bad snow. That is not a coincidence and it is not humility. It is a much larger sport than the one the edits are selling.",
      ),
    ),
    author: author("juno-akiyama"),
    publishedAt: "2026-07-23T07:30:00.000Z",
    category: cat.opinion,
    tags: ["culture", "opinion", "technique"],
    featured: true,
    sponsored: false,
    accessLevel: "free",
    relatedArticleIds: ["article-flat-light-technique", "article-ski-film-economics"],
    relatedVideoIds: ["video-bad-snow-good-skiing"],
  },
  {
    _id: "article-ski-film-economics",
    title: "Who actually pays for a ski film",
    slug: "who-actually-pays-for-a-ski-film",
    kind: "blog",
    dek: "We asked six producers to break down a feature budget. The answers were more consistent — and more precarious — than expected.",
    hero: photo("chamonix-traverse"),
    body: body(
      p(
        "A feature-length ski film costs, at the low end of what is still watchable, somewhere between €180,000 and €400,000. Almost none of that comes from anyone paying to watch it.",
      ),
      h("The shape of a budget"),
      list("bullet", [
        "Brand partnerships: 55–75% of the total, split across two to five brands.",
        "Athlete-side sponsor contributions: 10–20%, often in kind rather than cash.",
        "Tourism board or regional funding: 5–25%, heavily dependent on the location.",
        "Direct revenue — tickets, rental, licensing: rarely above 8%.",
      ]),
      p(
        "That last number is the one that surprises people. A film can be widely watched, genuinely beloved and culturally durable while returning almost nothing directly. The economics run on the assumption that the film is marketing for something else.",
      ),
      quote(
        "Nobody has ever green-lit a ski film because of a revenue projection. You green-light it because three brands said yes in the same fortnight.",
        "Producer, speaking to us on background",
      ),
      h("What that does to the work"),
      p(
        "The dependence is not a scandal — it is a structure, and most producers are frank about it. But it does shape output. Films go where funding is available, which is why certain valleys are over-represented on screen and others, equally good, are effectively invisible.",
      ),
      p([
        t(
          "Our own film work is not exempt from this. Where a production is co-funded we label it on the video page, and where a partner supplied the film outright we say that too. The taxonomy is set out on our ",
        ),
        a("sponsorship page", "/sponsors"),
        t("."),
      ]),
    ),
    author: author("juno-akiyama"),
    publishedAt: "2026-07-19T08:00:00.000Z",
    category: cat.culture,
    tags: ["film", "industry", "money"],
    featured: false,
    sponsored: false,
    accessLevel: "free",
    relatedVideoIds: ["video-cold-aspect-film", "video-making-of"],
  },
  {
    _id: "article-flat-light-technique",
    title: "Skiing well when you cannot see",
    slug: "skiing-well-when-you-cannot-see",
    kind: "blog",
    dek: "Flat light is not a visibility problem so much as a balance problem. Four adjustments that work, from people who ski in it constantly.",
    hero: photo("frosted-lift"),
    body: body(
      p(
        "In genuinely flat light the surface stops giving you information about what is coming. Most skiers respond by leaning back and slowing down, which removes the two things — pressure and speed — that would have let them feel the terrain instead.",
      ),
      h("Move your weight forward, not back"),
      p(
        "The instinct is exactly wrong. A forward, shin-loaded stance puts the ski tip in contact with the snow ahead of you, which is the only sensor you have left. Sitting back makes you blind twice.",
      ),
      h("Shorten the turn"),
      p(
        "Shorter turns mean more edge changes per second, and each edge change is a reading of the surface. A long arc in flat light is a long commitment to an assumption.",
      ),
      h("Use the edges of your vision"),
      p(
        "Peripheral vision handles low contrast better than central vision does. Looking slightly to the side of where you are going, rather than straight at it, genuinely recovers detail — this is the same reason astronomers use averted vision.",
      ),
      h("Find a texture and stay near it"),
      p(
        "Trees, a rope line, a track, a rock band. Anything with contrast re-anchors your balance. Skiers who are comfortable in flat light are almost always skiing relative to something rather than into a void.",
      ),
      quote("You are not trying to see the snow. You are trying to stop needing to."),
    ),
    author: author("callum-ross"),
    publishedAt: "2026-07-17T07:00:00.000Z",
    category: cat.technique,
    tags: ["technique", "instruction", "flat light"],
    featured: false,
    sponsored: false,
    accessLevel: "free",
    relatedVideoIds: ["video-flat-light-clinic"],
  },
  {
    _id: "article-touring-binding-test",
    title: "We broke eleven touring bindings on purpose",
    slug: "we-broke-eleven-touring-bindings",
    kind: "feature",
    dek: "A season-long destruction test of pin bindings, and what the failure modes say about how they are actually designed.",
    hero: photo("vintage-skis"),
    body: body(
      p(
        "We took eleven pin bindings, mounted them on identical skis, and ran them until something gave. Not a lab test — a season of real touring days, plus a deliberately abusive final week designed to find the limit.",
      ),
      p(
        "The headline finding is not which binding lasted longest. It is that ten of the eleven failed in the same three places, which suggests the category has converged on a set of shared compromises rather than a set of shared solutions.",
      ),
      h("The three failure modes"),
      list("number", [
        "Toe-piece wing return springs, losing tension progressively rather than snapping.",
        "Heel rotation stops, wearing to the point where the tour/ski transition became ambiguous.",
        "Mounting-screw pull-out at the rear insert under repeated hard landings.",
      ]),
      quote(
        "Nothing exploded. Things got vague. Vague is worse, because you keep skiing on it.",
        "Callum Ross",
      ),
      figure(
        photo("skis-topdown", {
          caption: "Part of the test set, between cycles.",
        }),
      ),
      h("What we would actually buy"),
      p(
        "We are not publishing a ranked table, because a ranked table implies a precision this test does not have with n=1 per model. What we will say is that the two bindings that held tension longest were also the two heaviest, and that this is not a coincidence anyone in the industry disputes privately.",
      ),
      p(
        "Full methodology, including the mounting spec and the abuse protocol, is in the appendix at the end of this piece.",
      ),
    ),
    author: author("callum-ross"),
    publishedAt: "2026-07-16T06:30:00.000Z",
    category: cat.gear,
    tags: ["gear", "touring", "bindings", "testing"],
    featured: true,
    sponsored: false,
    accessLevel: "free",
    relatedVideoIds: ["video-binding-test"],
  },
  {
    _id: "article-night-train-to-the-alps",
    title: "The night train is back, and it changes the trip",
    slug: "night-train-is-back",
    kind: "blog",
    dek: "Twelve hours of sleeper rail versus two hours of flight plus everything else. We ran both, back to back, to the same valley.",
    hero: photo("frosty-branches"),
    body: body(
      p(
        "The comparison people make is flight time versus train time, and on that basis rail loses badly. The comparison that matters is door to first lift, and on that basis it is much closer than anyone expects.",
      ),
      list("bullet", [
        "Flight route: 2h 05m in the air, 11h 40m door to first lift.",
        "Rail route: 12h 20m on board, 13h 50m door to first lift.",
        "Rail cost, booked eight weeks out, was 12% lower for two people with skis.",
        "Ski carriage: included on rail, €60 each way on the flight.",
      ]),
      p(
        "Ninety minutes, then — for a journey where you sleep through most of it and arrive without having handled your bags four times. The catch is that the sleeper sells out early and the timetable serves three valleys well and everywhere else badly.",
      ),
      quote("You do not save time. You spend it differently, and you arrive able to ski."),
      p(
        "What genuinely surprised us was the effect on trip length. Everyone we spoke to who had switched to rail had also, without planning to, started taking longer trips — because the overhead only makes sense if you stay.",
      ),
    ),
    author: author("ines-cabrera"),
    publishedAt: "2026-07-15T07:45:00.000Z",
    category: cat.travel,
    tags: ["travel", "rail", "emissions"],
    featured: false,
    sponsored: true,
    sponsor: sponsor("northline-rail"),
    accessLevel: "free",
    seo: {
      description:
        "Sleeper rail versus flying to the same alpine valley, measured door to first lift.",
    },
  },
  {
    _id: "article-instructor-pay",
    title: "What a ski instructor actually earns",
    slug: "what-a-ski-instructor-actually-earns",
    kind: "feature",
    dek: "We collected anonymous pay data from 214 instructors across nine countries. The spread is enormous and the floor is lower than the industry likes to admit.",
    hero: photo("lauterbrunnen"),
    body: body(
      p(
        "Instructor pay is one of the least transparent numbers in skiing. Schools rarely publish rates, instructors are frequently discouraged from discussing them, and the headline figure quoted to prospective trainees usually describes a top-of-scale instructor in a peak week.",
      ),
      p(
        "We ran an anonymous survey over three months and received 214 usable responses covering nine countries and every certification level.",
      ),
      h("The spread"),
      list("bullet", [
        "Entry-level, high season: the middle 50% earned between €13 and €19 per contact hour.",
        "Fully certified, high season: €26 to €48 per contact hour.",
        "Median guaranteed hours per week in January: 21. In April: 6.",
        "62% reported doing unpaid work — fitting, admin, queue management — as an expectation.",
      ]),
      quote(
        "The hourly rate is fine. The problem is that nobody gets forty hours, and the season is fourteen weeks.",
        "Certified instructor, eleven seasons",
      ),
      h("Housing eats the difference"),
      p(
        "The single largest determinant of whether a season was financially viable was not the rate. It was whether accommodation was provided. Instructors in staff housing reported saving money over a season at rates where instructors renting privately reported losing it.",
      ),
      p(
        "The full anonymised dataset, with country and certification bands, is available on request to anyone who wants to check our arithmetic.",
      ),
    ),
    author: author("mera-lindqvist"),
    publishedAt: "2026-07-14T06:00:00.000Z",
    category: cat.industry,
    tags: ["instruction", "labour", "pay", "industry"],
    featured: false,
    sponsored: false,
    accessLevel: "free",
  },
  {
    _id: "article-fjellhaus-shell-partner",
    title: "Building a shell for four days of continuous rain",
    slug: "building-a-shell-for-continuous-rain",
    kind: "blog",
    dek: "A look inside a maritime-snow outerwear programme, produced with support from Fjellhaus.",
    hero: photo("snowstorm-peak", {
      alt: "Rain-heavy cloud closes over a maritime mountain face",
    }),
    body: body(
      p(
        "Maritime snowpacks pose a materials problem that alpine ones do not: the failure condition is not cold, it is sustained wetting at temperatures around freezing, where a membrane's pressure differential largely disappears.",
      ),
      p(
        "This piece was produced with financial support from Fjellhaus, whose outerwear programme is the subject. The reporting, interviews and conclusions were ours; the sponsor saw the piece at the same time as our readers.",
      ),
      h("Why the membrane stops working"),
      p(
        "Vapour transport through a membrane is driven by the difference in vapour pressure between the inside and outside of the garment. On a cold day that difference is large. At +1°C in rain, with a saturated face fabric, it approaches zero — and a garment that tests brilliantly in a lab reads as 'not breathable' on the hill.",
      ),
      list("bullet", [
        "Face-fabric DWR does more work than the membrane in these conditions.",
        "Mechanical venting outperforms any membrane once the differential collapses.",
        "Cuff and hem sealing matters more than seam count.",
      ]),
      p(
        "None of this is proprietary insight — it is well understood by anyone designing for the Pacific Northwest, Scotland or western Norway. It is just rarely how outerwear is marketed, because 'we added bigger vents' is a harder sell than a membrane specification.",
      ),
    ),
    author: author("callum-ross"),
    publishedAt: "2026-07-12T09:00:00.000Z",
    category: cat.gear,
    tags: ["gear", "outerwear", "materials"],
    featured: false,
    sponsored: true,
    sponsor: sponsor("fjellhaus"),
    accessLevel: "free",
  },
  {
    _id: "article-hokkaido-january",
    title: "A January in Hokkaido, counted",
    slug: "a-january-in-hokkaido-counted",
    kind: "blog",
    dek: "Thirty-one days, one notebook, and an attempt to describe a famous snowpack without using the word that everyone uses.",
    hero: photo("sunrise-ascent"),
    body: body(
      p(
        "I spent January keeping a deliberately boring record: snowfall overnight, temperature at 09:00, wind at the top station, and one sentence about the skiing. The aim was to see what the month looked like stripped of adjectives.",
      ),
      list("bullet", [
        "Days with measurable overnight snowfall: 26 of 31.",
        "Days with more than 20cm overnight: 14.",
        "Days where wind closed the upper mountain: 9.",
        "Days with visible sun above treeline: 3.",
      ]),
      p(
        "The number that reframes the place is the last one. The reputation is built on the snow; the actual experience is built on the light, and there mostly isn't any. Nine days of the month the top half of the mountain was shut, and on twenty-eight of them you skied in a grey box.",
      ),
      quote(
        "It is the best snow I have skied and I could not tell you what the mountain looks like.",
      ),
      p(
        "This is not a complaint. It is an argument that the marketing image — bright, blue, waist-deep — describes about three days in thirty-one, and that the other twenty-eight are the reason to go.",
      ),
    ),
    author: author("juno-akiyama"),
    publishedAt: "2026-07-10T08:15:00.000Z",
    category: cat.travel,
    tags: ["travel", "hokkaido", "snow"],
    featured: false,
    sponsored: false,
    accessLevel: "free",
    relatedVideoIds: ["video-hokkaido-january"],
  },
  {
    _id: "article-resort-snow-guarantee",
    title: "The quiet death of the snow guarantee",
    slug: "quiet-death-of-the-snow-guarantee",
    kind: "opinion",
    dek: "Refund promises were a marketing device that briefly became a liability. Almost every operator has now dropped them, and nobody announced it.",
    hero: photo("remote-hut"),
    body: body(
      p(
        "Ten years ago the snow guarantee was everywhere: book early, and if the mountain does not open, you get your money back. Today you will struggle to find one that is not hedged into meaninglessness.",
      ),
      p(
        "The reason is not mysterious. A guarantee is an insurance product, and the underwriting assumptions behind these ones were built on twentieth-century snowfall distributions. When the distributions moved, the products stopped being cheap to offer.",
      ),
      p(
        "What is notable is the silence. Nobody withdrew a guarantee with a press release. They were redefined — 'lifts operating' rather than 'terrain open', 'the resort' rather than 'the upper mountain' — until the promise described a condition that is nearly always met.",
      ),
      quote("The guarantee did not fail. It was reworded until it could not."),
      p(
        "Operators are entitled to price risk. But a guarantee that has been quietly emptied is worse than no guarantee, because it still does the marketing work while doing none of the insuring.",
      ),
    ),
    author: author("mera-lindqvist"),
    publishedAt: "2026-07-08T07:00:00.000Z",
    category: cat.opinion,
    tags: ["opinion", "resorts", "industry"],
    featured: false,
    sponsored: false,
    accessLevel: "free",
  },
];

export const articleBySlug = (slug: string) => articles.find((x) => x.slug === slug);
