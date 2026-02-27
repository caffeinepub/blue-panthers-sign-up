import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";

import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = { name : Text };
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
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
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public type Position = {
    #guard;
    #forward;
    #center;
  };

  public type ExperienceLevel = {
    #beginner;
    #intermediate;
    #advanced;
  };

  public type PositionStatus = {
    #open;
    #maxCapacity : Nat; // 0 means explicitly closed
  };

  // New configuration: All positions have a max capacity of 2.
  let positionConfig : [(Position, PositionStatus)] = [
    (#forward, #maxCapacity(2)),
    (#center, #maxCapacity(2)),
    (#guard, #maxCapacity(2)),
  ];

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
    validatePositionAvailability(position);

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

  func validatePositionAvailability(position : Position) {
    let status = switch (positionConfig.find(func(p) { p.0 == position })) {
      case (?config) { config.1 };
      case (null) { #open }; // Default to open if not found
    };

    let currentCount = switch (status) {
      case (#open) { return };
      case (#maxCapacity(capacity)) {
        if (capacity == 0) {
          Runtime.trap("Position is currently closed for sign-ups (maxCapacity 0)");
        };
        getPositionSignUpCount(position);
      };
    };

    switch (status) {
      case (#open) {};
      case (#maxCapacity(capacity)) {
        if (currentCount >= capacity) {
          Runtime.trap("This position has reached its maximum capacity of " # capacity.toText() # " sign-ups.");
        };
      };
    };
  };

  func getPositionSignUpCount(position : Position) : Nat {
    let countIter = signUps.values().toArray().values().filter(
      func(signUp) { signUp.position == position }
    );
    countIter.size();
  };

  public query ({ caller }) func getAllSignUps() : async [SignUp] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all sign-ups");
    };
    signUps.values().toArray().sort();
  };

  public query ({ caller }) func getSignUpById(id : Nat) : async SignUp {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view sign-up details");
    };
    switch (signUps.get(id)) {
      case (null) { Runtime.trap("Sign-up not found") };
      case (?signUp) { signUp };
    };
  };
};
