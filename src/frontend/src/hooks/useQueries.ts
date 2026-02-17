import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Language, type BookingInquiry, type ContactMessage, type Review, type Domicile, type Residence, type RatingSummary } from '../backend';

export function useSubmitBookingInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string | null;
      message: string;
      checkIn: string;
      checkOut: string;
      roomType: string;
      guests: bigint;
      language: Language;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.submitBookingInquiry(
        data.name,
        data.email,
        data.phone,
        data.message,
        data.checkIn,
        data.checkOut,
        data.roomType,
        data.guests,
        data.language
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingInquiries'] });
    },
  });
}

export function useSubmitContactMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      subject: string;
      message: string;
      language: Language;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.submitContactMessage(
        data.name,
        data.email,
        data.subject,
        data.message,
        data.language
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
    },
  });
}

export function useGetAllBookingInquiries() {
  const { actor, isFetching } = useActor();

  return useQuery<BookingInquiry[]>({
    queryKey: ['bookingInquiries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookingInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllContactMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactMessage[]>({
    queryKey: ['contactMessages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContactMessages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllReviews() {
  const { actor, isFetching } = useActor();

  return useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReviews();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllDomiciles() {
  const { actor, isFetching } = useActor();

  return useQuery<Domicile[]>({
    queryKey: ['domiciles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDomiciles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllResidences() {
  const { actor, isFetching } = useActor();

  return useQuery<Residence[]>({
    queryKey: ['residences'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllResidences();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRatingSummaryByResidence(residenceId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<RatingSummary>({
    queryKey: ['ratingSummary', residenceId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getRatingSummaryByResidence(residenceId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGenerateReviewToken() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: { email: string; residenceId: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.generateReviewToken(data.email, data.residenceId);
    },
  });
}

export function useValidateReviewToken() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: { tokenId: string; residenceId: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.validateReviewToken(data.tokenId, data.residenceId);
    },
  });
}

export function useAddReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      author: string;
      content: string;
      rating: bigint;
      language: Language;
      residenceId: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addReview(
        data.author,
        data.content,
        data.rating,
        data.language,
        data.residenceId
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['residences'] });
      queryClient.invalidateQueries({ queryKey: ['domiciles'] });
      queryClient.invalidateQueries({ queryKey: ['ratingSummary', variables.residenceId] });
    },
  });
}

export function useAddReviewWithToken() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      tokenId: string;
      author: string;
      content: string;
      rating: bigint;
      language: Language;
      residenceId: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addReviewWithToken(
        data.tokenId,
        data.author,
        data.content,
        data.rating,
        data.language,
        data.residenceId
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['residences'] });
      queryClient.invalidateQueries({ queryKey: ['domiciles'] });
      queryClient.invalidateQueries({ queryKey: ['ratingSummary', variables.residenceId] });
    },
  });
}

export function useDeleteReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteReview(reviewId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['residences'] });
      queryClient.invalidateQueries({ queryKey: ['domiciles'] });
      queryClient.invalidateQueries({ queryKey: ['ratingSummary'] });
    },
  });
}
