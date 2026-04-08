import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, Star, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import type {
  CriteriaKey,
  CriteriaRatings,
  RatingSummaryLocal,
  ResidenceId,
  ResidenceInfo,
  Review,
} from "../types/reviews";

// ─── Constants ───────────────────────────────────────────────────────────────

const RESIDENCES: ResidenceInfo[] = [
  {
    id: "waldhaus-tannenhof",
    name: "Waldhaus Tannenhof",
    image: "/assets/generated/waldhaus-tannenhof.dim_1200x800.jpg",
  },
  {
    id: "forsthaus-hirschgrund",
    name: "Forsthaus Hirschgrund",
    image: "/assets/generated/forsthaus-hirschgrund.dim_1200x800.jpg",
  },
  {
    id: "domizil-fichtenberg",
    name: "Domizil Fichtenberg",
    image: "/assets/generated/domizil-fichtenberg.dim_1200x800.jpg",
  },
  {
    id: "domizil-schwarzwaldblick",
    name: "Domizil Schwarzwaldblick",
    image: "/assets/generated/domizil-schwarzwaldblick.dim_1200x800.jpg",
  },
];

const CRITERIA_KEYS: CriteriaKey[] = [
  "cleanliness",
  "comfort",
  "location",
  "service",
  "value",
];

const CRITERIA_LABELS: Record<CriteriaKey, { de: string; en: string }> = {
  cleanliness: { de: "Sauberkeit", en: "Cleanliness" },
  comfort: { de: "Komfort", en: "Comfort" },
  location: { de: "Lage", en: "Location" },
  service: { de: "Service", en: "Service" },
  value: { de: "Preis-Leistung", en: "Value" },
};

const DEFAULT_CRITERIA: CriteriaRatings = {
  cleanliness: 0,
  comfort: 0,
  location: 0,
  service: 0,
  value: 0,
};

// ─── Sample Data ──────────────────────────────────────────────────────────────

function makeSampleData(): Record<ResidenceId, Review[]> {
  return {
    "waldhaus-tannenhof": [
      {
        id: "wt-1",
        residenceId: "waldhaus-tannenhof",
        author: "Familie Hofmann",
        email: "hofmann@example.de",
        stayPeriod: "September 2024",
        overallRating: 5,
        criteria: {
          cleanliness: 5,
          comfort: 5,
          location: 5,
          service: 5,
          value: 4,
        },
        message:
          "Das Waldhaus Tannenhof hat unsere Erwartungen weit übertroffen. Der Duft der alten Tannen am Morgen, die Stille im Wald – es ist ein Ort, der die Seele berührt. Wir kommen definitiv wieder.",
        date: "2024-09-18T10:00:00.000Z",
      },
      {
        id: "wt-2",
        residenceId: "waldhaus-tannenhof",
        author: "Markus & Petra S.",
        email: "ms@example.de",
        stayPeriod: "Juli 2024",
        overallRating: 5,
        criteria: {
          cleanliness: 5,
          comfort: 4,
          location: 5,
          service: 5,
          value: 5,
        },
        message:
          "Absolutely wonderful stay. The craftsmanship of the house is extraordinary – every corner tells a story. We spent evenings by the fireplace listening to the forest, completely at peace.",
        date: "2024-07-22T08:30:00.000Z",
      },
    ],
    "forsthaus-hirschgrund": [
      {
        id: "fh-1",
        residenceId: "forsthaus-hirschgrund",
        author: "Dr. Anna Richter",
        email: "richter@example.de",
        stayPeriod: "August 2024",
        overallRating: 5,
        criteria: {
          cleanliness: 5,
          comfort: 5,
          location: 5,
          service: 4,
          value: 5,
        },
        message:
          "Ein unvergesslicher Aufenthalt. Das Forsthaus liegt so tief im Wald, dass man die Welt draußen völlig vergisst. Die Panoramaterrasse beim Frühstück – unglaublich. Einmal erleben, und man versteht alles.",
        date: "2024-08-10T09:15:00.000Z",
      },
      {
        id: "fh-2",
        residenceId: "forsthaus-hirschgrund",
        author: "The Williams Family",
        email: "williams@example.co.uk",
        stayPeriod: "October 2024",
        overallRating: 4,
        criteria: {
          cleanliness: 5,
          comfort: 4,
          location: 5,
          service: 4,
          value: 4,
        },
        message:
          "We traveled from London for this stay and it exceeded all our expectations. The forest views are magical in autumn – golden light filtering through the firs. Highly recommended for anyone seeking genuine peace.",
        date: "2024-10-05T14:00:00.000Z",
      },
    ],
    "domizil-fichtenberg": [
      {
        id: "df-1",
        residenceId: "domizil-fichtenberg",
        author: "Lars & Sophie M.",
        email: "larsm@example.de",
        stayPeriod: "November 2024",
        overallRating: 5,
        criteria: {
          cleanliness: 5,
          comfort: 5,
          location: 4,
          service: 5,
          value: 4,
        },
        message:
          "Die Architektur des Fichtenbergs ist schlicht atemberaubend. Licht, Raum, Wald – alles in perfekter Balance. Ein minimalistisches Refugium für alle, die Schönheit in der Stille suchen.",
        date: "2024-11-03T11:20:00.000Z",
      },
      {
        id: "df-2",
        residenceId: "domizil-fichtenberg",
        author: "Claudia Berger",
        email: "cberger@example.de",
        stayPeriod: "Juni 2024",
        overallRating: 5,
        criteria: {
          cleanliness: 5,
          comfort: 5,
          location: 5,
          service: 5,
          value: 5,
        },
        message:
          "Perfekte Auszeit vom Alltag. Die bodentiefen Fenster lassen den Wald ins Zimmer fließen – man wacht auf und denkt, man träumt noch. Das Frühstück im Morgengrauen mit Waldrehen – unvergesslich.",
        date: "2024-06-15T07:45:00.000Z",
      },
    ],
    "domizil-schwarzwaldblick": [
      {
        id: "ds-1",
        residenceId: "domizil-schwarzwaldblick",
        author: "Philippe & Isabelle D.",
        email: "dupont@example.fr",
        stayPeriod: "Dezember 2024",
        overallRating: 5,
        criteria: {
          cleanliness: 5,
          comfort: 5,
          location: 5,
          service: 5,
          value: 5,
        },
        message:
          "Le Schwarzwaldblick, c'est le luxe véritable – discret, profond, inoubliable. The infinity pool in winter with the snow-covered forest below is an image we will never forget. Truly exceptional.",
        date: "2024-12-28T16:00:00.000Z",
      },
      {
        id: "ds-2",
        residenceId: "domizil-schwarzwaldblick",
        author: "Thomas & Ingrid K.",
        email: "tk@example.at",
        stayPeriod: "Oktober 2024",
        overallRating: 5,
        criteria: {
          cleanliness: 5,
          comfort: 5,
          location: 5,
          service: 5,
          value: 4,
        },
        message:
          "Über den Wipfeln zu stehen und auf den Schwarzwald zu blicken – das ist eine Erfahrung, die man mit Worten kaum beschreiben kann. Der Infinity-Pool im Herbstlicht ist pure Magie. Ein absolutes Highlight.",
        date: "2024-10-20T18:30:00.000Z",
      },
    ],
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeSummary(reviews: Review[]): RatingSummaryLocal {
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      criteriaAverages: {
        cleanliness: 0,
        comfort: 0,
        location: 0,
        service: 0,
        value: 0,
      },
    };
  }
  const total = reviews.reduce((s, r) => s + r.overallRating, 0);
  const criteriaAverages = CRITERIA_KEYS.reduce<CriteriaRatings>(
    (acc, key) => {
      acc[key] =
        reviews.reduce((s, r) => s + r.criteria[key], 0) / reviews.length;
      return acc;
    },
    { cleanliness: 0, comfort: 0, location: 0, service: 0, value: 0 },
  );
  return {
    averageRating: total / reviews.length,
    totalReviews: reviews.length,
    criteriaAverages,
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StarRowProps {
  value: number;
  maxValue?: number;
  size?: "xs" | "sm" | "md";
  interactive?: false;
}

interface InteractiveStarRowProps {
  value: number;
  size?: "xs" | "sm" | "md";
  interactive: true;
  hoverValue: number;
  onHover: (v: number) => void;
  onLeave: () => void;
  onChange: (v: number) => void;
}

type StarRowAllProps = StarRowProps | InteractiveStarRowProps;

function StarRow(props: StarRowAllProps) {
  const sizeClass =
    props.size === "xs"
      ? "h-3.5 w-3.5"
      : props.size === "sm"
        ? "h-4.5 w-4.5"
        : "h-6 w-6";

  if (!props.interactive) {
    const filled = Math.round(props.value);
    const max = props.maxValue ?? 5;
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= filled
                ? "fill-[#0f3d2e] stroke-[#0f3d2e]"
                : "fill-none stroke-[#cccccc]"
            }`}
          />
        ))}
      </div>
    );
  }

  const { value, hoverValue, onHover, onLeave, onChange } = props;
  const active = hoverValue || value;
  return (
    <div className="flex gap-1" onMouseLeave={onLeave}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} stars`}
          onMouseEnter={() => onHover(star)}
          onClick={() => onChange(star)}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f3d2e] rounded transition-transform hover:scale-110"
        >
          <Star
            className={`h-7 w-7 transition-all duration-150 ${
              star <= active
                ? "fill-[#0f3d2e] stroke-[#0f3d2e]"
                : "fill-none stroke-[#999999]"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

interface CriteriaBarProps {
  labelDe: string;
  labelEn: string;
  value: number;
  isEnglish: boolean;
}

function CriteriaBar({ labelDe, labelEn, value, isEnglish }: CriteriaBarProps) {
  const pct = (value / 5) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-xs text-[#444444] font-sans shrink-0">
        {isEnglish ? labelEn : labelDe}
      </span>
      <div className="flex-1 h-1.5 bg-[#e5e5e5] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#0f3d2e] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-xs text-[#666666] font-sans text-right shrink-0">
        {value > 0 ? value.toFixed(1) : "–"}
      </span>
    </div>
  );
}

// ─── Review Form ─────────────────────────────────────────────────────────────

interface FormState {
  author: string;
  email: string;
  stayPeriod: string;
  overallRating: number;
  criteria: CriteriaRatings;
  message: string;
}

interface FormErrors {
  author?: string;
  email?: string;
  stayPeriod?: string;
  overallRating?: string;
  message?: string;
}

const EMPTY_FORM: FormState = {
  author: "",
  email: "",
  stayPeriod: "",
  overallRating: 0,
  criteria: { ...DEFAULT_CRITERIA },
  message: "",
};

interface ReviewFormProps {
  residence: ResidenceInfo;
  isEnglish: boolean;
  onSubmit: (form: FormState) => void;
  onClose: () => void;
}

function ReviewForm({
  residence,
  isEnglish,
  onSubmit,
  onClose,
}: ReviewFormProps) {
  const [form, setForm] = useState<FormState>({
    ...EMPTY_FORM,
    criteria: { ...DEFAULT_CRITERIA },
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [hoverOverall, setHoverOverall] = useState(0);
  const [hoverCriteria, setHoverCriteria] = useState<
    Record<CriteriaKey, number>
  >(() => ({ cleanliness: 0, comfort: 0, location: 0, service: 0, value: 0 }));

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const setCriteria = (key: CriteriaKey, val: number) =>
    setForm((p) => ({ ...p, criteria: { ...p.criteria, [key]: val } }));

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.author.trim())
      e.author = isEnglish ? "Name is required" : "Name ist erforderlich";
    if (!form.email.trim())
      e.email = isEnglish ? "Email is required" : "E-Mail ist erforderlich";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = isEnglish
        ? "Invalid email address"
        : "Ungültige E-Mail-Adresse";
    if (!form.stayPeriod.trim())
      e.stayPeriod = isEnglish
        ? "Stay period is required"
        : "Aufenthaltszeitraum erforderlich";
    if (form.overallRating < 1)
      e.overallRating = isEnglish
        ? "Overall rating is required"
        : "Gesamtbewertung erforderlich";
    if (!form.message.trim())
      e.message = isEnglish
        ? "Please share your experience"
        : "Bitte schildern Sie Ihre Erfahrung";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
    setForm({ ...EMPTY_FORM, criteria: { ...DEFAULT_CRITERIA } });
    setErrors({});
  };

  const inputClass =
    "w-full border border-[#e5e5e5] focus:border-[#0f3d2e] focus:ring-0 rounded px-3 py-2 font-sans text-sm text-[#111111] bg-white placeholder:text-[#aaaaaa] transition-colors";

  return (
    <div className="animate-form-reveal">
      {/* Residence image */}
      <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border border-[#e5e5e5] mb-8">
        <img
          src={residence.image}
          alt={residence.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="font-serif text-2xl font-semibold text-[#111111] mb-8 tracking-tight">
        {isEnglish ? "Write a review for" : "Bewertung schreiben für"}{" "}
        <span className="text-[#0f3d2e]">{residence.name}</span>
      </h3>

      <div className="space-y-7">
        {/* Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label className="block font-sans text-xs font-semibold text-[#333333] uppercase tracking-wider mb-2">
              {isEnglish ? "Name" : "Name"} *
            </Label>
            <Input
              type="text"
              placeholder={isEnglish ? "Your name" : "Ihr Name"}
              value={form.author}
              onChange={(e) => set("author", e.target.value)}
              className={inputClass}
              data-ocid="review-name-input"
            />
            {errors.author && (
              <p className="text-red-500 text-xs mt-1 font-sans">
                {errors.author}
              </p>
            )}
          </div>
          <div>
            <Label className="block font-sans text-xs font-semibold text-[#333333] uppercase tracking-wider mb-2">
              {isEnglish ? "Email" : "E-Mail"} *
            </Label>
            <Input
              type="email"
              placeholder="ihre@email.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className={inputClass}
              data-ocid="review-email-input"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-sans">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Stay Period */}
        <div>
          <Label className="block font-sans text-xs font-semibold text-[#333333] uppercase tracking-wider mb-2">
            {isEnglish ? "Stay Period" : "Aufenthaltszeitraum"} *
          </Label>
          <Input
            type="text"
            placeholder={isEnglish ? "e.g. October 2024" : "z.B. Oktober 2024"}
            value={form.stayPeriod}
            onChange={(e) => set("stayPeriod", e.target.value)}
            className={inputClass}
            data-ocid="review-stay-input"
          />
          {errors.stayPeriod && (
            <p className="text-red-500 text-xs mt-1 font-sans">
              {errors.stayPeriod}
            </p>
          )}
        </div>

        {/* Overall Rating */}
        <div>
          <Label className="block font-sans text-xs font-semibold text-[#333333] uppercase tracking-wider mb-3">
            {isEnglish ? "Overall Rating" : "Gesamtbewertung"} *
          </Label>
          <StarRow
            interactive
            value={form.overallRating}
            hoverValue={hoverOverall}
            onHover={setHoverOverall}
            onLeave={() => setHoverOverall(0)}
            onChange={(v) => set("overallRating", v)}
          />
          {errors.overallRating && (
            <p className="text-red-500 text-xs mt-2 font-sans">
              {errors.overallRating}
            </p>
          )}
        </div>

        {/* Criteria Ratings */}
        <div>
          <Label className="block font-sans text-xs font-semibold text-[#333333] uppercase tracking-wider mb-4">
            {isEnglish ? "Detailed Ratings" : "Detailbewertung"}
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CRITERIA_KEYS.map((key) => (
              <div key={key}>
                <p className="font-sans text-xs text-[#666666] mb-2">
                  {isEnglish
                    ? CRITERIA_LABELS[key].en
                    : CRITERIA_LABELS[key].de}
                </p>
                <div
                  className="flex gap-1"
                  onMouseLeave={() =>
                    setHoverCriteria((p) => ({ ...p, [key]: 0 }))
                  }
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = hoverCriteria[key] || form.criteria[key];
                    return (
                      <button
                        key={star}
                        type="button"
                        aria-label={`${star} stars for ${key}`}
                        onMouseEnter={() =>
                          setHoverCriteria((p) => ({ ...p, [key]: star }))
                        }
                        onClick={() => setCriteria(key, star)}
                        className="focus:outline-none rounded transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-5 w-5 transition-all duration-150 ${
                            star <= active
                              ? "fill-[#0f3d2e] stroke-[#0f3d2e]"
                              : "fill-none stroke-[#cccccc]"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <Label className="block font-sans text-xs font-semibold text-[#333333] uppercase tracking-wider mb-2">
            {isEnglish ? "Your Experience" : "Ihre Erfahrung"} *
          </Label>
          <Textarea
            placeholder={
              isEnglish
                ? "Share your experience..."
                : "Erzählen Sie uns von Ihrem Aufenthalt..."
            }
            rows={5}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            className={`${inputClass} resize-none`}
            data-ocid="review-message-input"
          />
          {errors.message && (
            <p className="text-red-500 text-xs mt-1 font-sans">
              {errors.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={handleSubmit}
            className="bg-[#0f3d2e] hover:bg-[#1a5c44] text-white font-sans font-medium px-10 py-3 rounded transition-colors"
            data-ocid="review-submit-btn"
          >
            {isEnglish ? "Submit Review" : "Bewertung absenden"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#e5e5e5] text-[#666666] hover:bg-[#f5f5f5] font-sans font-medium px-6 py-3 rounded transition-colors"
            data-ocid="review-cancel-btn"
          >
            {isEnglish ? "Cancel" : "Abbrechen"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Residence Review Section ────────────────────────────────────────────────

interface ResidenceSectionProps {
  residence: ResidenceInfo;
  reviews: Review[];
  isEnglish: boolean;
  onDelete: (residenceId: ResidenceId, reviewId: string) => void;
}

function ResidenceSection({
  residence,
  reviews,
  isEnglish,
  onDelete,
}: ResidenceSectionProps) {
  const summary = computeSummary(reviews);
  const sorted = [...reviews].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div
      id={`section-${residence.id}`}
      className="pt-12 border-t border-[#e5e5e5] first:border-0 first:pt-0"
    >
      <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#111111] mb-8 tracking-tight">
        {residence.name}
      </h2>

      {summary.totalReviews > 0 ? (
        <>
          {/* Rating Summary Card */}
          <div className="border border-[#e5e5e5] rounded-lg p-6 sm:p-8 mb-8 bg-white">
            <div className="flex flex-col sm:flex-row gap-8">
              {/* Average score */}
              <div className="flex flex-col items-center justify-center sm:w-32 shrink-0">
                <span className="font-serif text-5xl font-bold text-[#0f3d2e] leading-none">
                  {summary.averageRating.toFixed(1)}
                </span>
                <div className="mt-2">
                  <StarRow value={summary.averageRating} size="xs" />
                </div>
                <p className="text-xs text-[#888888] font-sans mt-2 text-center">
                  {summary.totalReviews}{" "}
                  {isEnglish
                    ? summary.totalReviews === 1
                      ? "review"
                      : "reviews"
                    : summary.totalReviews === 1
                      ? "Bewertung"
                      : "Bewertungen"}
                </p>
              </div>

              {/* Criteria bars */}
              <div className="flex-1 space-y-3">
                {CRITERIA_KEYS.map((key) => (
                  <CriteriaBar
                    key={key}
                    labelDe={CRITERIA_LABELS[key].de}
                    labelEn={CRITERIA_LABELS[key].en}
                    value={summary.criteriaAverages[key]}
                    isEnglish={isEnglish}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Review Cards */}
          <div className="space-y-5">
            {sorted.map((review) => (
              <div
                key={review.id}
                className="border border-[#e5e5e5] rounded-lg p-6 bg-white hover:border-[#cccccc] transition-colors"
                data-ocid={`review-card-${review.id}`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0">
                    <p className="font-sans font-semibold text-[#111111] text-sm truncate">
                      {review.author}
                    </p>
                    <p className="font-sans text-xs text-[#888888] mt-0.5">
                      {review.stayPeriod} · {formatDate(review.date)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          isEnglish
                            ? "Remove this review?"
                            : "Diese Bewertung entfernen?",
                        )
                      ) {
                        onDelete(review.residenceId, review.id);
                      }
                    }}
                    className="shrink-0 text-[#cccccc] hover:text-red-500 transition-colors mt-0.5"
                    aria-label={
                      isEnglish ? "Delete review" : "Bewertung löschen"
                    }
                    data-ocid={`review-delete-${review.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-3">
                  <StarRow value={review.overallRating} size="xs" />
                </div>

                <p className="font-sans text-sm text-[#444444] leading-relaxed mb-4">
                  {review.message}
                </p>

                {/* Criteria breakdown */}
                <div className="border-t border-[#f0f0f0] pt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {CRITERIA_KEYS.map((key) => (
                    <div key={key} className="text-center">
                      <p className="font-sans text-[10px] text-[#999999] uppercase tracking-wider mb-0.5">
                        {isEnglish
                          ? CRITERIA_LABELS[key].en
                          : CRITERIA_LABELS[key].de}
                      </p>
                      <p className="font-sans text-xs font-semibold text-[#0f3d2e]">
                        {review.criteria[key]}/5
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p
          className="text-center py-12 font-sans text-[#bbbbbb] text-sm italic"
          data-ocid="review-empty-state"
        >
          {isEnglish
            ? "Be the first to review this residence."
            : "Seien Sie die Erste, die dieses Domizil bewertet."}
        </p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReviewsPage() {
  const { t, language } = useLanguage();
  const isEnglish = language.toString() === "en";

  const [selectedResidenceId, setSelectedResidenceId] =
    useState<ResidenceId | null>(null);
  const [localReviews, setLocalReviews] = useState<
    Record<ResidenceId, Review[]>
  >(() => makeSampleData());

  const formRef = useRef<HTMLDivElement>(null);

  const handleSelectResidence = (id: ResidenceId) => {
    setSelectedResidenceId(id);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const handleFormClose = () => {
    setSelectedResidenceId(null);
  };

  const handleFormSubmit = (form: FormState) => {
    if (!selectedResidenceId) return;
    const newReview: Review = {
      id: `${selectedResidenceId}-${Date.now()}`,
      residenceId: selectedResidenceId,
      author: form.author,
      email: form.email,
      stayPeriod: form.stayPeriod,
      overallRating: form.overallRating,
      criteria: form.criteria,
      message: form.message,
      date: new Date().toISOString(),
    };
    setLocalReviews((prev) => ({
      ...prev,
      [selectedResidenceId]: [...prev[selectedResidenceId], newReview],
    }));
    setSelectedResidenceId(null);
  };

  const handleDelete = (residenceId: ResidenceId, reviewId: string) => {
    setLocalReviews((prev) => ({
      ...prev,
      [residenceId]: prev[residenceId].filter((r) => r.id !== reviewId),
    }));
  };

  const selectedResidence = RESIDENCES.find(
    (r) => r.id === selectedResidenceId,
  );

  // Average rating per residence for card badge
  const avgForResidence = (id: ResidenceId): number => {
    const reviews = localReviews[id];
    if (!reviews.length) return 0;
    return reviews.reduce((s, r) => s + r.overallRating, 0) / reviews.length;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="pt-28 pb-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#111111] tracking-tight mb-4">
            {t("reviews.title") || "Gästestimmen"}
          </h1>
          <p className="font-sans text-base text-[#666666] max-w-xl mx-auto leading-relaxed">
            {isEnglish
              ? "Discover what our guests have to say about their stays at our exclusive Schwarzwald residences."
              : "Entdecken Sie, was unsere Gäste über ihre Aufenthalte in unseren exklusiven Schwarzwald-Domizilen berichten."}
          </p>
        </div>
      </section>

      {/* Residence Cards Grid */}
      <section className="pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {RESIDENCES.map((residence) => {
              const avg = avgForResidence(residence.id);
              const count = localReviews[residence.id].length;
              const isSelected = selectedResidenceId === residence.id;
              return (
                <article
                  key={residence.id}
                  className={`group relative border rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-lg bg-white ${
                    isSelected ? "border-[#0f3d2e]" : "border-[#e5e5e5]"
                  }`}
                  data-ocid={`residence-card-${residence.id}`}
                >
                  {/* Full-card invisible button for keyboard/screen-reader access */}
                  <button
                    type="button"
                    className="absolute inset-0 z-10 opacity-0 cursor-pointer w-full h-full"
                    onClick={() => handleSelectResidence(residence.id)}
                    aria-label={`${isEnglish ? "Write a review for" : "Bewertung schreiben für"} ${residence.name}`}
                  />

                  {/* Image */}
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={residence.image}
                      alt={residence.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5 relative z-20 pointer-events-none">
                    <h3 className="font-serif text-lg font-semibold text-[#111111] mb-2 tracking-tight">
                      {residence.name}
                    </h3>

                    {/* Star badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <StarRow value={avg} size="xs" />
                      <span className="font-sans text-xs text-[#888888]">
                        {count > 0
                          ? `${avg.toFixed(1)} (${count} ${isEnglish ? (count === 1 ? "review" : "reviews") : count === 1 ? "Bewertung" : "Bewertungen"})`
                          : isEnglish
                            ? "No reviews yet"
                            : "Noch keine Bewertungen"}
                      </span>
                    </div>

                    {/* CTA text */}
                    <span className="inline-flex items-center gap-1.5 text-[#0f3d2e] font-sans text-sm font-medium">
                      {isEnglish ? "Write a review" : "Bewertung schreiben"}
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Review Form (revealed on card click) */}
      <div ref={formRef}>
        {selectedResidenceId && selectedResidence && (
          <section className="pb-16 px-4 sm:px-6 bg-[#fafafa] border-t border-[#e5e5e5]">
            <div className="max-w-3xl mx-auto pt-12">
              <div className="bg-white border border-[#e5e5e5] rounded-lg p-6 sm:p-10 shadow-sm">
                <ReviewForm
                  residence={selectedResidence}
                  isEnglish={isEnglish}
                  onSubmit={handleFormSubmit}
                  onClose={handleFormClose}
                />
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Per-Residence Review Sections */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-0">
          {RESIDENCES.map((residence) => (
            <div key={residence.id} className="py-12">
              <ResidenceSection
                residence={residence}
                reviews={localReviews[residence.id]}
                isEnglish={isEnglish}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes formReveal {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-form-reveal {
          animation: formReveal 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
