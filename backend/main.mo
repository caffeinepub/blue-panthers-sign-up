import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = { name : Text };
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public type Position = { #guard; #forward; #center };
  public type ExperienceLevel = { #beginner; #intermediate; #advanced };
  public type SignUp = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    age : Nat;
    position : Position;
    experienceLevel : ExperienceLevel;
    timestamp : Time.Time;
  };

  module SignUpModule {
    public func compare(a : SignUp, b : SignUp) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  var nextId = 0;
  let signUps = Map.empty<Nat, SignUp>();

  public shared ({ caller }) func submitSignUp(
    name : Text,
    email : Text,
    phone : Text,
    age : Nat,
    position : Position,
    experienceLevel : ExperienceLevel,
  ) : async Nat {
    let id = nextId;
    let newSignUp : SignUp = {
      id;
      name;
      email;
      phone;
      age;
      position;
      experienceLevel;
      timestamp = Time.now();
    };
    signUps.add(id, newSignUp);
    nextId += 1;
    id;
  };

  public query ({ caller }) func getAllSignUps() : async [SignUp] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all sign-ups");
    };
    signUps.values().toArray().sort();
  };

  public query ({ caller }) func getSignUpById(id : Nat) : async SignUp {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view sign-up details");
    };
    switch (signUps.get(id)) {
      case (null) { Runtime.trap("Sign-up not found") };
      case (?signUp) { signUp };
    };
  };
};
