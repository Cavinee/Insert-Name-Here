import Text "mo:base/Text";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import UUID "mo:uuid/UUID";
import Source "mo:uuid/async/SourceV4";
import Int "mo:base/Int";

module {
  
  public func generateUUID() : async Text {
    let source = Source.Source(); // move inside function
    let uuid = await source.new();
    return UUID.toText(uuid);
  };

  public func getCurrentTime() : async Int {
    let currentTime = Time.now();
    return currentTime;
  };

  public func generatePrincipal() : async Principal{
    Principal.fromText(await generateUUID());
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
}
