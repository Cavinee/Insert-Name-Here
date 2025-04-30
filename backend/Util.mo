// import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Blob "mo:base/Blob";
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

  public func toSubaccount(p: Principal) : Blob {
    let bytes = Principal.toBlob(p);
    let padding = Array.tabulate<Nat8>(28, func(i) { if (i < bytes.size()) bytes[i] else 0 });
    Blob.fromArray(padding);
  };
};