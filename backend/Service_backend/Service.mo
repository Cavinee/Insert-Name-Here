import Time "mo:base/Time";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Util "../Util";
import Types "../Types";

actor {

  var services = HashMap.HashMap<Text, Types.Service>(10, Text.equal, Text.hash);
  // var stable stableServices = [];

  public shared func createService(freelancerId : Text, serviceData : Types.UnregisteredServiceFormData) : async Result.Result<Types.Service, Text> {
    if (serviceData.tiers.size() == 0) {
      return #err("At least one tier is required");
    };

    let now = Int.abs(Time.now()); // Convert Time to Nat
    
    // Convert Text to Principal
    let freelancerPrincipal = Principal.fromText(freelancerId);
    
    let newService : Types.Service = {
      id = await Util.generateUUID();
      freelancerId = freelancerPrincipal;
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

  public shared func updateService(serviceId : Text, updatedServiceData : Types.ServiceUpdateFormData) : async Result.Result<Types.Service, Text> {
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

  public shared func addPackage(serviceId : Text, packageData : Types.ServiceTier) : async Result.Result<Types.Service, Text> {
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

  public shared func deleteService(serviceId : Text) : async Result.Result<Text, Text> {
      let service = services.get(serviceId);
      switch (service) {
        case (?serviceExists) {
          services := HashMap.mapFilter(
            services,
            Text.equal,
            Text.hash,
            func (key : Text, value : Types.Service) : ?Types.Service {
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

  public shared func getServiceDetails(serviceId : Text) : async Result.Result<Types.Service, Text> {
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

  public query func listAllServices() : async [Types.Service] {
      var allServices: [Types.Service] = [];

      
      for ((key, value) in services.entries()) {
          allServices := Array.append(allServices, [value]);
      };
      return allServices;
  };

  public func listServicesByFreelancer(freelancerId : Principal) : async [Types.Service] {
    let allServices = await listAllServices();
    Array.filter(
      allServices,
      func(service : Types.Service) : Bool {
        service.freelancerId == freelancerId;
      },
    );
  };

  public func searchServices(searchQuery : Text) : async [Types.Service] {
    let allServices = await listAllServices();
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
    let allServices = await listAllServices();
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

  public func searchFreelancers(freelancerName : Text) : async [Types.Service] {
    let allServices = await listAllServices();
    let searchQuery = #text (Text.toLowercase(freelancerName));
    if (Text.size(freelancerName) == 0) {
      return allServices;
    };
    return Array.filter(
      allServices,
      func(service : Types.Service) : Bool {
        Text.contains(Text.toLowercase(freelancerName), searchQuery);
      },
    );
  };

  public func filterServicesByTags(tags : [Text]) : async [Types.Service] {
    let allServices = await listAllServices();

    // If no tags are provided, return all services
    if (tags.size() == 0) {
      return allServices;
    } else {
      return Array.filter<Types.Service>(
        allServices,
        func(service : Types.Service) : Bool {
          // Convert service tags to lowercase for case-insensitive matching
          let serviceTags = Array.map<Text, Text>(service.tags, func tag = Text.toLowercase(tag));
          // Convert the input tags to lowercase
          let lowerTags = Array.map<Text, Text>(tags, func tag = Text.toLowercase(tag));

          // Check if any tags in input tags are in the service's tag list
          for (tag in lowerTags.vals()) {
            if (Array.find<Text>(serviceTags, func t = t == tag) != null) {
              return true;
            };
          };
          return false;
        },
      );
    };
  };

};
