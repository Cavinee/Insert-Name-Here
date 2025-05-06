import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import Util "../Util";
import Types "../Types";
// import Freelancer "canister:Freelancer_backend";

actor {

  var services = HashMap.HashMap<Text, Types.Service>(10, Text.equal, Text.hash);

  public shared func createService(serviceData: Types.UnregisteredService) : async Result.Result<Types.Service, Text> {
    let id = await Util.generateUUID();
  
    var newService: Types.Service = {
      id;
      title = serviceData.title;
      description = serviceData.description; 
      category = serviceData.category;
      subcategory = serviceData.subcategory;
      currency = serviceData.currency;
      status = serviceData.status;
      tags = serviceData.tags;
      attachments = serviceData.attachments;
      tiers = serviceData.tiers;
      totalReviews = 0;
      averageRating = ?0.0;
      freelancerId = serviceData.freelancerId;

    };
    services.put(id, newService);
    return #ok(newService);
  };

  public shared func updateService(updatedServiceData : Types.Service) : async Result.Result<Types.Service, Text> {
    try {
      services.put(updatedServiceData.id, updatedServiceData);
      return #ok(updatedServiceData);
    } catch (e) {

      return #err("Service not found");

    };
  };

  public shared func addPackage(serviceId : Text, packageData : Types.ServiceTier) : async Result.Result<Types.Service, Text> {
    let now = Int.abs(Time.now()); // Convert Time to Nat
    let service = services.get(serviceId);
    switch (service) {
      case (?existingService) {
        let newPackage : Types.ServiceTier = {
          id = await Util.generateUUID();
          name = packageData.name;
          description = packageData.description;
          price = packageData.price;
          deliveryDays = packageData.deliveryDays;
          revisions = packageData.revisions;
          features = packageData.features;
        };

        let updatedTiers : [Types.ServiceTier] = Array.append(existingService.tiers, [newPackage]);
        let updatedService = {
          existingService with
          tiers = updatedTiers;
          updatedAt = now;
        };

        services.put(serviceId, updatedService);
        return #ok(updatedService);
      };
      case (null) {
        return #err("Service not found");
      };
    };
  };

  public shared func updatePackage(serviceId : Text, packageId : Text, updatedPackageData : Types.ServiceTierUpdateFormData) : async Result.Result<Types.Service, Text> {
    let service = services.get(serviceId);
    switch (service) {
      case (?existingService) {
        var packageFound = false;
        let updatedTiers = Array.map(
          existingService.tiers,
          func(tier : Types.ServiceTier) : Types.ServiceTier {
            if (tier.id == packageId) {
              packageFound := true;
              {
                tier with
                name = Option.get(updatedPackageData.name, tier.name);
                description = Option.get(updatedPackageData.description, tier.description);
                price = Option.get(updatedPackageData.price, tier.price);
                deliveryDays = Option.get(updatedPackageData.deliveryDays, tier.deliveryDays);
                revisions = Option.get(updatedPackageData.revisions, tier.revisions);
                features = Option.get(updatedPackageData.features, tier.features);
              };
            } else {
              tier;
            };
          },
        );

        if (not packageFound) {
          return #err("Package not found");
        };

        // Convert Time.now() to Nat for updatedAt field
        let now = Int.abs(Time.now());

        let updatedService : Types.Service = {
          existingService with
          tiers = updatedTiers;
          updatedAt = now;
        };

        services.put(serviceId, updatedService);
        return #ok(updatedService);
      };
      case (null) {
        return #err("Service not found");
      };
    };
  };

  public shared func removePackage(serviceId : Text, packageId : Text) : async Result.Result<Types.Service, Text> {
    let service = services.get(serviceId);
    switch (service) {
      case (?existingService) {
        let updatedTiers = Array.filter(
          existingService.tiers,
          func(tier : Types.ServiceTier) : Bool {
            tier.id != packageId;
          },
        );

        if (updatedTiers.size() == existingService.tiers.size()) {
          return #err("Package not found");
        };

        // Convert Time.now() to Nat for updatedAt field
        let now = Int.abs(Time.now());

        let updatedService : Types.Service = {
          existingService with
          tiers = updatedTiers;
          updatedAt = now;
        };

        services.put(serviceId, updatedService);
        return #ok(updatedService);
      };
      case (null) {
        return #err("Service not found");
      };
    };
  };

    public shared func getPackage(serviceId : Text, packageId : Text) : async ?Types.ServiceTier {
      let existingService = services.get(serviceId);
      switch (existingService) {
        case (?es) {
          return Array.find<Types.ServiceTier>(
            es.tiers,
            func(tier : Types.ServiceTier) : Bool {
              tier.id == packageId
            }
          );
        };
        case (null) {
          return null;
        };
      };
    };


  public shared func deleteService(serviceId : Text) : async Result.Result<Text, Text> {
    let service = services.get(serviceId);
    switch (service) {
      case (?_serviceExists) {
        services := HashMap.mapFilter(
          services,
          Text.equal,
          Text.hash,
          func(key : Text, value : Types.Service) : ?Types.Service {
            if (key == serviceId) {
              return null; // Remove the service
            } else {
              return ?value; // Keep the service
            };
          },
        );
        return #ok("Service deleted successfully");
      };
      case (null) {
        return #err("Service not found");
      };
    };
  };

  public shared func getServiceDetails(serviceId : Text) : async ?Types.Service {
    let service = services.get(serviceId);
    return service;
  };

  public query func getAllServices() : async [Types.Service] {
    var allServices : [Types.Service] = [];

    for ((key, value) in services.entries()) {
      allServices := Array.append(allServices, [value]);
    };
    return allServices;
  };

  // public func getServicesByFreelancer(freelancerName : Text) : async [Types.Service] {
  //   let allServices: [Types.Service] = await getAllServices();
  //   let flId = await Freelancer.getFreelancerIdByName(freelancerName);
  //   return Array.filter(
  //     allServices,
  //     func(service : Types.Service) : Bool {
  //       service.freelancerId == flId;
  //     },
  //   );
  // };

  public shared func searchServices(searchQuery : Text) : async [Types.Service] {
    let allServices : [Types.Service] = await getAllServices();
    if (Text.size(searchQuery) == 0) {
      return allServices;
    };

    let searchPattern = #text(Text.toLowercase(searchQuery));

    return Array.filter(
      allServices,
      func(service : Types.Service) : Bool {
        Text.contains(Text.toLowercase(service.title), searchPattern) or Text.contains(Text.toLowercase(service.description), searchPattern);
      },
    );
  };

  public shared func filterServicesByCategory(category : Text) : async [Types.Service] {
    let allServices : [Types.Service] = await getAllServices();
    if (Text.size(category) == 0 or category == "All") {
      return allServices;
    };
    return Array.filter(
      allServices,
      func(service : Types.Service) : Bool {
        service.category == category;
      },
    );
  };

  public query func getServiceSoldById(freelancerId: Principal): async [Types.Service] {
    var matchedServices: [Types.Service] = [];

    for ((key, service) in services.entries()) {
      if (service.freelancerId == freelancerId) {
        matchedServices := Array.append(matchedServices, [service]);
      };
    };

    return matchedServices;
  };

};
