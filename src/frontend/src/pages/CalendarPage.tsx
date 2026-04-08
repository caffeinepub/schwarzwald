import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import MinimalistCalendar from "../components/MinimalistCalendar";
import { useLanguage } from "../contexts/LanguageContext";
import { useSubmitBookingInquiry } from "../hooks/useQueries";

interface ResidenceFormData {
  name: string;
  email: string;
  phone: string;
  guests: string;
  message: string;
}

interface ResidenceState {
  startDate: Date | null;
  endDate: Date | null;
  formData: ResidenceFormData;
  errors: Record<string, string>;
}

interface ResidenceInfo {
  id: string;
  name: string;
  capacity: number;
  minStay: number;
  /** Indices of the next 14 days (0-based) that appear "unavailable" for demo realism */
  unavailableDays: number[];
}

const RESIDENCES: ResidenceInfo[] = [
  {
    id: "waldhaus-tannenhof",
    name: "Waldhaus Tannenhof",
    capacity: 8,
    minStay: 3,
    unavailableDays: [2, 3, 9],
  },
  {
    id: "forsthaus-hirschgrund",
    name: "Forsthaus Hirschgrund",
    capacity: 6,
    minStay: 3,
    unavailableDays: [5, 6, 11],
  },
  {
    id: "domizil-fichtenberg",
    name: "Domizil Fichtenberg",
    capacity: 4,
    minStay: 3,
    unavailableDays: [1, 7, 12],
  },
  {
    id: "domizil-schwarzwaldblick",
    name: "Domizil Schwarzwaldblick",
    capacity: 6,
    minStay: 5,
    unavailableDays: [0, 4, 10, 13],
  },
];

// ── Availability mini-indicator ─────────────────────────────────────────────

interface AvailabilityDotProps {
  unavailableDays: number[];
}

function AvailabilityDots({ unavailableDays }: AvailabilityDotProps) {
  const unavailableSet = new Set(unavailableDays);
  return (
    <div className="flex flex-wrap gap-1" aria-hidden="true">
      {Array.from({ length: 14 }, (_, i) => {
        const isUnavailable = unavailableSet.has(i);
        const dayKey = `day-${i}`;
        return (
          <span
            key={dayKey}
            className={`inline-block w-4 h-4 rounded-sm border ${
              isUnavailable
                ? "bg-foreground/20 border-foreground/30"
                : "bg-[#0f3d2e]/70 border-[#0f3d2e]/80"
            }`}
            title={isUnavailable ? "Booked" : "Available"}
          />
        );
      })}
    </div>
  );
}

// ── Availability Overview Section ───────────────────────────────────────────

interface OverviewSectionProps {
  residences: ResidenceInfo[];
  onScrollToResidence: (id: string) => void;
}

function OverviewSection({
  residences,
  onScrollToResidence,
}: OverviewSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-24 border-b border-border">
      <div className="container max-w-5xl">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">
            {t("calendar.overview.title") || "Availability Overview"}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            {t("calendar.overview.subtitle") ||
              "Compare availability across all residences at a glance"}
          </p>
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center gap-6 mb-10 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-sm bg-[#0f3d2e]/70 border border-[#0f3d2e]/80" />
            {t("calendar.overview.legend.available") || "Available"}
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-sm bg-foreground/20 border border-foreground/30" />
            {t("calendar.overview.legend.booked") || "Booked"}
          </span>
        </div>

        {/* Residence cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {residences.map((residence) => (
            <div
              key={residence.id}
              className="bg-card border border-border rounded-none p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200"
              data-ocid={`overview-card-${residence.id}`}
            >
              {/* Name */}
              <h3 className="text-xl font-serif font-semibold leading-tight">
                {residence.name}
              </h3>

              {/* Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>
                  {t("calendar.overview.capacity") || "Up to"}{" "}
                  <strong className="text-foreground">
                    {residence.capacity}
                  </strong>{" "}
                  {t("calendar.overview.guests") || "guests"}
                </span>
                <span>
                  {t("calendar.overview.minstay") || "Min."}{" "}
                  <strong className="text-foreground">
                    {residence.minStay}
                  </strong>{" "}
                  {t("calendar.overview.nights") || "nights"}
                </span>
              </div>

              {/* 14-day availability strip */}
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t("calendar.overview.next14") || "Next 14 days"}
                </p>
                <AvailabilityDots unavailableDays={residence.unavailableDays} />
              </div>

              {/* CTA */}
              <Button
                variant="outline"
                className="mt-2 border-[#0f3d2e] text-[#0f3d2e] hover:bg-[#0f3d2e] hover:text-white transition-colors duration-200 rounded-none self-start"
                onClick={() => onScrollToResidence(residence.id)}
                data-ocid={`overview-book-${residence.id}`}
              >
                {t("calendar.overview.cta") || "View Details & Book"} →
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const { language, t } = useLanguage();
  const submitInquiry = useSubmitBookingInquiry();

  // Refs for per-residence sections (for smooth scroll)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>(
    Object.fromEntries(RESIDENCES.map((r) => [r.id, null])),
  );

  // State for each residence
  const [residenceStates, setResidenceStates] = useState<
    Record<string, ResidenceState>
  >(
    Object.fromEntries(
      RESIDENCES.map((residence) => [
        residence.id,
        {
          startDate: null,
          endDate: null,
          formData: {
            name: "",
            email: "",
            phone: "",
            guests: "2",
            message: "",
          },
          errors: {},
        },
      ]),
    ),
  );

  const scrollToResidence = useCallback((id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleDateRangeSelect = useCallback(
    (residenceId: string, start: Date | null, end: Date | null) => {
      setResidenceStates((prev) => ({
        ...prev,
        [residenceId]: {
          ...prev[residenceId],
          startDate: start,
          endDate: end,
        },
      }));
    },
    [],
  );

  const validateForm = useCallback(
    (residenceId: string) => {
      const state = residenceStates[residenceId];
      const newErrors: Record<string, string> = {};

      if (!state.formData.name.trim()) {
        newErrors.name = t("calendar.form.error.name");
      }

      if (!state.formData.email.trim()) {
        newErrors.email = t("calendar.form.error.email");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.formData.email)) {
        newErrors.email = t("calendar.form.error.email.invalid");
      }

      setResidenceStates((prev) => ({
        ...prev,
        [residenceId]: {
          ...prev[residenceId],
          errors: newErrors,
        },
      }));

      return Object.keys(newErrors).length === 0;
    },
    [residenceStates, t],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent, residenceId: string, residenceName: string) => {
      e.preventDefault();

      const state = residenceStates[residenceId];

      if (!state.startDate || !state.endDate) {
        toast.error(t("calendar.form.error.validation"));
        return;
      }

      if (!validateForm(residenceId)) {
        toast.error(t("calendar.form.error.validation"));
        return;
      }

      try {
        await submitInquiry.mutateAsync({
          name: state.formData.name,
          email: state.formData.email,
          phone: state.formData.phone || null,
          message: state.formData.message,
          checkIn: format(state.startDate, "yyyy-MM-dd"),
          checkOut: format(state.endDate, "yyyy-MM-dd"),
          roomType: residenceName,
          guests: BigInt(state.formData.guests),
          language,
        });

        toast.success(t("calendar.form.success"));

        setResidenceStates((prev) => ({
          ...prev,
          [residenceId]: {
            startDate: null,
            endDate: null,
            formData: {
              name: "",
              email: "",
              phone: "",
              guests: "2",
              message: "",
            },
            errors: {},
          },
        }));
      } catch (_err) {
        toast.error(t("calendar.form.error"));
      }
    },
    [residenceStates, validateForm, submitInquiry, language, t],
  );

  const updateFormData = useCallback(
    (residenceId: string, field: keyof ResidenceFormData, value: string) => {
      setResidenceStates((prev) => ({
        ...prev,
        [residenceId]: {
          ...prev[residenceId],
          formData: {
            ...prev[residenceId].formData,
            [field]: value,
          },
          errors: {
            ...prev[residenceId].errors,
            [field]: "",
          },
        },
      }));
    },
    [],
  );

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
            {t("calendar.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("calendar.subtitle")}
          </p>
        </div>
      </section>

      {/* ── Availability Overview ── */}
      <OverviewSection
        residences={RESIDENCES}
        onScrollToResidence={scrollToResidence}
      />

      {/* ── Per-Residence Calendar Sections ── */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl space-y-16">
          {RESIDENCES.map((residence) => {
            const state = residenceStates[residence.id];
            const hasValidDateRange = state.startDate && state.endDate;

            return (
              <div
                key={residence.id}
                id={residence.id}
                ref={(el) => {
                  sectionRefs.current[residence.id] = el;
                }}
                className="scroll-mt-24"
              >
                <Card className="overflow-hidden mobile-optimized-card">
                  <CardHeader className="bg-muted/30">
                    <CardTitle className="text-2xl md:text-3xl text-center font-serif">
                      {residence.name}
                    </CardTitle>
                    <p className="text-center text-sm text-muted-foreground mt-1">
                      {t("calendar.overview.capacity") || "Up to"}{" "}
                      {residence.capacity}{" "}
                      {t("calendar.overview.guests") || "guests"} &nbsp;·&nbsp;{" "}
                      {t("calendar.overview.minstay") || "Min."}{" "}
                      {residence.minStay}{" "}
                      {t("calendar.overview.nights") || "nights"}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <div className="space-y-8">
                      {/* Calendar */}
                      <div className="flex justify-center">
                        <MinimalistCalendar
                          startDate={state.startDate}
                          endDate={state.endDate}
                          onDateRangeSelect={(start, end) =>
                            handleDateRangeSelect(residence.id, start, end)
                          }
                          className="w-full max-w-lg"
                        />
                      </div>

                      {/* Selected Date Range Display */}
                      {hasValidDateRange &&
                        state.startDate &&
                        state.endDate && (
                          <div className="text-center space-y-2 p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-semibold">
                                {format(state.startDate, "d MMMM", {
                                  locale: de,
                                })}
                              </span>
                              {" – "}
                              <span className="font-semibold">
                                {format(state.endDate, "d MMMM yyyy", {
                                  locale: de,
                                })}
                              </span>
                            </p>
                          </div>
                        )}

                      {/* Booking Form — shown only when date range is selected */}
                      {hasValidDateRange && (
                        <div className="space-y-6 pt-6 border-t">
                          <h3 className="text-xl font-semibold text-center">
                            {t("calendar.form.title")}
                          </h3>
                          <form
                            onSubmit={(e) =>
                              handleSubmit(e, residence.id, residence.name)
                            }
                            className="space-y-4"
                            noValidate
                          >
                            <div className="space-y-2">
                              <Label
                                htmlFor={`${residence.id}-name`}
                                className="text-base"
                              >
                                {t("calendar.form.name")}{" "}
                                <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                id={`${residence.id}-name`}
                                required
                                value={state.formData.name}
                                onChange={(e) =>
                                  updateFormData(
                                    residence.id,
                                    "name",
                                    e.target.value,
                                  )
                                }
                                className={
                                  state.errors.name ? "border-destructive" : ""
                                }
                                aria-invalid={!!state.errors.name}
                                aria-describedby={
                                  state.errors.name
                                    ? `${residence.id}-name-error`
                                    : undefined
                                }
                                data-ocid={`form-name-${residence.id}`}
                              />
                              {state.errors.name && (
                                <p
                                  id={`${residence.id}-name-error`}
                                  className="text-sm text-destructive"
                                >
                                  {state.errors.name}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor={`${residence.id}-email`}
                                className="text-base"
                              >
                                {t("calendar.form.email")}{" "}
                                <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                id={`${residence.id}-email`}
                                type="email"
                                required
                                value={state.formData.email}
                                onChange={(e) =>
                                  updateFormData(
                                    residence.id,
                                    "email",
                                    e.target.value,
                                  )
                                }
                                className={
                                  state.errors.email ? "border-destructive" : ""
                                }
                                aria-invalid={!!state.errors.email}
                                aria-describedby={
                                  state.errors.email
                                    ? `${residence.id}-email-error`
                                    : undefined
                                }
                                data-ocid={`form-email-${residence.id}`}
                              />
                              {state.errors.email && (
                                <p
                                  id={`${residence.id}-email-error`}
                                  className="text-sm text-destructive"
                                >
                                  {state.errors.email}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor={`${residence.id}-phone`}
                                className="text-base"
                              >
                                {t("calendar.form.phone")}
                              </Label>
                              <Input
                                id={`${residence.id}-phone`}
                                type="tel"
                                value={state.formData.phone}
                                onChange={(e) =>
                                  updateFormData(
                                    residence.id,
                                    "phone",
                                    e.target.value,
                                  )
                                }
                                data-ocid={`form-phone-${residence.id}`}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor={`${residence.id}-guests`}
                                className="text-base"
                              >
                                {t("calendar.form.guests")}
                              </Label>
                              <Select
                                value={state.formData.guests}
                                onValueChange={(value) =>
                                  updateFormData(residence.id, "guests", value)
                                }
                              >
                                <SelectTrigger
                                  id={`${residence.id}-guests`}
                                  className="bg-white"
                                  data-ocid={`form-guests-${residence.id}`}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-card border border-border shadow-lg z-50">
                                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                    <SelectItem
                                      key={num}
                                      value={num.toString()}
                                      className="text-foreground hover:bg-accent cursor-pointer"
                                    >
                                      {num}{" "}
                                      {num === 1
                                        ? t("calendar.form.person")
                                        : t("calendar.form.persons")}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor={`${residence.id}-message`}
                                className="text-base"
                              >
                                {t("calendar.form.message")}
                              </Label>
                              <Textarea
                                id={`${residence.id}-message`}
                                rows={4}
                                value={state.formData.message}
                                onChange={(e) =>
                                  updateFormData(
                                    residence.id,
                                    "message",
                                    e.target.value,
                                  )
                                }
                                placeholder={t(
                                  "calendar.form.message.placeholder",
                                )}
                                data-ocid={`form-message-${residence.id}`}
                              />
                            </div>

                            <Button
                              type="submit"
                              className="w-full luxury-cta-button bg-forest-green text-cream hover:bg-forest-green/90 py-6 text-base font-semibold"
                              size="lg"
                              disabled={submitInquiry.isPending}
                              data-ocid={`form-submit-${residence.id}`}
                            >
                              {submitInquiry.isPending
                                ? t("calendar.form.submitting")
                                : t("calendar.form.submit")}
                            </Button>
                          </form>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}

          {/* Note */}
          <div className="mt-12 p-6 bg-muted/50 rounded-lg text-center">
            <p className="text-muted-foreground">{t("calendar.note")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
