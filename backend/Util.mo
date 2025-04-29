// import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import UUID "mo:uuid/UUID";
import Source "mo:uuid/async/SourceV4";

module Util = {
  public func generateUUID() : async Text {
    var id = Source.Source();          // create a random source
    return UUID.toText(await id.new());     // convert UUID to text
  };

  public func generatePrincipal() : async Principal{
    Principal.fromText(await generateUUID());
  };

};
