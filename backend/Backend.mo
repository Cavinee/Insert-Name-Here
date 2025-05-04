import Principal "mo:base/Principal";
import Option "mo:base/Option";
import Client "canister:Client_backend";

actor class Backend() {


  public shared (msg) func whoami() : async Principal {
    return msg.caller;
  };

    public shared func checkBalance(user : Principal) : async Float {
    let bal: Float = await Client.getUserBalance(user);
    return bal;
  };

  public shared func hasProfile(userPrincipal : Principal) : async Bool {
    return Option.isSome(await Client.getUser(userPrincipal));
  };
};
