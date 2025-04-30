import Text "mo:base/Text";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import UUID "mo:uuid/UUID";
import Source "mo:uuid/async/SourceV4";
import Int "mo:base/Int";

module Util {
  public func generateUUID() : async Text {
    var id = Source.Source(); // create a random source
    return UUID.toText(await id.new()); // convert UUID to text
  };

  public func generatePrincipal() : async Principal {
    Principal.fromText(await generateUUID());
  };

  public func toSubaccount(p : Principal) : Blob {
    let bytesArray = Blob.toArray(Principal.toBlob(p)); // Convert Blob -> [Nat8]
    let padding = Array.tabulate<Nat8>(
      32,
      func(i) {
        if (i < bytesArray.size()) bytesArray[i] else 0;
      },
    );
    return Blob.fromArray(padding);
  };

  public func getCurrentTime() : async Int {
    let currentTime = Time.now();
    return currentTime;
  };

  public func getCurrentTimeSync() : async Int {
    return Time.now();
  };

  public func generateUniqueId() : async Text {
    let now = Time.now();
    let timeComponent = Int.toText(now);
    let randomSuffix = Int.toText(now % 10000);
    return timeComponent # "-" # randomSuffix;
  };

};
