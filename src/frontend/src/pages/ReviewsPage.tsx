"use client";

import { useState, useRef } from 'react';
import { Star, Loader2, Trash2, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useGetAllReviews, useGetAllResidences, useAddReview, useDeleteReview, useGetRatingSummaryByResidence } from '../hooks/useQueries';
import { Language } from '../backend';
import { toast } from 'sonner';

type ResidenceId = "waldhaus-tannenhof" | "forsthaus-hirschgrund" | "domizil-fichtenberg" | "domizil-schwarzwaldblick";

interface Review {
  id: string;
  residenceId: ResidenceId;
  name: string;
  email: string;
  stayPeriod: string;
  overallRating: number;
  message: string;
  date: string;
}

interface FormData {
  name: string;
  email: string;
  stayPeriod: string;
  overallRating: number;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  stayPeriod?: string;
  overallRating?: string;
  message?: string;
}

const RESIDENCES = [
  { id: "waldhaus-tannenhof" as ResidenceId, name: "Waldhaus Tannenhof", image: "/assets/generated/waldhaus-tannenhof.dim_1200x800.jpg" },
  { id: "forsthaus-hirschgrund" as ResidenceId, name: "Forsthaus Hirschgrund", image: "/assets/generated/forsthaus-hirschgrund.dim_1200x800.jpg" },
  { id: "domizil-fichtenberg" as ResidenceId, name: "Domizil Fichtenberg", image: "/assets/generated/domizil-fichtenberg.dim_1200x800.jpg" },
  { id: "domizil-schwarzwaldblick" as ResidenceId, name: "Domizil Schwarzwaldblick", image: "/assets/generated/domizil-schwarzwaldblick.dim_1200x800.jpg" },
];

export default function ReviewsPage() {
  const { data: backendReviews = [], isLoading: reviewsLoading } = useGetAllReviews();
  const { data: residences = [], isLoading: residencesLoading } = useGetAllResidences();
  const addReviewMutation = useAddReview();
  const deleteReviewMutation = useDeleteReview();

  const [selectedResidenceId, setSelectedResidenceId] = useState<ResidenceId | null>(null);
  const [localReviews, setLocalReviews] = useState<Record<ResidenceId, Review[]>>({
    "waldhaus-tannenhof": [],
    "forsthaus-hirschgrund": [],
    "domizil-fichtenberg": [],
    "domizil-schwarzwaldblick": [],
  });

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    stayPeriod: '',
    overallRating: 0,
    message: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [hoverRating, setHoverRating] = useState<number>(0);

  const formRef = useRef<HTMLDivElement>(null);

  const handleResidenceClick = (residenceId: ResidenceId) => {
    setSelectedResidenceId(residenceId);
    setFormData({
      name: '',
      email: '',
      stayPeriod: '',
      overallRating: 0,
      message: '',
    });
    setFormErrors({});
    setHoverRating(0);

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name ist erforderlich';
    }

    if (!formData.email.trim()) {
      errors.email = 'E-Mail ist erforderlich';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Ungültiges E-Mail-Format';
    }

    if (!formData.stayPeriod.trim()) {
      errors.stayPeriod = 'Aufenthaltszeitraum ist erforderlich';
    }

    if (!formData.message.trim()) {
      errors.message = 'Nachricht ist erforderlich';
    }

    if (formData.overallRating < 1 || formData.overallRating > 5) {
      errors.overallRating = 'Gesamtbewertung ist erforderlich';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!selectedResidenceId) {
      toast.error('Bitte wählen Sie ein Domizil aus');
      return;
    }

    if (!validateForm()) {
      toast.error('Bitte füllen Sie alle erforderlichen Felder aus');
      return;
    }

    try {
      const reviewId = await addReviewMutation.mutateAsync({
        author: formData.name,
        content: formData.message,
        rating: BigInt(formData.overallRating),
        language: Language.de,
        residenceId: selectedResidenceId,
      });

      const newReview: Review = {
        id: reviewId,
        residenceId: selectedResidenceId,
        name: formData.name,
        email: formData.email,
        stayPeriod: formData.stayPeriod,
        overallRating: formData.overallRating,
        message: formData.message,
        date: new Date().toISOString(),
      };

      setLocalReviews(prev => ({
        ...prev,
        [selectedResidenceId]: [...prev[selectedResidenceId], newReview],
      }));

      toast.success('Vielen Dank für Ihre Bewertung!');

      setFormData({
        name: '',
        email: '',
        stayPeriod: '',
        overallRating: 0,
        message: '',
      });
      setFormErrors({});
      setSelectedResidenceId(null);
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Absenden der Bewertung');
    }
  };

  const handleDelete = async (residenceId: ResidenceId, reviewId: string) => {
    if (!confirm('Diese Bewertung entfernen?')) return;

    try {
      await deleteReviewMutation.mutateAsync(reviewId);
      setLocalReviews(prev => ({
        ...prev,
        [residenceId]: prev[residenceId].filter(r => r.id !== reviewId),
      }));
      toast.success('Bewertung entfernt');
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Löschen der Bewertung');
    }
  };

  const getAllReviewsForResidence = (residenceId: ResidenceId): Review[] => {
    const backendReviewsForResidence = backendReviews
      .filter(r => r.residenceId === residenceId)
      .map(r => ({
        id: r.id,
        residenceId: residenceId,
        name: r.author,
        email: '',
        stayPeriod: '',
        overallRating: Number(r.rating),
        message: r.content,
        date: new Date(Number(r.timestamp) / 1000000).toISOString(),
      }));

    return [...backendReviewsForResidence, ...localReviews[residenceId]];
  };

  const selectedResidence = RESIDENCES.find(r => r.id === selectedResidenceId);

  if (residencesLoading || reviewsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#0F3D2E]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-32 pb-16 md:pb-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl text-center font-serif text-black font-semibold">
            Gästebewertungen
          </h1>
          <p className="text-center mt-4 max-w-2xl mx-auto text-gray-600 font-sans">
            Entdecken Sie, was unsere Gäste über ihre unvergesslichen Aufenthalte in unseren exklusiven Domizilen im Schwarzwald zu sagen haben.
          </p>
        </div>
      </section>

      {/* Residence Cards Grid */}
      <section className="pb-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {RESIDENCES.map((residence) => {
              const reviews = getAllReviewsForResidence(residence.id);
              return (
                <div
                  key={residence.id}
                  className="group cursor-pointer"
                  onClick={() => handleResidenceClick(residence.id)}
                >
                  <div className="rounded-lg overflow-hidden mb-4 transition-transform duration-300 group-hover:scale-105 border border-gray-200 aspect-[4/3]">
                    <img
                      src={residence.image}
                      alt={residence.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="mb-2 font-serif text-black font-semibold text-lg">
                    {residence.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-[#0F3D2E] stroke-[#0F3D2E]"
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm font-sans">
                      ({reviews.length} {reviews.length === 1 ? 'Bewertung' : 'Bewertungen'})
                    </span>
                  </div>
                  <button
                    className="flex items-center gap-2 text-[#0F3D2E] text-sm font-medium font-sans transition-all group-hover:gap-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResidenceClick(residence.id);
                    }}
                  >
                    Bewertung schreiben
                    <ArrowRight className="h-4 w-4 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Review Form */}
      {selectedResidenceId && selectedResidence && (
        <section className="pb-16 px-4 md:px-6 opacity-0 animate-fade-in" ref={formRef}>
          <div className="max-w-4xl mx-auto">
            <div className="rounded-lg bg-white border border-black p-8 md:p-10">
              {/* Residence Image */}
              <div className="rounded-lg overflow-hidden mb-6 border border-gray-200 aspect-[4/3]">
                <img
                  src={selectedResidence.image}
                  alt={selectedResidence.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Heading */}
              <h3 className="mb-6 font-serif text-black font-semibold text-2xl">
                Bewertung schreiben für {selectedResidence.name}
              </h3>

              <div className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="block mb-2 font-sans text-black text-sm font-medium">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ihr Name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border-gray-200 rounded font-sans"
                    />
                    {formErrors.name && (
                      <p className="text-red-600 text-sm mt-1 font-sans">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="block mb-2 font-sans text-black text-sm font-medium">
                      E-Mail *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ihre@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full border-gray-200 rounded font-sans"
                    />
                    {formErrors.email && (
                      <p className="text-red-600 text-sm mt-1 font-sans">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Stay Period */}
                <div>
                  <Label htmlFor="stayPeriod" className="block mb-2 font-sans text-black text-sm font-medium">
                    Aufenthaltszeitraum *
                  </Label>
                  <Input
                    id="stayPeriod"
                    type="text"
                    placeholder="z.B. Oktober 2024"
                    value={formData.stayPeriod}
                    onChange={(e) => setFormData(prev => ({ ...prev, stayPeriod: e.target.value }))}
                    className="w-full border-gray-200 rounded font-sans"
                  />
                  {formErrors.stayPeriod && (
                    <p className="text-red-600 text-sm mt-1 font-sans">{formErrors.stayPeriod}</p>
                  )}
                </div>

                {/* Overall Rating */}
                <div>
                  <Label className="block mb-2 font-sans text-black text-sm font-medium">
                    Gesamtbewertung *
                  </Label>
                  <InteractiveStarRating
                    value={formData.overallRating}
                    onChange={(rating) => setFormData(prev => ({ ...prev, overallRating: rating }))}
                    hoverValue={hoverRating}
                    onHoverChange={setHoverRating}
                  />
                  {formErrors.overallRating && (
                    <p className="text-red-600 text-sm mt-1 font-sans">{formErrors.overallRating}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message" className="block mb-2 font-sans text-black text-sm font-medium">
                    Teilen Sie Ihre Erfahrung mit… *
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Erzählen Sie uns von Ihrem Aufenthalt..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full resize-none border-gray-200 rounded font-sans"
                  />
                  {formErrors.message && (
                    <p className="text-red-600 text-sm mt-1 font-sans">{formErrors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={addReviewMutation.isPending}
                  className="w-full md:w-auto bg-[#0F3D2E] hover:bg-[#0C3226] text-white font-sans font-semibold px-10 py-3 rounded transition-all"
                >
                  {addReviewMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                      Wird gesendet...
                    </>
                  ) : (
                    'Bewertung absenden'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Individual Residence Review Sections */}
      <section className="pb-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-20">
          {RESIDENCES.map((residence) => {
            const reviews = getAllReviewsForResidence(residence.id);
            return (
              <ResidenceReviewSection
                key={residence.id}
                residenceId={residence.id}
                residenceName={residence.name}
                reviews={reviews}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      </section>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

interface InteractiveStarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  hoverValue: number;
  onHoverChange: (rating: number) => void;
  size?: 'sm' | 'md';
}

function InteractiveStarRating({ value, onChange, hoverValue, onHoverChange, size = 'md' }: InteractiveStarRatingProps) {
  const starSize = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8';

  return (
    <div className="flex gap-2" onMouseLeave={() => onHoverChange(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => onHoverChange(star)}
          className="focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] rounded transition-transform hover:scale-110"
          aria-label={`${star} Sterne bewerten`}
        >
          <Star
            className={`${starSize} transition-all duration-200 ${
              star <= (hoverValue || value)
                ? 'fill-[#0F3D2E] stroke-[#0F3D2E]'
                : 'fill-none stroke-black'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

interface ResidenceReviewSectionProps {
  residenceId: ResidenceId;
  residenceName: string;
  reviews: Review[];
  onDelete: (residenceId: ResidenceId, reviewId: string) => void;
}

function ResidenceReviewSection({ residenceId, residenceName, reviews, onDelete }: ResidenceReviewSectionProps) {
  const { data: ratingSummary } = useGetRatingSummaryByResidence(residenceId);

  const calculateLocalRatingSummary = () => {
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
      };
    }

    const totalRating = reviews.reduce((acc, review) => acc + review.overallRating, 0);
    const count = reviews.length;

    return {
      averageRating: totalRating / count,
      totalReviews: count,
    };
  };

  const summary = calculateLocalRatingSummary();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div id={`residence-${residenceId}`}>
      {/* Residence Name */}
      <h2 className="mb-6 font-serif text-black font-semibold text-3xl">
        {residenceName}
      </h2>

      {/* Rating Summary */}
      {summary.totalReviews > 0 && (
        <div className="rounded-lg bg-white border border-black p-8 mb-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-2 font-serif text-black font-semibold text-5xl">
              {summary.averageRating.toFixed(1)}
            </div>
            <div className="flex gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(summary.averageRating)
                      ? 'fill-[#0F3D2E] stroke-[#0F3D2E]'
                      : 'fill-none stroke-black'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600 text-sm font-sans">
              Basierend auf {summary.totalReviews} {summary.totalReviews === 1 ? 'Bewertung' : 'Bewertungen'}
            </p>
          </div>
        </div>
      )}

      {/* Reviews Display */}
      <div>
        <h4 className="mb-6 font-serif text-black font-semibold text-xl">
          Bewertungen ({reviews.length})
        </h4>

        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg bg-white border border-black p-6 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-sans text-black text-base font-semibold mb-1">
                        {review.name}
                      </p>
                      {review.stayPeriod && (
                        <p className="font-sans text-gray-500 text-sm mb-1">
                          {review.stayPeriod}
                        </p>
                      )}
                      <p className="font-sans text-gray-400 text-sm">
                        {formatDate(review.date)}
                      </p>
                    </div>
                    <button
                      onClick={() => onDelete(residenceId, review.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Bewertung löschen"
                      aria-label="Bewertung löschen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: review.overallRating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#0F3D2E] stroke-[#0F3D2E]" />
                    ))}
                  </div>

                  <p className="font-sans text-gray-700 text-sm leading-relaxed">
                    {review.message}
                  </p>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-center py-8 font-sans text-gray-400 text-sm italic">
            Noch keine Bewertungen für dieses Domizil.
          </p>
        )}
      </div>
    </div>
  );
}
