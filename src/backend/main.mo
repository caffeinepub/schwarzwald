import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Migration "migration";

(with migration = Migration.run)
actor Backend {

  // ── Access Control ──────────────────────────────────────────────────────────

  type UserRole = {
    #admin;
    #user;
    #guest;
  };

  type AccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, UserRole>;
  };

  func initAccessControl() : AccessControlState {
    {
      var adminAssigned = false;
      userRoles = Map.empty<Principal, UserRole>();
    };
  };

  func acHasPermission(state : AccessControlState, caller : Principal, required : UserRole) : Bool {
    switch (state.userRoles.get(caller)) {
      case (null) {
        // anonymous caller has guest access only
        switch (required) { case (#guest) true; case _ false };
      };
      case (?#admin) true; // admin has all permissions
      case (?#user) {
        switch (required) { case (#admin) false; case _ true };
      };
      case (?#guest) {
        switch (required) { case (#guest) true; case _ false };
      };
    };
  };

  func acIsAdmin(state : AccessControlState, caller : Principal) : Bool {
    switch (state.userRoles.get(caller)) {
      case (?#admin) true;
      case _ false;
    };
  };

  func acInitialize(state : AccessControlState, caller : Principal) {
    if (not state.adminAssigned) {
      state.userRoles.add(caller, #admin);
      state.adminAssigned := true;
    };
  };

  func acAssignRole(state : AccessControlState, caller : Principal, user : Principal, role : UserRole) {
    if (not acIsAdmin(state, caller)) {
      Runtime.trap("Unauthorized: Only admins can assign roles");
    };
    state.userRoles.add(user, role);
  };

  func acGetUserRole(state : AccessControlState, caller : Principal) : UserRole {
    switch (state.userRoles.get(caller)) {
      case (?role) role;
      case null #guest;
    };
  };

  // ── Domain Types ─────────────────────────────────────────────────────────────

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

  // ── State ────────────────────────────────────────────────────────────────────

  let bookingInquiries = Map.empty<Text, BookingInquiry>();
  let contactMessages = Map.empty<Text, ContactMessage>();
  let pageContents = Map.empty<Text, PageContent>();
  let properties = Map.empty<Text, Property>();
  let reviews = Map.empty<Text, Review>();
  let reviewTokens = Map.empty<Text, ReviewToken>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let domiciles = Map.empty<Text, Domicile>();
  let residences = Map.empty<Text, Residence>();
  let residenceCalendars = Map.empty<Text, ResidenceCalendar>();

  let accessControlState = initAccessControl();

  // ── Access Control API ───────────────────────────────────────────────────────

  public shared ({ caller }) func initializeAccessControl() : async () {
    acInitialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async UserRole {
    acGetUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : UserRole) : async () {
    acAssignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    acIsAdmin(accessControlState, caller);
  };

  // ── Booking Inquiries ─────────────────────────────────────────────────────────

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
    let id = "booking-" # debug_show (Time.now());
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
    bookingInquiries.add(id, inquiry);
    id;
  };

  public query ({ caller }) func getAllBookingInquiries() : async [BookingInquiry] {
    if (not acHasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view booking inquiries");
    };
    bookingInquiries.values().toArray();
  };

  // ── Contact Messages ──────────────────────────────────────────────────────────

  public shared func submitContactMessage(
    name : Text,
    email : Text,
    subject : Text,
    message : Text,
    language : Language,
  ) : async Text {
    let id = "contact-" # debug_show (Time.now());
    let contact : ContactMessage = {
      id;
      name;
      email;
      subject;
      message;
      timestamp = Time.now();
      language;
    };
    contactMessages.add(id, contact);
    id;
  };

  public query ({ caller }) func getAllContactMessages() : async [ContactMessage] {
    if (not acHasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view contact messages");
    };
    contactMessages.values().toArray();
  };

  // ── Page Content ──────────────────────────────────────────────────────────────

  public shared ({ caller }) func addOrUpdatePageContent(
    title : Text,
    body : Text,
    language : Language,
  ) : async Text {
    if (not acHasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can manage page content");
    };
    let id = title # debug_show (language);
    let content : PageContent = {
      title;
      body;
      language;
      lastUpdated = Time.now();
    };
    pageContents.add(id, content);
    id;
  };

  public query func getPageContent(title : Text, language : Language) : async ?PageContent {
    let id = title # debug_show (language);
    pageContents.get(id);
  };

  // ── Properties ────────────────────────────────────────────────────────────────

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
    if (not acHasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can manage properties");
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
    properties.add(id, property);
    id;
  };

  public query func getProperty(id : Text) : async ?Property {
    properties.get(id);
  };

  public query func getAllProperties() : async [Property] {
    properties.values().toArray();
  };

  // ── Reviews ───────────────────────────────────────────────────────────────────

  public shared ({ caller }) func generateReviewToken(
    email : Text,
    residenceId : Text,
  ) : async Text {
    if (not acHasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can generate review tokens");
    };
    let id = "token-" # debug_show (Time.now());
    let token : ReviewToken = {
      id;
      email;
      isValid = true;
      issuedAt = Time.now();
      expiresAt = Time.now() + 86_400_000_000_000;
      residenceId;
    };
    reviewTokens.add(id, token);
    id;
  };

  public query func validateReviewToken(tokenId : Text, residenceId : Text) : async Bool {
    switch (reviewTokens.get(tokenId)) {
      case (null) false;
      case (?token) {
        token.isValid and Time.now() < token.expiresAt and token.residenceId == residenceId;
      };
    };
  };

  public shared ({ caller }) func invalidateReviewToken(tokenId : Text) : async () {
    if (not acHasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can invalidate review tokens");
    };
    switch (reviewTokens.get(tokenId)) {
      case (null) {};
      case (?token) {
        reviewTokens.add(tokenId, { token with isValid = false });
      };
    };
  };

  public shared func addReview(
    author : Text,
    content : Text,
    rating : Nat,
    language : Language,
    residenceId : Text,
  ) : async Text {
    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5 stars");
    };
    let id = "review-" # debug_show (Time.now());
    let review : Review = {
      id;
      author;
      content;
      rating;
      timestamp = Time.now();
      language;
      residenceId;
    };
    reviews.add(id, review);
    id;
  };

  public shared func addReviewWithToken(
    tokenId : Text,
    author : Text,
    content : Text,
    rating : Nat,
    language : Language,
    residenceId : Text,
  ) : async Text {
    switch (reviewTokens.get(tokenId)) {
      case (null) { Runtime.trap("Invalid review token") };
      case (?token) {
        if (not token.isValid or Time.now() > token.expiresAt or token.residenceId != residenceId) {
          Runtime.trap("Expired or invalid review token");
        };
        if (rating < 1 or rating > 5) {
          Runtime.trap("Rating must be between 1 and 5 stars");
        };
        let id = "review-" # debug_show (Time.now());
        let review : Review = {
          id;
          author;
          content;
          rating;
          timestamp = Time.now();
          language;
          residenceId;
        };
        reviews.add(id, review);
        reviewTokens.add(tokenId, { token with isValid = false });
        id;
      };
    };
  };

  public query func getAllReviews() : async [Review] {
    reviews.values().toArray();
  };

  public query func getReviewsByResidence(residenceId : Text) : async [Review] {
    reviews.values().toArray().filter(func(r : Review) : Bool {
      r.residenceId == residenceId
    });
  };

  public query func getRatingSummaryByResidence(residenceId : Text) : async RatingSummary {
    let residenceReviews = reviews.values().toArray().filter(func(r : Review) : Bool {
      r.residenceId == residenceId
    });
    if (residenceReviews.size() == 0) {
      return { averageRating = 0.0; totalReviews = 0 };
    };
    var totalRating = 0;
    for (review in residenceReviews.values()) {
      totalRating += review.rating;
    };
    let count = residenceReviews.size();
    {
      averageRating = totalRating.toFloat() / count.toFloat();
      totalReviews = count;
    };
  };

  public shared ({ caller }) func deleteReview(reviewId : Text) : async () {
    if (not acHasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete reviews");
    };
    switch (reviews.get(reviewId)) {
      case (null) { Runtime.trap("Review not found") };
      case (?_) { reviews.remove(reviewId) };
    };
  };

  public query func isValidReviewToken(tokenId : Text, residenceId : Text) : async Bool {
    switch (reviewTokens.get(tokenId)) {
      case (null) false;
      case (?token) {
        token.isValid and Time.now() < token.expiresAt and token.residenceId == residenceId;
      };
    };
  };

  // ── User Profiles ─────────────────────────────────────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not acHasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access their profile");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not acHasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save their profile");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not acIsAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // ── Domiciles ─────────────────────────────────────────────────────────────────

  public shared ({ caller }) func addOrUpdateDomicile(
    id : Text,
    name : Text,
    thumbnail : ?Text,
    description : Text,
    rating : Float,
    reviewCount : Nat,
  ) : async Text {
    if (not acHasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can manage domiciles");
    };
    let domicile : Domicile = {
      id;
      name;
      thumbnail;
      description;
      rating;
      reviewCount;
    };
    domiciles.add(id, domicile);
    id;
  };

  public query func getDomicile(id : Text) : async ?Domicile {
    domiciles.get(id);
  };

  public query func getAllDomiciles() : async [Domicile] {
    domiciles.values().toArray();
  };

  public shared ({ caller }) func initializeDefaultDomiciles() : async () {
    if (not acHasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can initialize default domiciles");
    };
    let defaults : [Domicile] = [
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
    for (d in defaults.values()) {
      domiciles.add(d.id, d);
    };
  };

  // ── Residences ────────────────────────────────────────────────────────────────

  public shared ({ caller }) func addOrUpdateResidence(
    id : Text,
    name : Text,
    description : Text,
  ) : async Text {
    if (not acHasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can manage residences");
    };
    let residence : Residence = {
      id;
      name;
      description;
      reviews = [];
      reviewTokens = [];
    };
    residences.add(id, residence);
    id;
  };

  public query func getResidence(id : Text) : async ?Residence {
    residences.get(id);
  };

  public query func getAllResidences() : async [Residence] {
    residences.values().toArray();
  };

  public shared ({ caller }) func initializeDefaultResidences() : async () {
    if (not acHasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can initialize default residences");
    };
    let defaults : [Residence] = [
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
    for (r in defaults.values()) {
      residences.add(r.id, r);
    };
  };

  // ── Calendar Management ───────────────────────────────────────────────────────

  public shared ({ caller }) func updateResidenceCalendar(
    residenceId : Text,
    year : Int,
    month : Int,
    days : [CalendarDay],
    selectedRange : DateRange,
  ) : async () {
    if (not acHasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update calendar state");
    };
    let cal : ResidenceCalendar = {
      residenceId;
      calendarState = {
        currentMonth = { year; month; days };
        selectedRange;
      };
    };
    residenceCalendars.add(residenceId, cal);
  };

  public query func getResidenceCalendar(residenceId : Text) : async ?CalendarState {
    switch (residenceCalendars.get(residenceId)) {
      case (null) null;
      case (?rc) ?rc.calendarState;
    };
  };

  public shared ({ caller }) func clearResidenceCalendar(residenceId : Text) : async () {
    if (not acHasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can clear calendar state");
    };
    residenceCalendars.remove(residenceId);
  };

  public shared ({ caller }) func initializeDefaultCalendars() : async () {
    if (not acHasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can initialize default calendars");
    };
    let defaultIds = [
      "waldhaus-tannenhof",
      "forsthaus-hirschgrund",
      "domizil-fichtenberg",
      "domizil-schwarzwaldblick",
    ];
    for (residenceId in defaultIds.values()) {
      residenceCalendars.add(residenceId, {
        residenceId;
        calendarState = {
          currentMonth = { year = 2024; month = 1; days = [] };
          selectedRange = { startDate = null; endDate = null };
        };
      });
    };
  };

  // ── Houses Info ───────────────────────────────────────────────────────────────

  public query func getHousesInfo() : async [HouseInfo] {
    [
      { id = "waldhaus-tannenhof"; name = "Waldhaus Tannenhof"; description = "Ein luxuriöses Refugium inmitten alter Tannenwälder." },
      { id = "forsthaus-hirschgrund"; name = "Forsthaus Hirschgrund"; description = "Exklusive Waldvilla in historischer Forsthaus-Tradition." },
      { id = "domizil-fichtenberg"; name = "Domizil Fichtenberg"; description = "Modernes Waldloft mit imposanter Glasfassade." },
      { id = "domizil-schwarzwaldblick"; name = "Domizil Schwarzwaldblick"; description = "Exklusives Panoramahaus mit Blick auf die Schwarzwaldgipfel." },
    ];
  };
};
