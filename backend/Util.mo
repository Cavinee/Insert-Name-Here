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

  public func userRoleVal(role : Text) : Bool {
    switch (role) {
      case ("admin") { return true };
      case ("owner") { return true };
      case ("renter") { return true };
      case ("guest") { return true };
      case (_) { return false };
    };
  };

  public func availabilityStatusVal(av: Text): Bool {
    switch(av){
      case("Available") {return true};
      case("Busy") {return true};
      case("On Vacation") {return true};
      case(_) {return false};
    }
  };

  public func toSubaccount(p : Principal) : async Blob {
    // Get the bytes of the Principal
    let principalBytes = Blob.toArray(Principal.toBlob(p));

    // Create a new array with 32 bytes (standard subaccount size)
    let subaccount = Array.tabulate<Nat8>(
      32,
      func(i) {
        if (i < principalBytes.size()) {
          // Copy Principal bytes
          principalBytes[i];
        } else {
          // Pad with zeros
          0;
        };
      },
    );

    return Blob.fromArray(subaccount);
  };

  // For testing: gets the size of the returned Blob
  public func testSubaccountSize(p : Principal) : async Nat {
    let blob = await toSubaccount(p);
    Blob.toArray(blob).size();
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
