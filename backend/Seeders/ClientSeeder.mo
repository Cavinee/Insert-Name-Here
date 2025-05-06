import Util "../Util";
import Types "../Types";
import Client "canister:Client_backend";
import Principal "mo:base/Principal";
import Blob "mo:base/Blob";
// import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Float "mo:base/Float";

actor {

  public func run() : async () {
    
    let users : [Types.ClientProfile] = [
      {
        id = Principal.fromText("aaaaa-aa");
        role = "admin";
        fullName = "superadmin";
        email = "superadmin@gmail.com";
        password = "admin123"; // Added password field
        dateOfBirth = "2005-05-06";
        balance = 10000000;
        profilePictureUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
        orderedServicesId = []; // Changed from propertiesId to orderedServicesId
      },
      {
        id = Principal.fromBlob(Blob.fromArray([1])); 
        role = "user";
        fullName = "iAmUser";
        email = "user123@gmail.com";
        password = "user123"; // Added password field
        dateOfBirth = "2005-05-06";
        balance = 10000000;
        profilePictureUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
        orderedServicesId = []; // Changed from propertiesId to orderedServicesId
      },
      {
        id = Principal.fromBlob(Blob.fromArray([2])); 
        role = "renter";
        fullName = "iAmRenter";
        email = "renter123@gmail.com";
        password = "renter123"; // Added password field
        dateOfBirth = "2005-05-06";
        balance = 10000000;
        profilePictureUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
        orderedServicesId = []; // Changed from propertiesId to orderedServicesId
      },
      {
        id = Principal.fromBlob(Blob.fromArray([3])); 
        role = "guest";
        fullName = "iAmGuest";
        email = "guest123@gmail.com";
        password = "guest123"; // Added password field
        dateOfBirth = "2005-05-06";
        balance = 10000000;
        profilePictureUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
        orderedServicesId = []; // Changed from propertiesId to orderedServicesId
      },
      {
        id = Principal.fromBlob(Blob.fromArray([4])); 
        role = "user";
        fullName = "John Smith";
        email = "johnsmith@example.com";
        password = "john123"; // Added password field
        dateOfBirth = "1990-03-15";
        balance = 5000000;
        profilePictureUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
        orderedServicesId = []; // Changed from propertiesId to orderedServicesId
      },
      

    ];

    for (user in users.vals()) {
      let _ = await Client.registerUser(user);
    };
  };

  public shared(msg) func changeRole(role: Text): async Text{
    if(Util.userRoleVal(role)){
      let user = await Client.getUser(msg.caller);
      switch(user){
        case (null){
          return "You are not registered";
        };
        case (?usr){
          let _ = await Client.updateUser({
            usr with
            role = role
          });

          return "You are now a " # role;
        };
      };
    } else {
      return "Invalid role " # role;
    };
  };

  public shared(msg) func addBalance(amount: Float): async Text{
    let user = await Client.getUser(msg.caller);
    switch(user){
      case (null){
        return "You are not registered";
      };
      case (?usr){
        let _ = await Client.updateUser({
          usr with
          balance = usr.balance + amount
        });
        
        return "Your balance is now " # Float.toText(usr.balance + amount);
      };
    };
  };
}