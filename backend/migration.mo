import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  type Position = {
    #pointGuard;
    #shootingGuard;
    #smallForward;
    #powerForward;
    #center;
  };

  type ExperienceLevel = {
    #beginner;
    #intermediate;
    #advanced;
  };

  type PositionStatus = {
    #open;
    #maxCapacity : Nat;
  };

  type OldSignUp = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    age : Nat;
    position : Position;
    experienceLevel : ExperienceLevel;
    timestamp : Time.Time;
  };

  type OldActor = {
    positionConfig : [(Position, PositionStatus)];
    nextId : Nat;
    signUps : Map.Map<Nat, OldSignUp>;
  };

  type NewActor = {
    positionConfig : [(Position, PositionStatus)];
    nextId : Nat;
    signUps : Map.Map<Nat, OldSignUp>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      positionConfig = [
        (#pointGuard, #maxCapacity(3)),
        (#shootingGuard, #maxCapacity(3)),
        (#smallForward, #maxCapacity(3)),
        (#powerForward, #maxCapacity(3)),
        (#center, #maxCapacity(3)),
      ]
    };
  };
};
