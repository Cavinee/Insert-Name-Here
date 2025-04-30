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

  var services = HashMap.HashMap<Principal, Types.Service>(10, Principal.equal, Principal.hash);

  public shared func createService(freelancerId : Principal, serviceData : Types.UnregisteredServiceFormData) : async Result.Result<Types.Service, Text> {
    if (serviceData.tiers.size() == 0) {
      return #err("At least one tier is required");

    };

    let now = Int.abs(Time.now()); // Convert Time to Nat
    
    let newService : Types.Service = {
      id = await Util.generatePrincipal();
      freelancerId = freelancerId;
      title = serviceData.title;
      description = serviceData.description;
      category = serviceData.category;
      subcategory = serviceData.subcategory;
      startingPrice = serviceData.tiers[0].price;
      currency = serviceData.currency;
      deliveryTimeMin = serviceData.tiers[0].deliveryDays;
      status = serviceData.status;
      tags = serviceData.tags;
      attachments = serviceData.attachments;
      tiers = serviceData.tiers;
      contractType = serviceData.contractType;
      paymentMethod = serviceData.paymentMethod;
      createdAt = now;
      updatedAt = now;
      averageRating = null;
      totalReviews = 0;
    };

    services.put(newService.id, newService);
    return #ok(newService);
  };

  public shared func updateService(serviceId : Principal, updatedServiceData : Types.ServiceUpdateFormData) : async Result.Result<Types.Service, Text> {
    let service = services.get(serviceId);
    switch (service) {
      case (?serviceExists) {
        let updatedService : Types.Service = {
          id = serviceExists.id;
          freelancerId = serviceExists.freelancerId;
          createdAt = serviceExists.createdAt;
          updatedAt = Int.abs(Time.now()); // Convert Time to Nat
          title = Option.get(updatedServiceData.title, serviceExists.title);
          description = Option.get(updatedServiceData.description, serviceExists.description);
          category = Option.get(updatedServiceData.category, serviceExists.category);
          subcategory = Option.get(updatedServiceData.subcategory, serviceExists.subcategory);
          startingPrice = Option.get(updatedServiceData.startingPrice, serviceExists.startingPrice);
          currency = Option.get(updatedServiceData.currency, serviceExists.currency);
          deliveryTimeMin = Option.get(updatedServiceData.deliveryTimeMin, serviceExists.deliveryTimeMin);
          status = Option.get(updatedServiceData.status, serviceExists.status);
          tags = Option.get(updatedServiceData.tags, serviceExists.tags);
          attachments = switch (updatedServiceData.attachments) {
            case (?newAttachments) { ?newAttachments };
            case (null) { serviceExists.attachments };
          };
          tiers = Option.get(updatedServiceData.tiers, serviceExists.tiers);
          contractType = Option.get(updatedServiceData.contractType, serviceExists.contractType);
          paymentMethod = Option.get(updatedServiceData.paymentMethod, serviceExists.paymentMethod);
          averageRating = serviceExists.averageRating;
          totalReviews = serviceExists.totalReviews;
        };

        services.put(serviceId, updatedService);
        return #ok(updatedService);
      };
      case (null) {
        return #err("Service not found");
      };
    };
  };

  public shared func addPackage(serviceId : Principal, packageData : Types.ServiceTier) : async Result.Result<Types.Service, Text> {
    let now = Int.abs(Time.now()); // Convert Time to Nat
    let service = services.get(serviceId);
    switch (service) {
      case (?existingService) {
        let newPackage: Types.ServiceTier = {
          id = await Util.generateUUID();
          name = packageData.name;
          description = packageData.description;
          price = packageData.price;
          deliveryDays = packageData.deliveryDays;
          revisions = packageData.revisions;
          features = packageData.features;
        };

        let updatedTiers: [Types.ServiceTier] = Array.append(existingService.tiers, [newPackage]);
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

  public shared func updatePackage(serviceId : Principal, packageId : Text, updatedPackageData : Types.ServiceTierUpdateFormData) : async Result.Result<Types.Service, Text> {
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

 public shared func removePackage(serviceId : Principal, packageId : Text) : async Result.Result<Types.Service, Text> {
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

  public shared func getPackage(serviceId : Principal, packageId : Text) : async Result.Result<Types.ServiceTier, Text> {
    switch (services.get(serviceId)) {
      case (?existingService) {
        switch (Array.find<Types.ServiceTier>(
          existingService.tiers,
          func(tier : Types.ServiceTier) : Bool {
            return tier.id == packageId;
          }
        )) {
          case (?foundPackage) {
            return #ok(foundPackage);
          };
          case (null) {
            return #err("Package not found");
          };
        };
      };
      case (null) {
        return #err("Service not found");
      };
    };
  };

  public shared func deleteService(serviceId : Principal) : async Result.Result<Text, Text> {
      let service = services.get(serviceId);
      switch (service) {
        case (?_serviceExists) {
          services := HashMap.mapFilter(
            services,
            Principal.equal,
            Principal.hash,
            func (key : Principal, value : Types.Service) : ?Types.Service {
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

  public shared func getServiceDetails(serviceId : Principal) : async Result.Result<Types.Service, Text> {
    let service = services.get(serviceId);
    switch (service) {
      case (?serviceExists) {
        return #ok(serviceExists);
      };
      case (null) {
        return #err("Service not found");
      };
    };
  };

  public query func getAllServices() : async [Types.Service] {
      var allServices: [Types.Service] = [];

      
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

  public func searchServices(searchQuery : Text) : async [Types.Service] {
    let allServices: [Types.Service] = await getAllServices();
    if (Text.size(searchQuery) == 0) {
      return allServices;
    };
    
    let searchPattern = #text(Text.toLowercase(searchQuery));
    
    return Array.filter(
      allServices,
      func(service : Types.Service) : Bool {
        Text.contains(Text.toLowercase(service.title), searchPattern) or 
        Text.contains(Text.toLowercase(service.description), searchPattern);
      },
    );
  };

  public func filterServicesByCategory(category : Text) : async [Types.Service] {
    let allServices: [Types.Service] = await getAllServices();
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

};
