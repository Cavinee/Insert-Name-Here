import Types "../Types";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Service "canister:Service_backend";

actor ServiceSeeder {
    public shared func run() : async () {
        // Example data to populate the services canister hashmap
        let exampleServices: [Types.UnregisteredService] = [
            {
                title = "Web Development";
                description = "Full-stack web development services.";
                category = "Development";
                subcategory = "Web";
                currency = "ICP";
                status = "Active";
                freelancerId = Principal.fromText("aaaaa-ab");
                tags = ["web", "development", "full-stack"];
                attachments = null;
                tiers = [];
            },
            {
                title = "Graphic Design";
                description = "Professional graphic design services.";
                category = "Design";
                subcategory = "Graphic";
                currency = "ICP";
                status = "Active";
                freelancerId = Principal.fromText("aaaaa-ab");
                tags = ["design", "graphic", "branding"];
                attachments = null;
                tiers = [];
            }
        ];
        for (ex in exampleServices.vals()) {
            let _ = await Service.createService( ex )
        };

        Debug.print("Services have been seeded successfully.");
    };
}