module {
  type OldActor = { positionConfig : [(Position, PositionStatus)] };
  type Position = { #guard; #forward; #center };
  type PositionStatus = { #open; #maxCapacity : Nat };

  type NewActor = { positionConfig : [(Position, PositionStatus)] };

  public func run(old : OldActor) : NewActor {
    // Override position config with correct values
    {
      old with
      positionConfig = [
        (#forward, #maxCapacity(2)),
        (#center, #maxCapacity(2)),
        (#guard, #maxCapacity(1)),
      ]
    };
  };
};
