// import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import UUID "mo:uuid/UUID";
import Source "mo:uuid/async/SourceV4";

module Util = {

  public func generateUUID() : async Text {
    var id = Source.Source();          // create a random source
    return UUID.toText(await id.new());     // convert UUID to text
  };

  public func getCurrentTime() : async Int {
    let currentTime = Time.now(); // Get the current time in seconds since epoch
    return currentTime;
  };

  public func generatePrincipal() : async Principal{
    Principal.fromText(await generateUUID());
  };

  public shared (msg) func whoami() : async Principal {
    msg.caller;
  };
};
