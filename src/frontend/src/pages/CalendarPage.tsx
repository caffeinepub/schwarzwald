import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '../contexts/LanguageContext';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { toast } from 'sonner';
import { useSubmitBookingInquiry } from '../hooks/useQueries';
import MinimalistCalendar from '../components/MinimalistCalendar';

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

const RESIDENCES = [
  {
    id: 'waldhaus-tannenhof',
    name: 'Waldhaus Tannenhof',
  },
  {
    id: 'forsthaus-hirschgrund',
    name: 'Forsthaus Hirschgrund',
  },
  {
    id: 'domizil-fichtenberg',
    name: 'Domizil Fichtenberg',
  },
  {
    id: 'domizil-schwarzwaldblick',
    name: 'Domizil Schwarzwaldblick',
  },
];

export default function CalendarPage() {
  const { language, t } = useLanguage();
  const submitInquiry = useSubmitBookingInquiry();

  // State for each residence
  const [residenceStates, setResidenceStates] = useState<Record<string, ResidenceState>>(
    RESIDENCES.reduce((acc, residence) => ({
      ...acc,
      [residence.id]: {
        startDate: null,
        endDate: null,
        formData: {
          name: '',
          email: '',
          phone: '',
          guests: '2',
          message: '',
        },
        errors: {},
      },
    }), {})
  );

  const handleDateRangeSelect = useCallback((residenceId: string, start: Date | null, end: Date | null) => {
    setResidenceStates(prev => ({
      ...prev,
      [residenceId]: {
        ...prev[residenceId],
        startDate: start,
        endDate: end,
      },
    }));
  }, []);

  const validateForm = useCallback((residenceId: string) => {
    const state = residenceStates[residenceId];
    const newErrors: Record<string, string> = {};

    if (!state.formData.name.trim()) {
      newErrors.name = t('calendar.form.error.name');
    }

    if (!state.formData.email.trim()) {
      newErrors.email = t('calendar.form.error.email');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.formData.email)) {
      newErrors.email = t('calendar.form.error.email.invalid');
    }

    setResidenceStates(prev => ({
      ...prev,
      [residenceId]: {
        ...prev[residenceId],
        errors: newErrors,
      },
    }));

    return Object.keys(newErrors).length === 0;
  }, [residenceStates, t]);

  const handleSubmit = useCallback(async (e: React.FormEvent, residenceId: string, residenceName: string) => {
    e.preventDefault();

    const state = residenceStates[residenceId];

    if (!state.startDate || !state.endDate) {
      toast.error(t('calendar.form.error.validation'));
      return;
    }

    if (!validateForm(residenceId)) {
      toast.error(t('calendar.form.error.validation'));
      return;
    }

    try {
      await submitInquiry.mutateAsync({
        name: state.formData.name,
        email: state.formData.email,
        phone: state.formData.phone || null,
        message: state.formData.message,
        checkIn: format(state.startDate, 'yyyy-MM-dd'),
        checkOut: format(state.endDate, 'yyyy-MM-dd'),
        roomType: residenceName,
        guests: BigInt(state.formData.guests),
        language,
      });

      toast.success(t('calendar.form.success'));
      
      // Reset form and dates for this residence
      setResidenceStates(prev => ({
        ...prev,
        [residenceId]: {
          startDate: null,
          endDate: null,
          formData: {
            name: '',
            email: '',
            phone: '',
            guests: '2',
            message: '',
          },
          errors: {},
        },
      }));
    } catch (error) {
      toast.error(t('calendar.form.error'));
    }
  }, [residenceStates, validateForm, submitInquiry, language, t]);

  const updateFormData = useCallback((residenceId: string, field: keyof ResidenceFormData, value: string) => {
    setResidenceStates(prev => ({
      ...prev,
      [residenceId]: {
        ...prev[residenceId],
        formData: {
          ...prev[residenceId].formData,
          [field]: value,
        },
        errors: {
          ...prev[residenceId].errors,
          [field]: '',
        },
      },
    }));
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
            {t('calendar.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('calendar.subtitle')}
          </p>
        </div>
      </section>

      {/* Residences Calendar Content */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl space-y-16">
          {RESIDENCES.map((residence) => {
            const state = residenceStates[residence.id];
            const hasValidDateRange = state.startDate && state.endDate;

            return (
              <Card key={residence.id} className="overflow-hidden mobile-optimized-card">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="text-2xl md:text-3xl text-center font-serif">
                    {residence.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-8">
                  <div className="space-y-8">
                    {/* Calendar for this residence */}
                    <div className="flex justify-center">
                      <MinimalistCalendar
                        startDate={state.startDate}
                        endDate={state.endDate}
                        onDateRangeSelect={(start, end) => handleDateRangeSelect(residence.id, start, end)}
                        className="w-full max-w-lg"
                      />
                    </div>

                    {/* Selected Date Range Display */}
                    {hasValidDateRange && state.startDate && state.endDate && (
                      <div className="text-center space-y-2 p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">
                            {format(state.startDate, 'd MMMM', { locale: de })}
                          </span>
                          {' – '}
                          <span className="font-semibold">
                            {format(state.endDate, 'd MMMM yyyy', { locale: de })}
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Booking Form - Only shown when date range is selected */}
                    {hasValidDateRange && (
                      <div className="space-y-6 pt-6 border-t">
                        <h3 className="text-xl font-semibold text-center">{t('calendar.form.title')}</h3>
                        <form onSubmit={(e) => handleSubmit(e, residence.id, residence.name)} className="space-y-4" noValidate>
                          <div className="space-y-2">
                            <Label htmlFor={`${residence.id}-name`} className="text-base">
                              {t('calendar.form.name')} <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id={`${residence.id}-name`}
                              required
                              value={state.formData.name}
                              onChange={(e) => updateFormData(residence.id, 'name', e.target.value)}
                              className={state.errors.name ? 'border-destructive' : ''}
                              aria-invalid={!!state.errors.name}
                              aria-describedby={state.errors.name ? `${residence.id}-name-error` : undefined}
                            />
                            {state.errors.name && (
                              <p id={`${residence.id}-name-error`} className="text-sm text-destructive">
                                {state.errors.name}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`${residence.id}-email`} className="text-base">
                              {t('calendar.form.email')} <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id={`${residence.id}-email`}
                              type="email"
                              required
                              value={state.formData.email}
                              onChange={(e) => updateFormData(residence.id, 'email', e.target.value)}
                              className={state.errors.email ? 'border-destructive' : ''}
                              aria-invalid={!!state.errors.email}
                              aria-describedby={state.errors.email ? `${residence.id}-email-error` : undefined}
                            />
                            {state.errors.email && (
                              <p id={`${residence.id}-email-error`} className="text-sm text-destructive">
                                {state.errors.email}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`${residence.id}-phone`} className="text-base">
                              {t('calendar.form.phone')}
                            </Label>
                            <Input
                              id={`${residence.id}-phone`}
                              type="tel"
                              value={state.formData.phone}
                              onChange={(e) => updateFormData(residence.id, 'phone', e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`${residence.id}-guests`} className="text-base">
                              {t('calendar.form.guests')}
                            </Label>
                            <Select
                              value={state.formData.guests}
                              onValueChange={(value) => updateFormData(residence.id, 'guests', value)}
                            >
                              <SelectTrigger id={`${residence.id}-guests`} className="bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                  <SelectItem 
                                    key={num} 
                                    value={num.toString()}
                                    className="text-black hover:bg-gray-100 cursor-pointer"
                                  >
                                    {num} {num === 1 ? t('calendar.form.person') : t('calendar.form.persons')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`${residence.id}-message`} className="text-base">
                              {t('calendar.form.message')}
                            </Label>
                            <Textarea
                              id={`${residence.id}-message`}
                              rows={4}
                              value={state.formData.message}
                              onChange={(e) => updateFormData(residence.id, 'message', e.target.value)}
                              placeholder={t('calendar.form.message.placeholder')}
                            />
                          </div>

                          <Button
                            type="submit"
                            className="w-full luxury-cta-button bg-forest-green text-cream hover:bg-forest-green/90 py-6 text-base font-semibold"
                            size="lg"
                            disabled={submitInquiry.isPending}
                          >
                            {submitInquiry.isPending ? t('calendar.form.submitting') : t('calendar.form.submit')}
                          </Button>
                        </form>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Note */}
          <div className="mt-12 p-6 bg-muted/50 rounded-lg text-center">
            <p className="text-muted-foreground">
              {t('calendar.note')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
