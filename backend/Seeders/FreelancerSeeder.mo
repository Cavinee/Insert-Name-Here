import Util "../Util";
import Freelancer "canister:Freelancer_backend";
import Principal "mo:base/Principal";
import Blob "mo:base/Blob";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Array "mo:base/Array";
import Types "../Types";
actor {

  public func run() : async () {
    
    let freelancers : [Types.FreelancerProfile] = [
      {
        id = Principal.fromText("aaaaa-ab");
        role = "freelancer";
        fullName = "Alex Johnson";
        email = "alexj@freelancehub.com";
        dateOfBirth = "1990-05-15";
        balance = 15000.00;
        password = "alex123";
        profilePictureUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
        orderedServicesId = [];
        skills = ["Web Development", "React", "Node.js", "UI/UX Design"];
        portfolioIds = ?["portfolio1", "portfolio2", "portfolio3"];
        reputationScore = 4.8;
        completedProjects = 42;
        tokenRewards = 350.5;
        availabilityStatus = "Available";
      },
      {
        id = Principal.fromBlob(Blob.fromArray([10]));
        role = "freelancer";
        fullName = "Sophia Martinez";
        email = "sophiam@freelancehub.com";
        dateOfBirth = "1988-11-23";
        balance = 22500.50;
        password = "sophia123";
        profilePictureUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
        orderedServicesId = [];
        skills = ["Graphic Design", "Adobe Photoshop", "Illustration", "Brand Identity"];
        portfolioIds = ?["design1", "design2", "design3", "design4"];
        reputationScore = 4.9;
        completedProjects = 78;
        tokenRewards = 620.75;
        availabilityStatus = "Busy";
      },
      {
        id = Principal.fromBlob(Blob.fromArray([11]));
        role = "freelancer";
        fullName = "Marcus Williams";
        email = "marcusw@freelancehub.com";
        dateOfBirth = "1992-03-18";
        balance = 9800.25;
        password = "marcus123";
        profilePictureUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
        orderedServicesId = [];
        skills = ["Content Writing", "SEO", "Copywriting", "Blog Posts"];
        portfolioIds = ?["writing1", "writing2"];
        reputationScore = 4.6;
        completedProjects = 53;
        tokenRewards = 290.0;
        availabilityStatus = "Available";
      },
      {
        id = Principal.fromBlob(Blob.fromArray([12]));
        role = "freelancer";
        fullName = "Emma Chen";
        email = "emmac@freelancehub.com";
        dateOfBirth = "1995-07-09";
        balance = 18750.00;
        password = "emma123";
        profilePictureUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
        orderedServicesId = [];
        skills = ["Mobile Development", "iOS", "Android", "Flutter", "React Native"];
        portfolioIds = ?["app1", "app2", "app3"];
        reputationScore = 4.7;
        completedProjects = 35;
        tokenRewards = 425.25;
        availabilityStatus = "Available";
      },
      {
        id = Principal.fromBlob(Blob.fromArray([13]));
        role = "freelancer";
        fullName = "David Cooper";
        email = "davidc@freelancehub.com";
        dateOfBirth = "1987-12-04";
        balance = 31200.75;
        password = "david123";
        profilePictureUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
        orderedServicesId = [];
        skills = ["Video Editing", "Animation", "Motion Graphics", "After Effects"];
        portfolioIds = ?["video1", "video2", "video3", "video4", "video5"];
        reputationScore = 5.0;
        completedProjects = 91;
        tokenRewards = 850.0;
        availabilityStatus = "On Vacation";
      },
      {
        id = Principal.fromBlob(Blob.fromArray([14]));
        role = "freelancer";
        fullName = "Olivia Parker";
        email = "oliviap@freelancehub.com";
        dateOfBirth = "1993-09-27";
        balance = 7500.50;
        password = "olivia123";
        profilePictureUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
        orderedServicesId = [];
        skills = ["Social Media Management", "Digital Marketing", "Content Strategy"];
        portfolioIds = null; // New freelancer without portfolio yet
        reputationScore = 4.3;
        completedProjects = 12;
        tokenRewards = 85.5;
        availabilityStatus = "Available";
      },
      {
        id = Principal.fromBlob(Blob.fromArray([15]));
        role = "freelancer";
        fullName = "James Wilson";
        email = "jamesw@freelancehub.com";
        dateOfBirth = "1991-02-14";
        balance = 14200.25;
        password = "james123";
        profilePictureUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
        orderedServicesId = [];
        skills = ["Data Analysis", "Python", "R", "Machine Learning", "Visualization"];
        portfolioIds = ?["data1", "data2"];
        reputationScore = 4.5;
        completedProjects = 28;
        tokenRewards = 210.75;
        availabilityStatus = "Available";
      },
      {
        id = Principal.fromBlob(Blob.fromArray([16]));
        role = "freelancer";
        fullName = "Aisha Khan";
        email = "aishak@freelancehub.com";
        dateOfBirth = "1994-08-21";
        balance = 19800.00;
        password = "aisha123";
        profilePictureUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
        orderedServicesId = [];
        skills = ["UI/UX Design", "Wireframing", "Figma", "Prototyping"];
        portfolioIds = ?["ui1", "ui2", "ui3", "ui4"];
        reputationScore = 4.8;
        completedProjects = 45;
        tokenRewards = 375.0;
        availabilityStatus = "Busy";
      },
      {
        id = Principal.fromBlob(Blob.fromArray([17]));
        role = "freelancer";
        fullName = "Lucas Hernandez";
        email = "lucash@freelancehub.com";
        dateOfBirth = "1989-06-30";
        balance = 25600.50;
        password = "lucas123";
        profilePictureUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
        orderedServicesId = [];
        skills = ["3D Modeling", "Blender", "Cinema 4D", "Character Design"];
        portfolioIds = ?["3d1", "3d2", "3d3"];
        reputationScore = 4.9;
        completedProjects = 67;
        tokenRewards = 580.25;
        availabilityStatus = "Available";
      },
      {
        id = Principal.fromBlob(Blob.fromArray([18]));
        role = "freelancer";
        fullName = "Maya Patel";
        email = "mayap@freelancehub.com";
        dateOfBirth = "1996-04-12";
        balance = 6300.75;
        password = "maya123";
        profilePictureUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
        orderedServicesId = [];
        skills = ["Translation", "Localization", "Proofreading", "Hindi", "English"];
        portfolioIds = null; // New freelancer without portfolio yet
        reputationScore = 4.2;
        completedProjects = 8;
        tokenRewards = 65.0;
        availabilityStatus = "Available";
      }
    ];

    for (freelancer in freelancers.vals()) {
      let freelancerId = await Freelancer.registerFreelancerFromSignup(freelancer);
    };
  };

  public shared(msg) func updateAvailability(status: Text): async Text {
    let freelancer = await Freelancer.getFreelancerProfile(msg.caller);
    switch(freelancer) {
      case (null) {
        return "You are not registered as a freelancer";
      };
      case (?fr) {
        if (Util.availabilityStatusVal(status)) {
          let updatedStatus = await Freelancer.updateFreelancerProfile({
            fr with
            availabilityStatus = status
          });
          return "Your availability status is now: " # status;
        } else {
          return "Invalid availability status: " # status;
        };
      };
    };
  };

  public shared(msg) func addSkill(skill: Text): async Text {
    let freelancer = await Freelancer.getFreelancerProfile(msg.caller);
    switch(freelancer) {
      case (null) {
        return "You are not registered as a freelancer";
      };
      case (?fr) {
        // Check if skill already exists
        for (existingSkill in fr.skills.vals()) {
          if (existingSkill == skill) {
            return "Skill already exists in your profile";
          };
        };
        
        // Add the new skill
        let updatedSkills = Array.append<Text>(fr.skills, [skill]);
        let updatedStatus = await Freelancer.updateFreelancerProfile({
          fr with
          skills = updatedSkills
        });
        return "Skill added successfully: " # skill;
      };
    };
  };

  public shared(msg) func addPortfolio(portfolioId: Text): async Text {
    let freelancer = await Freelancer.getFreelancerProfile(msg.caller);
    switch(freelancer) {
      case (null) {
        return "You are not registered as a freelancer";
      };
      case (?fr) {
        // Update portfolio IDs
        let currentPortfolioIds = switch (fr.portfolioIds) {
          case (null) { [] };
          case (?ids) { ids };
        };
        
        // Check if portfolio ID already exists
        for (existingId in currentPortfolioIds.vals()) {
          if (existingId == portfolioId) {
            return "Portfolio ID already exists";
          };
        };
        
        let updatedPortfolioIds = Array.append<Text>(currentPortfolioIds, [portfolioId]);
        let updatedStatus = await Freelancer.updateFreelancerProfile({
          fr with
          portfolioIds = ?updatedPortfolioIds
        });
        return "Portfolio added successfully with ID: " # portfolioId;
      };
    };
  };
}