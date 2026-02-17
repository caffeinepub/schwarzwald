import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface Review {
    id: string;
    content: string;
    author: string;
    language: Language;
    timestamp: bigint;
    residenceId: string;
    rating: bigint;
}
export interface Residence {
    id: string;
    reviews: Array<Review>;
    name: string;
    description: string;
    reviewTokens: Array<ReviewToken>;
}
export interface CalendarDay {
    isSelected: boolean;
    date: string;
    isAvailable: boolean;
    isInRange: boolean;
}
export interface ReviewToken {
    id: string;
    expiresAt: bigint;
    email: string;
    residenceId: string;
    issuedAt: bigint;
    isValid: boolean;
}
export interface CalendarState {
    currentMonth: CalendarMonth;
    selectedRange: DateRange;
}
export interface BookingInquiry {
    id: string;
    checkIn: string;
    name: string;
    email: string;
    language: Language;
    message: string;
    timestamp: bigint;
    checkOut: string;
    phone?: string;
    guests: bigint;
    roomType: string;
}
export interface CalendarMonth {
    month: bigint;
    days: Array<CalendarDay>;
    year: bigint;
}
export interface Property {
    id: string;
    minStay: bigint;
    name: string;
    lastUpdated: bigint;
    description: string;
    amenities: Array<string>;
    language: Language;
    capacity: bigint;
    location: string;
    subtitle: string;
    images: Array<string>;
}
export interface DateRange {
    endDate?: string;
    startDate?: string;
}
export interface HouseInfo {
    id: string;
    name: string;
    description: string;
}
export interface ContactMessage {
    id: string;
    subject: string;
    name: string;
    email: string;
    language: Language;
    message: string;
    timestamp: bigint;
}
export interface PageContent {
    title: string;
    body: string;
    lastUpdated: bigint;
    language: Language;
}
export interface Domicile {
    id: string;
    thumbnail?: string;
    name: string;
    description: string;
    rating: number;
    reviewCount: bigint;
}
export interface RatingSummary {
    averageRating: number;
    totalReviews: bigint;
}
export enum Language {
    de = "de",
    en = "en"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addOrUpdateDomicile(id: string, name: string, thumbnail: string | null, description: string, rating: number, reviewCount: bigint): Promise<string>;
    addOrUpdatePageContent(title: string, body: string, language: Language): Promise<string>;
    addOrUpdateProperty(id: string, name: string, subtitle: string, description: string, amenities: Array<string>, capacity: bigint, minStay: bigint, location: string, images: Array<string>, language: Language): Promise<string>;
    addOrUpdateResidence(id: string, name: string, description: string): Promise<string>;
    addReview(author: string, content: string, rating: bigint, language: Language, residenceId: string): Promise<string>;
    addReviewWithToken(tokenId: string, author: string, content: string, rating: bigint, language: Language, residenceId: string): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearResidenceCalendar(residenceId: string): Promise<void>;
    deleteReview(reviewId: string): Promise<void>;
    generateReviewToken(email: string, residenceId: string): Promise<string>;
    getAllBookingInquiries(): Promise<Array<BookingInquiry>>;
    getAllContactMessages(): Promise<Array<ContactMessage>>;
    getAllDomiciles(): Promise<Array<Domicile>>;
    getAllProperties(): Promise<Array<Property>>;
    getAllResidences(): Promise<Array<Residence>>;
    getAllReviews(): Promise<Array<Review>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDomicile(id: string): Promise<Domicile | null>;
    getHousesInfo(): Promise<Array<HouseInfo>>;
    getPageContent(title: string, language: Language): Promise<PageContent | null>;
    getProperty(id: string): Promise<Property | null>;
    getRatingSummaryByResidence(residenceId: string): Promise<RatingSummary>;
    getResidence(id: string): Promise<Residence | null>;
    getResidenceCalendar(residenceId: string): Promise<CalendarState | null>;
    getReviewsByResidence(residenceId: string): Promise<Array<Review>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    initializeDefaultCalendars(): Promise<void>;
    initializeDefaultDomiciles(): Promise<void>;
    initializeDefaultResidences(): Promise<void>;
    invalidateReviewToken(tokenId: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isValidReviewToken(tokenId: string, residenceId: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitBookingInquiry(name: string, email: string, phone: string | null, message: string, checkIn: string, checkOut: string, roomType: string, guests: bigint, language: Language): Promise<string>;
    submitContactMessage(name: string, email: string, subject: string, message: string, language: Language): Promise<string>;
    updateResidenceCalendar(residenceId: string, year: bigint, month: bigint, days: Array<CalendarDay>, selectedRange: DateRange): Promise<void>;
    validateReviewToken(tokenId: string, residenceId: string): Promise<boolean>;
}
