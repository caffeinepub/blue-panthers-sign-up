module {
  type Position = {
    #guard;
    #forward;
    #center;
  };

  type PositionStatus = {
    #open;
    #maxCapacity : Nat; // 0 means explicitly closed
  };

  type OldActor = {
    positionConfig : [(Position, PositionStatus)];
  };

  type NewActor = {
    positionConfig : [(Position, PositionStatus)];
  };

  public func run(old : OldActor) : NewActor {
    // Migrate all positions to have max capacity of 2
    {
      old with positionConfig = [
        (#forward, #maxCapacity(2)),
        (#center, #maxCapacity(2)),
        (#guard, #maxCapacity(2)),
      ]
    };
  };
};
