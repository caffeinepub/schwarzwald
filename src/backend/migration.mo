import BaseToCore "BaseToCore";
import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Map "mo:core/Map";

module {
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

  type StorageState = {
    var authorizedPrincipals : [Principal];
    var blobTodeletete : [Blob];
  };

  type OldActor = {
    var bookingInquiries : OrderedMap.Map<Text, BookingInquiry>;
    var contactMessages : OrderedMap.Map<Text, ContactMessage>;
    var pageContents : OrderedMap.Map<Text, PageContent>;
    var properties : OrderedMap.Map<Text, Property>;
    var reviews : OrderedMap.Map<Text, Review>;
    var reviewTokens : OrderedMap.Map<Text, ReviewToken>;
    var userProfiles : OrderedMap.Map<Principal, UserProfile>;
    var domiciles : OrderedMap.Map<Text, Domicile>;
    var residences : OrderedMap.Map<Text, Residence>;
    var residenceCalendars : OrderedMap.Map<Text, ResidenceCalendar>;
    accessControlState : BaseToCore.OldAccessControlState;
    storage : StorageState; // blob-storage state — discarded in migration
  };

  type NewActor = {
    bookingInquiries : Map.Map<Text, BookingInquiry>;
    contactMessages : Map.Map<Text, ContactMessage>;
    pageContents : Map.Map<Text, PageContent>;
    properties : Map.Map<Text, Property>;
    reviews : Map.Map<Text, Review>;
    reviewTokens : Map.Map<Text, ReviewToken>;
    userProfiles : Map.Map<Principal, UserProfile>;
    domiciles : Map.Map<Text, Domicile>;
    residences : Map.Map<Text, Residence>;
    residenceCalendars : Map.Map<Text, ResidenceCalendar>;
    accessControlState : BaseToCore.NewAccessControlState;
  };

  public func run(old : OldActor) : NewActor {
    {
      bookingInquiries = BaseToCore.migrateOrderedMap(old.bookingInquiries);
      contactMessages = BaseToCore.migrateOrderedMap(old.contactMessages);
      pageContents = BaseToCore.migrateOrderedMap(old.pageContents);
      properties = BaseToCore.migrateOrderedMap(old.properties);
      reviews = BaseToCore.migrateOrderedMap(old.reviews);
      reviewTokens = BaseToCore.migrateOrderedMap(old.reviewTokens);
      userProfiles = BaseToCore.migrateOrderedMap(old.userProfiles);
      domiciles = BaseToCore.migrateOrderedMap(old.domiciles);
      residences = BaseToCore.migrateOrderedMap(old.residences);
      residenceCalendars = BaseToCore.migrateOrderedMap(old.residenceCalendars);
      accessControlState = BaseToCore.migrateAccessControlState(old.accessControlState);
    };
  };
};
