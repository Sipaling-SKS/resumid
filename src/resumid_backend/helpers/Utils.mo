module Utils {
  public func findIndex<T>(arr: [T], predicate: func(T) -> Bool) : ?Nat {
    var i: Nat = 0;
    while (i < Array.size(arr)) {
      if (predicate(arr[i])) {
        return ?i;
      };
      i += 1;
    };
    return null;
  };
};
