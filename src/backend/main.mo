import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import AccessControl "authorization/access-control";
import Float "mo:base/Float";

persistent actor Backend {
  let storage = Storage.new();
  include MixinStorage(storage);

  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);

  type Language = {
    #de;
    #en;
  };

  type BookingInquiry = {
    id : Text;
    name : Text;
    email : Text;
    phone : ?Text;
    message : Text;
    checkIn : Text;
    checkOut : Text;
    roomType : Text;
    guests : Nat;
    timestamp : Int;
    language : Language;
  };

  type ContactMessage = {
    id : Text;
    name : Text;
    email : Text;
    subject : Text;
    message : Text;
    timestamp : Int;
    language : Language;
  };

  type PageContent = {
    title : Text;
    body : Text;
    language : Language;
    lastUpdated : Int;
  };

  type Property = {
    id : Text;
    name : Text;
    subtitle : Text;
    description : Text;
    amenities : [Text];
    capacity : Nat;
    minStay : Nat;
    location : Text;
    images : [Text];
    language : Language;
    lastUpdated : Int;
  };

  type Review = {
    id : Text;
    author : Text;
    content : Text;
    rating : Nat;
    timestamp : Int;
    language : Language;
    residenceId : Text;
  };

  type ReviewToken = {
    id : Text;
    email : Text;
    isValid : Bool;
    issuedAt : Int;
    expiresAt : Int;
    residenceId : Text;
  };

  type UserProfile = {
    name : Text;
    // Add more fields as needed
  };

  type Domicile = {
    id : Text;
    name : Text;
    thumbnail : ?Text;
    description : Text;
    rating : Float;
    reviewCount : Nat;
  };

  type Residence = {
    id : Text;
    name : Text;
    description : Text;
    reviews : [Review];
    reviewTokens : [ReviewToken];
  };

  type CalendarDay = {
    date : Text;
    isAvailable : Bool;
    isSelected : Bool;
    isInRange : Bool;
  };

  type CalendarMonth = {
    year : Int;
    month : Int;
    days : [CalendarDay];
  };

  type DateRange = {
    startDate : ?Text;
    endDate : ?Text;
  };

  type CalendarState = {
    currentMonth : CalendarMonth;
    selectedRange : DateRange;
  };

  type ResidenceCalendar = {
    residenceId : Text;
    calendarState : CalendarState;
  };

  type RatingSummary = {
    averageRating : Float;
    totalReviews : Nat;
  };

  type HouseInfo = {
    id : Text;
    name : Text;
    description : Text;
  };

  var bookingInquiries = textMap.empty<BookingInquiry>();
  var contactMessages = textMap.empty<ContactMessage>();
  var pageContents = textMap.empty<PageContent>();
  var properties = textMap.empty<Property>();
  var reviews = textMap.empty<Review>();
  var reviewTokens = textMap.empty<ReviewToken>();
  var userProfiles = principalMap.empty<UserProfile>();
  var domiciles = textMap.empty<Domicile>();
  var residences = textMap.empty<Residence>();
  var residenceCalendars = textMap.empty<ResidenceCalendar>();

  // Initialize the user system state
  let accessControlState = AccessControl.initState();

  // Initialize auth (first caller becomes admin, others become users)
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    // Admin-only check happens inside
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // Booking Inquiry Management
  // Public: Anyone including guests can submit booking inquiries
  // This is essential for a vacation rental website where potential guests need to inquire
  public shared func submitBookingInquiry(
    name : Text,
    email : Text,
    phone : ?Text,
    message : Text,
    checkIn : Text,
    checkOut : Text,
    roomType : Text,
    guests : Nat,
    language : Language,
  ) : async Text {
    // No authorization check - guests and anonymous users can submit booking inquiries
    // This is a primary conversion point for the vacation rental business

    let id = Text.concat("booking-", debug_show (Time.now()));
    let inquiry : BookingInquiry = {
      id;
      name;
      email;
      phone;
      message;
      checkIn;
      checkOut;
      roomType;
      guests;
      timestamp = Time.now();
      language;
    };
    bookingInquiries := textMap.put(bookingInquiries, id, inquiry);
    id;
  };

  // Contact Message Management
  // Public: Anyone including guests can submit contact messages
  // This is essential for a vacation rental website where potential guests need to contact
  public shared func submitContactMessage(
    name : Text,
    email : Text,
    subject : Text,
    message : Text,
    language : Language,
  ) : async Text {
    // No authorization check - guests and anonymous users can submit contact messages
    // This is a primary conversion point for the vacation rental business

    let id = Text.concat("contact-", debug_show (Time.now()));
    let contact : ContactMessage = {
      id;
      name;
      email;
      subject;
      message;
      timestamp = Time.now();
      language;
    };
    contactMessages := textMap.put(contactMessages, id, contact);
    id;
  };

  // Page Content Management
  // Admin-only: Add or update page content
  public shared ({ caller }) func addOrUpdatePageContent(
    title : Text,
    body : Text,
    language : Language,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can manage page content");
    };

    let id = Text.concat(title, debug_show (language));
    let content : PageContent = {
      title;
      body;
      language;
      lastUpdated = Time.now();
    };
    pageContents := textMap.put(pageContents, id, content);
    id;
  };

  // Public: Get page content for display on website
  public query func getPageContent(title : Text, language : Language) : async ?PageContent {
    let id = Text.concat(title, debug_show (language));
    textMap.get(pageContents, id);
  };

  // Property Management
  // Admin-only: Add or update property information
  public shared ({ caller }) func addOrUpdateProperty(
    id : Text,
    name : Text,
    subtitle : Text,
    description : Text,
    amenities : [Text],
    capacity : Nat,
    minStay : Nat,
    location : Text,
    images : [Text],
    language : Language,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can manage properties");
    };

    let property : Property = {
      id;
      name;
      subtitle;
      description;
      amenities;
      capacity;
      minStay;
      location;
      images;
      language;
      lastUpdated = Time.now();
    };
    properties := textMap.put(properties, id, property);
    id;
  };

  // Public: Get property details for display on website
  public query func getProperty(id : Text) : async ?Property {
    textMap.get(properties, id);
  };

  // Public: Get all properties for display on website
  public query func getAllProperties() : async [Property] {
    Iter.toArray(textMap.vals(properties));
  };

  // Admin-only: View all booking inquiries
  public query ({ caller }) func getAllBookingInquiries() : async [BookingInquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view booking inquiries");
    };
    Iter.toArray(textMap.vals(bookingInquiries));
  };

  // Admin-only: View all contact messages
  public query ({ caller }) func getAllContactMessages() : async [ContactMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view contact messages");
    };
    Iter.toArray(textMap.vals(contactMessages));
  };

  // Review Management

  // Admin-only: Generate review token for a guest
  public shared ({ caller }) func generateReviewToken(
    email : Text,
    residenceId : Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can generate review tokens");
    };

    let id = Text.concat("token-", debug_show (Time.now()));
    let token : ReviewToken = {
      id;
      email;
      isValid = true;
      issuedAt = Time.now();
      expiresAt = Time.now() + 86_400_000_000_000; // 24 hours in nanoseconds
      residenceId;
    };
    reviewTokens := textMap.put(reviewTokens, id, token);
    id;
  };

  // Public: Validate review token (needed for frontend to check token validity)
  public query func validateReviewToken(tokenId : Text, residenceId : Text) : async Bool {
    switch (textMap.get(reviewTokens, tokenId)) {
      case (null) { false };
      case (?token) {
        if (token.isValid and Time.now() < token.expiresAt and token.residenceId == residenceId) {
          true;
        } else {
          false;
        };
      };
    };
  };

  // Admin-only: Invalidate a review token
  public shared ({ caller }) func invalidateReviewToken(tokenId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can invalidate review tokens");
    };

    switch (textMap.get(reviewTokens, tokenId)) {
      case (null) {};
      case (?token) {
        let updatedToken = { token with isValid = false };
        reviewTokens := textMap.put(reviewTokens, tokenId, updatedToken);
      };
    };
  };

  // Public: Anyone can submit reviews directly (including guests/anonymous users)
  // This matches the inline review form behavior where guests can write reviews
  // for each residence without requiring authentication or tokens
  // This is intentional for the vacation rental business model where guest feedback is encouraged
  public shared func addReview(
    author : Text,
    content : Text,
    rating : Nat,
    language : Language,
    residenceId : Text,
  ) : async Text {
    // No authorization check - anyone including guests can submit reviews
    // This enables the inline "Write Review" functionality per residence
    // For a vacation rental site, encouraging reviews from all guests is beneficial

    if (rating < 1 or rating > 5) {
      Debug.trap("Rating must be between 1 and 5 stars");
    };

    let id = Text.concat("review-", debug_show (Time.now()));
    let review : Review = {
      id;
      author;
      content;
      rating;
      timestamp = Time.now();
      language;
      residenceId;
    };
    reviews := textMap.put(reviews, id, review);
    id;
  };

  // Token-based authorization: Guests with valid tokens can submit reviews
  // This is kept for backward compatibility but addReview is the primary method
  public shared func addReviewWithToken(
    tokenId : Text,
    author : Text,
    content : Text,
    rating : Nat,
    language : Language,
    residenceId : Text,
  ) : async Text {
    // Token-based authorization: Valid token is the authorization mechanism
    // This allows guests with valid tokens to submit reviews
    switch (textMap.get(reviewTokens, tokenId)) {
      case (null) { Debug.trap("Invalid review token") };
      case (?token) {
        if (not token.isValid or Time.now() > token.expiresAt or token.residenceId != residenceId) {
          Debug.trap("Expired or invalid review token");
        };

        if (rating < 1 or rating > 5) {
          Debug.trap("Rating must be between 1 and 5 stars");
        };

        let id = Text.concat("review-", debug_show (Time.now()));
        let review : Review = {
          id;
          author;
          content;
          rating;
          timestamp = Time.now();
          language;
          residenceId;
        };
        reviews := textMap.put(reviews, id, review);

        // Invalidate token after use
        let updatedToken = { token with isValid = false };
        reviewTokens := textMap.put(reviewTokens, tokenId, updatedToken);

        id;
      };
    };
  };

  // Public: Get all reviews for display on website
  public query func getAllReviews() : async [Review] {
    Iter.toArray(textMap.vals(reviews));
  };

  // Public: Get reviews by residence for display on website
  public query func getReviewsByResidence(residenceId : Text) : async [Review] {
    let filteredReviews = Iter.toArray(textMap.vals(reviews));
    Array.filter(
      filteredReviews,
      func(review : Review) : Bool {
        review.residenceId == residenceId;
      },
    );
  };

  // Public: Get rating summary for a specific residence
  public query func getRatingSummaryByResidence(residenceId : Text) : async RatingSummary {
    let residenceReviews = Array.filter(
      Iter.toArray(textMap.vals(reviews)),
      func(review : Review) : Bool {
        review.residenceId == residenceId;
      },
    );

    if (residenceReviews.size() == 0) {
      return {
        averageRating = 0.0;
        totalReviews = 0;
      };
    };

    var totalRating = 0;

    for (review in residenceReviews.vals()) {
      totalRating += review.rating;
    };

    let count = residenceReviews.size();

    {
      averageRating = Float.fromInt(totalRating) / Float.fromInt(count);
      totalReviews = count;
    };
  };

  // Admin-only: Delete a review
  // Since reviews don't store the submitter's Principal (only author name as Text),
  // only admins can delete reviews to prevent abuse. This provides proper moderation
  // capabilities while protecting against unauthorized deletions.
  public shared ({ caller }) func deleteReview(reviewId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete reviews");
    };

    switch (textMap.get(reviews, reviewId)) {
      case (null) { Debug.trap("Review not found") };
      case (?review) {
        reviews := textMap.remove(reviews, reviewId).0;
      };
    };
  };

  // Public: Check if review token is valid (needed for frontend validation)
  public query func isValidReviewToken(tokenId : Text, residenceId : Text) : async Bool {
    switch (textMap.get(reviewTokens, tokenId)) {
      case (null) { false };
      case (?token) {
        token.isValid and Time.now() < token.expiresAt and token.residenceId == residenceId;
      };
    };
  };

  // User Profile Management

  // User-only: Get caller's own profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can access their profile");
    };
    principalMap.get(userProfiles, caller);
  };

  // User-only: Save caller's own profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save their profile");
    };
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  // User can view own profile, admin can view any profile
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own profile");
    };
    principalMap.get(userProfiles, user);
  };

  // Domicile Management

  // Admin-only: Add or update domicile information
  public shared ({ caller }) func addOrUpdateDomicile(
    id : Text,
    name : Text,
    thumbnail : ?Text,
    description : Text,
    rating : Float,
    reviewCount : Nat,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can manage domiciles");
    };

    let domicile : Domicile = {
      id;
      name;
      thumbnail;
      description;
      rating;
      reviewCount;
    };
    domiciles := textMap.put(domiciles, id, domicile);
    id;
  };

  // Public: Get domicile details for display on website
  public query func getDomicile(id : Text) : async ?Domicile {
    textMap.get(domiciles, id);
  };

  // Public: Get all domiciles for display on website
  public query func getAllDomiciles() : async [Domicile] {
    Iter.toArray(textMap.vals(domiciles));
  };

  // Admin-only: Initialize default domiciles
  public shared ({ caller }) func initializeDefaultDomiciles() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can initialize default domiciles");
    };

    let defaultDomiciles : [Domicile] = [
      {
        id = "waldhaus-tannenhof";
        name = "Waldhaus Tannenhof";
        thumbnail = ?"waldhaus-tannenhof-thumbnail.jpg";
        description = "Ein luxuriöses Refugium inmitten alter Tannenwälder. Ruhige Eleganz mit handgefertigter Holzausstattung und Panoramablick auf die Schwarzwaldhügel.";
        rating = 0.0;
        reviewCount = 0;
      },
      {
        id = "forsthaus-hirschgrund";
        name = "Forsthaus Hirschgrund";
        thumbnail = ?"forsthaus-hirschgrund-thumbnail.jpg";
        description = "Exklusive Waldvilla in historischer Forsthaus-Tradition. Großzügige Wohnbereiche, Natursteinbad und eigener Wildbeobachtungspunkt.";
        rating = 0.0;
        reviewCount = 0;
      },
      {
        id = "domizil-fichtenberg";
        name = "Domizil Fichtenberg";
        thumbnail = ?"domizil-fichtenberg-thumbnail.jpg";
        description = "Modernes Waldloft mit imposanter Glasfassade. Offene Räume, Designer-Kamin und privater Spa-Bereich mit Waldblick-Terrasse.";
        rating = 0.0;
        reviewCount = 0;
      },
      {
        id = "domizil-schwarzwaldblick";
        name = "Domizil Schwarzwaldblick";
        thumbnail = ?"domizil-schwarzwaldblick-thumbnail.jpg";
        description = "Exklusives Panoramahaus mit Blick auf die Schwarzwaldgipfel. Stilvolle Eichenmöbel, Natursteinböden und direkter Zugang zu Wanderwegen.";
        rating = 0.0;
        reviewCount = 0;
      },
    ];

    for (domicile in defaultDomiciles.vals()) {
      domiciles := textMap.put(domiciles, domicile.id, domicile);
    };
  };

  // Residence Management

  // Admin-only: Add or update residence information
  public shared ({ caller }) func addOrUpdateResidence(
    id : Text,
    name : Text,
    description : Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can manage residences");
    };

    let residence : Residence = {
      id;
      name;
      description;
      reviews = [];
      reviewTokens = [];
    };
    residences := textMap.put(residences, id, residence);
    id;
  };

  // Public: Get residence details for display on website
  public query func getResidence(id : Text) : async ?Residence {
    textMap.get(residences, id);
  };

  // Public: Get all residences for display on website
  public query func getAllResidences() : async [Residence] {
    Iter.toArray(textMap.vals(residences));
  };

  // Admin-only: Initialize default residences
  public shared ({ caller }) func initializeDefaultResidences() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can initialize default residences");
    };

    let defaultResidences : [Residence] = [
      {
        id = "waldhaus-tannenhof";
        name = "Waldhaus Tannenhof";
        description = "Ein luxuriöses Refugium inmitten alter Tannenwälder. Ruhige Eleganz mit handgefertigter Holzausstattung und Panoramablick auf die Schwarzwaldhügel.";
        reviews = [];
        reviewTokens = [];
      },
      {
        id = "forsthaus-hirschgrund";
        name = "Forsthaus Hirschgrund";
        description = "Exklusive Waldvilla in historischer Forsthaus-Tradition. Großzügige Wohnbereiche, Natursteinbad und eigener Wildbeobachtungspunkt.";
        reviews = [];
        reviewTokens = [];
      },
      {
        id = "domizil-fichtenberg";
        name = "Domizil Fichtenberg";
        description = "Modernes Waldloft mit imposanter Glasfassade. Offene Räume, Designer-Kamin und privater Spa-Bereich mit Waldblick-Terrasse.";
        reviews = [];
        reviewTokens = [];
      },
      {
        id = "domizil-schwarzwaldblick";
        name = "Domizil Schwarzwaldblick";
        description = "Exklusives Panoramahaus mit Blick auf die Schwarzwaldgipfel. Stilvolle Eichenmöbel, Natursteinböden und direkter Zugang zu Wanderwegen.";
        reviews = [];
        reviewTokens = [];
      },
    ];

    for (residence in defaultResidences.vals()) {
      residences := textMap.put(residences, residence.id, residence);
    };
  };

  // Unified Calendar Management

  // Admin-only: Update calendar state for a specific residence
  public shared ({ caller }) func updateResidenceCalendar(
    residenceId : Text,
    year : Int,
    month : Int,
    days : [CalendarDay],
    selectedRange : DateRange,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update calendar state");
    };

    let newMonth : CalendarMonth = {
      year;
      month;
      days;
    };

    let newState : CalendarState = {
      currentMonth = newMonth;
      selectedRange;
    };

    let residenceCalendar : ResidenceCalendar = {
      residenceId;
      calendarState = newState;
    };

    residenceCalendars := textMap.put(residenceCalendars, residenceId, residenceCalendar);
  };

  // Public: Get calendar state for a specific residence
  public query func getResidenceCalendar(residenceId : Text) : async ?CalendarState {
    switch (textMap.get(residenceCalendars, residenceId)) {
      case (null) { null };
      case (?residenceCalendar) { ?residenceCalendar.calendarState };
    };
  };

  // Admin-only: Clear calendar state for a specific residence
  public shared ({ caller }) func clearResidenceCalendar(residenceId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can clear calendar state");
    };
    residenceCalendars := textMap.remove(residenceCalendars, residenceId).0;
  };

  // Admin-only: Initialize default calendars for all residences
  public shared ({ caller }) func initializeDefaultCalendars() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can initialize default calendars");
    };

    let defaultResidences : [Text] = [
      "waldhaus-tannenhof",
      "forsthaus-hirschgrund",
      "domizil-fichtenberg",
      "domizil-schwarzwaldblick",
    ];

    for (residenceId in defaultResidences.vals()) {
      let defaultCalendar : ResidenceCalendar = {
        residenceId;
        calendarState = {
          currentMonth = {
            year = 2024;
            month = 1;
            days = [];
          };
          selectedRange = {
            startDate = null;
            endDate = null;
          };
        };
      };
      residenceCalendars := textMap.put(residenceCalendars, residenceId, defaultCalendar);
    };
  };

  // Results area: Get houses meta info
  public query func getHousesInfo() : async [HouseInfo] {
    let houses : [HouseInfo] = [
      {
        id = "waldhaus-tannenhof";
        name = "Waldhaus Tannenhof";
        description = "Ein luxuriöses Refugium inmitten alter Tannenwälder.";
      },
      {
        id = "forsthaus-hirschgrund";
        name = "Forsthaus Hirschgrund";
        description = "Exklusive Waldvilla in historischer Forsthaus-Tradition.";
      },
      {
        id = "domizil-fichtenberg";
        name = "Domizil Fichtenberg";
        description = "Modernes Waldloft mit imposanter Glasfassade.";
      },
      {
        id = "domizil-schwarzwaldblick";
        name = "Domizil Schwarzwaldblick";
        description = "Exklusives Panoramahaus mit Blick auf die Schwarzwaldgipfel.";
      },
    ];
    houses;
  };
};
