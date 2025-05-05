// import Util "../Util";
// import Principal "mo:base/Principal";
// import Blob "mo:base/Blob";
// import Nat "mo:base/Nat";
// import Int "mo:base/Int";
// import Text "mo:base/Text";
// import Time "mo:base/Time";
// import Array "mo:base/Array";
// import Result "mo:base/Result";
// import Types "../Types";
// import Service "canister:Service_backend";

// actor {

//   type Image = Types.Image;
//   type ServiceTier = Types.ServiceTier;
//   type UnregisteredServiceFormData = {
//     title : Text;
//     description : Text;
//     category : Text;
//     subcategory : Text;
//     currency : Text;
//     status : Text;
//     tags : [Text];
//     attachments : ?[Image]; // Optional portfolio or example files
//     tiers : [ServiceTier]; // Multiple tiers (Basic, Standard, Premium)
//   };

//   public func run() : async () {

//     // Referencing freelancer IDs from FreelancerSeeder
//     let freelancerId1 = Principal.fromText("aaaaa-ab"); // Alex Johnson - Web Developer
//     let freelancerId2 = Principal.fromBlob(Blob.fromArray([10])); // Sophia Martinez - Graphic Designer
//     let freelancerId3 = Principal.fromBlob(Blob.fromArray([11])); // Marcus Williams - Content Writer
//     let freelancerId4 = Principal.fromBlob(Blob.fromArray([12])); // Emma Chen - Mobile Developer
//     let freelancerId5 = Principal.fromBlob(Blob.fromArray([13])); // David Cooper - Video Editor
//     let freelancerId6 = Principal.fromBlob(Blob.fromArray([14])); // Olivia Parker - Social Media
//     let freelancerId7 = Principal.fromBlob(Blob.fromArray([15])); // James Wilson - Data Analyst

//     let currentTime = Time.now();

//     // Creating services for each freelancer
//     await createWebDevelopmentServices(freelancerId1, currentTime);
//     await createGraphicDesignServices(freelancerId2, currentTime);
//     await createContentWritingServices(freelancerId3, currentTime);
//     await createMobileDevelopmentServices(freelancerId4, currentTime);
//     await createVideoEditingServices(freelancerId5, currentTime);
//     await createSocialMediaServices(freelancerId6, currentTime);
//     await createDataAnalysisServices(freelancerId7, currentTime);

//   };

//   private func createWebDevelopmentServices(freelancerId : Principal, timestamp : Int) : async () {
//     let webDevService : UnregisteredServiceFormData = {
//       title = "Professional Responsive Website Development";
//       description = "I will create a modern, responsive website tailored to your business needs using React, Node.js, and the latest web technologies. Your website will be fully optimized for all devices and search engines.";
//       category = "Development";
//       subcategory = "Web Development";
//       currency = "ICP";
//       status = "Active";
//       tags = ["website", "responsive", "web development", "react", "node.js"];
//       attachments = ?[
//         {
//           imageUrl = "https://example.com/portfolio/web1.jpg";
//           imageTag = "E-commerce Website";
//         },
//         {
//           imageUrl = "https://example.com/portfolio/web2.jpg";
//           imageTag = "Corporate Site";
//         },
//       ];
//       tiers = [
//         {
//           id = "basic";
//           name = "Basic";
//           description = "Simple 3-page responsive website with basic features";
//           price = 100_000_000; // 1 ICP in smallest units
//           deliveryDays = 5;
//           revisions = 2;
//           features = ["3 pages", "Mobile Responsive", "Basic SEO", "Contact Form"];
//         },
//         {
//           id = "standard";
//           name = "Standard";
//           description = "Full 5-page website with advanced features and customizations";
//           price = 250_000_000; // 2.5 ICP in smallest units
//           deliveryDays = 10;
//           revisions = 3;
//           features = ["5 pages", "Mobile Responsive", "Advanced SEO", "Contact Form", "Social Media Integration", "Basic Analytics"];
//         },
//         {
//           id = "premium";
//           name = "Premium";
//           description = "Complete business website with all advanced features and ongoing support";
//           price = 500_000_000; // 5 ICP in smallest units
//           deliveryDays = 15;
//           revisions = 5;
//           features = ["10 pages", "Mobile Responsive", "Advanced SEO", "Contact Form", "Social Media Integration", "Full Analytics", "E-commerce Integration", "1 month support"];
//         },
//       ];
//     };

//     let result = await Service.createService(webDevService);

//     // Second service
//     let webAppService : UnregisteredServiceFormData = {
//       title = "Custom Web Application Development";
//       description = "I will build a custom web application to solve your specific business needs. From CRMs to inventory management systems, I create scalable solutions with clean code and intuitive interfaces.";
//       category = "Development";
//       subcategory = "Web Applications";
//       currency = "ICP";
//       status = "Active";
//       tags = ["web app", "custom development", "business solutions", "javascript", "react"];
//       attachments = ?[
//         {
//           imageUrl = "https://example.com/portfolio/webapp1.jpg";
//           imageTag = "CRM System";
//         },
//         {
//           imageUrl = "https://example.com/portfolio/webapp2.jpg";
//           imageTag = "Inventory Management";
//         },
//       ];
//       tiers = [
//         {
//           id = "basic";
//           name = "Basic";
//           description = "Simple web application with basic CRUD functionality";
//           price = 300_000_000; // 3 ICP in smallest units
//           deliveryDays = 10;
//           revisions = 2;
//           features = ["Basic CRUD Operations", "User Authentication", "Single Database", "Basic UI"];
//         },
//         {
//           id = "standard";
//           name = "Standard";
//           description = "Full-featured web application with advanced functionality";
//           price = 600_000_000; // 6 ICP in smallest units
//           deliveryDays = 20;
//           revisions = 3;
//           features = ["Advanced CRUD", "User Roles", "Multiple Data Sources", "Advanced UI/UX", "API Integration"];
//         },
//         {
//           id = "premium";
//           name = "Premium";
//           description = "Enterprise-grade application with all features and ongoing support";
//           price = 1_000_000_000; // 10 ICP in smallest units
//           deliveryDays = 30;
//           revisions = 5;
//           features = ["Enterprise Architecture", "Scalable Solution", "Advanced Security", "Premium UI/UX", "Multiple API Integrations", "3 months support", "Documentation"];
//         },
//       ];
//     };
//     let profile: Types.Service = {
//       title = webAppService.title,

//     }
//     let result2 = await Service.createService(webAppService);
//   };

//   private func createGraphicDesignServices(freelancerId : Principal, timestamp : Int) : async () {
//     let logoDesignService : UnregisteredServiceFormData = {
//       title = "Professional Logo & Brand Identity Design";
//       description = "I will create a stunning, professional logo and brand identity that perfectly captures your business. With my expertise in Adobe Creative Suite, I'll deliver eye-catching designs that make your brand stand out.";
//       category = "Design";
//       subcategory = "Logo Design";
//       currency = "ICP";
//       status = "Active";
//       tags = ["logo", "branding", "design", "brand identity", "creative"];
//       attachments = ?[
//         {
//           imageUrl = "https://example.com/portfolio/logo1.jpg";
//           imageTag = "Tech Startup Logo";
//         },
//         {
//           imageUrl = "https://example.com/portfolio/logo2.jpg";
//           imageTag = "Restaurant Brand";
//         },
//       ];
//       tiers = [
//         {
//           id = "basic";
//           name = "Basic";
//           description = "Simple logo design with 2 concepts";
//           price = 80_000_000; // 0.8 ICP in smallest units
//           deliveryDays = 3;
//           revisions = 2;
//           features = ["2 Logo Concepts", "Vector Files", "High Resolution PNG", "Simple Typography"];
//         },
//         {
//           id = "standard";
//           name = "Standard";
//           description = "Professional logo with brand guidelines";
//           price = 150_000_000; // 1.5 ICP in smallest units
//           deliveryDays = 5;
//           revisions = 3;
//           features = ["3 Logo Concepts", "All Source Files", "Brand Guidelines", "Multiple File Formats", "Social Media Kit"];
//         },
//         {
//           id = "premium";
//           name = "Premium";
//           description = "Complete brand identity package";
//           price = 300_000_000; // 3 ICP in smallest units
//           deliveryDays = 7;
//           revisions = 5;
//           features = ["5 Logo Concepts", "All Source Files", "Comprehensive Brand Guidelines", "Business Card Design", "Letterhead Design", "Social Media Kit", "Email Signature"];
//         },
//       ];
//     };

//     let result = await Service.createService(freelancerId, logoDesignService);

//     // Second service
//     let illustrationService : UnregisteredServiceFormData = {
//       title = "Custom Digital Illustrations & Art";
//       description = "I will create beautiful custom illustrations for your project, whether it's for marketing materials, book covers, characters, or product visualization. My unique art style brings ideas to life.";
//       category = "Design";
//       subcategory = "Illustration";
//       currency = "ICP";
//       status = "Active";
//       tags = ["illustration", "digital art", "character design", "custom artwork"];
//       attachments = ?[
//         {
//           imageUrl = "https://example.com/portfolio/illus1.jpg";
//           imageTag = "Character Design";
//         },
//         {
//           imageUrl = "https://example.com/portfolio/illus2.jpg";
//           imageTag = "Book Cover";
//         },
//       ];
//       tiers = [
//         {
//           id = "basic";
//           name = "Basic";
//           description = "Single character or simple illustration";
//           price = 120_000_000; // 1.2 ICP in smallest units
//           deliveryDays = 4;
//           revisions = 2;
//           features = ["1 Character/Scene", "Basic Coloring", "Simple Background", "JPG & PNG Files"];
//         },
//         {
//           id = "standard";
//           name = "Standard";
//           description = "Detailed illustration with background";
//           price = 200_000_000; // 2 ICP in smallest units
//           deliveryDays = 7;
//           revisions = 3;
//           features = ["2 Characters or Complex Scene", "Advanced Coloring", "Detailed Background", "All Source Files", "Commercial Use License"];
//         },
//         {
//           id = "premium";
//           name = "Premium";
//           description = "Complex artwork with multiple elements";
//           price = 350_000_000; // 3.5 ICP in smallest units
//           deliveryDays = 10;
//           revisions = 5;
//           features = ["Multiple Characters/Complex Scene", "Premium Coloring & Shading", "Highly Detailed Background", "Animation Ready Layers", "All Source Files", "Commercial Use License", "Social Media Ready Formats"];
//         },
//       ];
//     };

//     let result2 = await Service.createService(freelancerId, illustrationService);
//   };

//   private func createContentWritingServices(freelancerId : Principal, timestamp : Int) : async () {
//     let blogService : UnregisteredServiceFormData = {
//       title = "SEO-Optimized Blog & Article Writing";
//       description = "I will write engaging, well-researched, and SEO-optimized blog posts and articles tailored to your target audience. My content will help improve your search engine rankings while providing value to your readers.";
//       category = "Writing";
//       subcategory = "Blog & Article Writing";
//       currency = "ICP";
//       status = "Active";
//       tags = ["blog writing", "SEO content", "article writing", "copywriting", "content marketing"];
//       attachments = ?[
//         {
//           imageUrl = "https://example.com/portfolio/blog1.jpg";
//           imageTag = "Tech Blog Sample";
//         },
//         {
//           imageUrl = "https://example.com/portfolio/blog2.jpg";
//           imageTag = "Health Article Sample";
//         },
//       ];
//       tiers = [
//         {
//           id = "basic";
//           name = "Basic";
//           description = "500-word blog post with basic SEO";
//           price = 50_000_000; // 0.5 ICP in smallest units
//           deliveryDays = 2;
//           revisions = 1;
//           features = ["500 Words", "Basic SEO Keywords", "1 Topic Research", "Proofread Content"];
//         },
//         {
//           id = "standard";
//           name = "Standard";
//           description = "1000-word comprehensive article with full SEO";
//           price = 100_000_000; // 1 ICP in smallest units
//           deliveryDays = 3;
//           revisions = 2;
//           features = ["1000 Words", "Competitor Research", "Complete SEO Integration", "Headline Suggestions", "Topic Research", "Proofread & Edited"];
//         },
//         {
//           id = "premium";
//           name = "Premium";
//           description = "2000-word in-depth content with advanced SEO strategy";
//           price = 200_000_000; // 2 ICP in smallest units
//           deliveryDays = 5;
//           revisions = 3;
//           features = ["2000 Words", "Advanced SEO Strategy", "Internal Linking Structure", "Meta Description", "Custom Images", "Full Topic Research", "Professional Editing", "Content Formatting"];
//         },
//       ];
//     };

//     let result = await Service.createService(freelancerId, blogService);

//     // Second service
//     let copywritingService : UnregisteredServiceFormData = {
//       title = "Professional Copywriting for Websites & Marketing";
//       description = "I will create persuasive, conversion-focused copy for your website, landing pages, emails, or ads. My compelling writing will boost engagement, conversions, and help you connect with your audience.";
//       category = "Writing";
//       subcategory = "Copywriting";
//       currency = "ICP";
//       status = "Active";
//       tags = ["copywriting", "website copy", "marketing copy", "sales copy", "conversion"];
//       attachments = ?[
//         {
//           imageUrl = "https://example.com/portfolio/copy1.jpg";
//           imageTag = "Landing Page Sample";
//         },
//         {
//           imageUrl = "https://example.com/portfolio/copy2.jpg";
//           imageTag = "Email Campaign Sample";
//         },
//       ];
//       tiers = [
//         {
//           id = "basic";
//           name = "Basic";
//           description = "Website page or short marketing copy";
//           price = 80_000_000; // 0.8 ICP in smallest units
//           deliveryDays = 2;
//           revisions = 2;
//           features = ["1 Page (up to 500 words)", "Target Audience Analysis", "Basic SEO", "Brand Voice Integration"];
//         },
//         {
//           id = "standard";
//           name = "Standard";
//           description = "Multiple pages or comprehensive marketing campaign";
//           price = 150_000_000; // 1.5 ICP in smallest units
//           deliveryDays = 4;
//           revisions = 3;
//           features = ["3 Pages (up to 1500 words)", "Competitor Analysis", "Advanced SEO", "Call-to-Action Optimization", "A/B Testing Options"];
//         },
//         {
//           id = "premium";
//           name = "Premium";
//           description = "Complete website copy or full marketing suite";
//           price = 300_000_000; // 3 ICP in smallest units
//           deliveryDays = 7;
//           revisions = 5;
//           features = ["Full Website (up to 10 pages)", "Comprehensive Market Research", "Conversion Strategy", "Full SEO Integration", "Customer Journey Mapping", "Sales Psychology", "Brand Voice Guidelines"];
//         },
//       ];
//     };

//     let result2 = await Service.createService(freelancerId, copywritingService);
//   };

//   private func createMobileDevelopmentServices(freelancerId : Principal, timestamp : Int) : async () {
//     let mobileAppService : UnregisteredServiceFormData = {
//       title = "Custom Mobile App Development";
//       description = "I will develop a high-quality, user-friendly mobile application for iOS and Android using React Intive, Flutter, or native technologies. Get a professional app that meets your business requirements and delights users.";
//       category = "Development";
//       subcategory = "Mobile Development";
//       currency = "ICP";
//       status = "Active";
//       tags = ["mobile app", "app development", "react native", "flutter", "iOS", "Android"];
//       attachments = ?[
//         {
//           imageUrl = "https://example.com/portfolio/app1.jpg";
//           imageTag = "E-commerce App";
//         },
//         {
//           imageUrl = "https://example.com/portfolio/app2.jpg";
//           imageTag = "Fitness Tracking App";
//         },
//       ];
//       tiers = [
//         {
//           id = "basic";
//           name = "Basic";
//           description = "Simple app with basic features (single platform)";
//           price = 500_000_000; // 5 ICP in smallest units
//           deliveryDays = 15;
//           revisions = 2;
//           features = ["Single Platform (iOS or Android)", "3-5 Screens", "Basic UI/UX", "Core Functionality", "App Store Submission Guide"];
//         },
//         {
//           id = "standard";
//           name = "Standard";
//           description = "Full-featured app for both platforms";
//           price = 1_000_000_000; // 10 ICP in smallest units
//           deliveryDays = 30;
//           revisions = 3;
//           features = ["Both iOS & Android", "Up to 10 Screens", "Custom UI/UX Design", "API Integration", "User Authentication", "Basic Backend", "App Store Submission"];
//         },
//         {
//           id = "premium";
//           name = "Premium";
//           description = "Advanced app with all features and ongoing support";
//           price = 2_000_000_000; // 20 ICP in smallest units
//           deliveryDays = 45;
//           revisions = 5;
//           features = ["Both iOS & Android", "Unlimited Screens", "Premium UI/UX", "Complex API Integration", "Offline Functionality", "Push Notifications", "Analytics Integration", "Advanced Backend", "App Store Submission", "3 Months Support"];
//         },
//       ];
//     };

//     let result = await Service.createService(freelancerId, mobileAppService);
//   };

//   private func createVideoEditingServices(freelancerId : Principal, timestamp : Int) : async () {
//     let videoEditingService : UnregisteredServiceFormData = {
//       title = "Professional Video Editing & Motion Graphics";
//       description = "I will create stunning, professionally edited videos with eye-catching motion graphics and animations. Perfect for marketing, social media, YouTube, or corporate presentations.";
//       category = "Video & Animation";
//       subcategory = "Video Editing";
//       currency = "ICP";
//       status = "Active";
//       tags = ["video editing", "motion graphics", "animation", "after effects", "premiere pro"];
//       attachments = ?[
//         {
//           imageUrl = "https://example.com/portfolio/video1.jpg";
//           imageTag = "Marketing Video";
//         },
//         {
//           imageUrl = "https://example.com/portfolio/video2.jpg";
//           imageTag = "Animated Explainer";
//         },
//       ];
//       tiers = [
//         {
//           id = "basic";
//           name = "Basic";
//           description = "Simple video edit up to 1 minute";
//           price = 150_000_000; // 1.5 ICP in smallest units
//           deliveryDays = 3;
//           revisions = 2;
//           features = ["Up to 1 minute", "Basic Color Correction", "Simple Transitions", "Royalty-Free Music", "1080p Export"];
//         },
//         {
//           id = "standard";
//           name = "Standard";
//           description = "Professional edit with motion graphics up to 3 minutes";
//           price = 300_000_000; // 3 ICP in smallest units
//           deliveryDays = 5;
//           revisions = 3;
//           features = ["Up to 3 minutes", "Advanced Color Grading", "Custom Transitions", "Basic Motion Graphics", "Logo Animation", "Royalty-Free Music & SFX", "4K Export"];
//         },
//         {
//           id = "premium";
//           name = "Premium";
//           description = "Advanced production with complex animations up to 5 minutes";
//           price = 600_000_000; // 6 ICP in smallest units
//           deliveryDays = 10;
//           revisions = 5;
//           features = ["Up to 5 minutes", "Professional Color Grading", "Complex Motion Graphics", "Character Animation", "Custom Visual Effects", "Subtitles", "Voice Over Direction", "Premium Music & SFX", "4K Export"];
//         },
//       ];
//     };

//     let result = await Service.createService(freelancerId, videoEditingService);

//     // Second service
//     let animationService : UnregisteredServiceFormData = {
//       title = "2D Animated Explainer Videos";
//       description = "I will create engaging 2D animated explainer videos that simplify complex ideas and captivate your audience. Perfect for products, services, or educational content.";
//       category = "Video & Animation";
//       subcategory = "Animation";
//       currency = "ICP";
//       status = "Active";
//       tags = ["2D animation", "explainer video", "animated video", "motion graphics", "storytelling"];
//       attachments = ?[
//         {
//           imageUrl = "https://example.com/portfolio/anim1.jpg";
//           imageTag = "Product Explainer";
//         },
//         {
//           imageUrl = "https://example.com/portfolio/anim2.jpg";
//           imageTag = "Educational Animation";
//         },
//       ];
//       tiers = [
//         {
//           id = "basic";
//           name = "Basic";
//           description = "30-second animated explainer";
//           price = 300_000_000; // 3 ICP in smallest units
//           deliveryDays = 7;
//           revisions = 2;
//           features = ["30 Seconds", "Storyboard", "Basic Animation", "Stock Music", "1 Character", "1080p Export"];
//         },
//         {
//           id = "standard";
//           name = "Standard";
//           description = "60-second professional animation";
//           price = 500_000_000; // 5 ICP in smallest units
//           deliveryDays = 14;
//           revisions = 3;
//           features = ["60 Seconds", "Custom Storyboard", "Professional Animation", "Custom Music", "2 Characters", "Voice Over", "4K Export"];
//         },
//         {
//           id = "premium";
//           name = "Premium";
//           description = "2-minute premium animated video";
//           price = 1_000_000_000; // 10 ICP in smallest units
//           deliveryDays = 21;
//           revisions = 5;
//           features = ["120 Seconds", "Advanced Storyboard", "Premium Animation", "Custom Character Design", "Professional Voice Over", "Custom Music & SFX", "Script Assistance", "4K Export"];
//         },
//       ];
//     };

//     let result2 = await Service.createService(freelancerId, animationService);
//   };

//   private func createSocialMediaServices(freelancerId : Principal, timestamp : Int) : async () {
//     let socialMediaService : UnregisteredServiceFormData = {
//       title = "Social Media Management & Content Creation";
//       description = "I will manage your social media accounts and create engaging content that grows your audience and builds your brand. Complete with strategy, content creation, scheduling, and analytics.";
//       category = "Digital Marketing";
//       subcategory = "Social Media";
//       currency = "ICP";
//       status = "Active";
//       tags = ["social media", "content creation", "digital marketing", "instagram", "facebook", "tiktok"];
//       attachments = ?[
//         {
//           imageUrl = "https://example.com/portfolio/social1.jpg";
//           imageTag = "Instagram Campaign";
//         },
//         {
//           imageUrl = "https://example.com/portfolio/social2.jpg";
//           imageTag = "Content Calendar";
//         },
//       ];
//       tiers = [
//         {
//           id = "basic";
//           name = "Basic";
//           description = "Management of 1 platform with weekly content";
//           price = 200_000_000; // 2 ICP in smallest units
//           deliveryDays = 7; // Ongoing service, initial setup time
//           revisions = 2;
//           features = ["1 Social Platform", "Content Strategy", "4 Posts per Month", "Basic Graphics", "Monthly Report", "Hashtag Research"];
//         },
//         {
//           id = "standard";
//           name = "Standard";
//           description = "Management of 2 platforms with consistent content";
//           price = 400_000_000; // 4 ICP in smallest units
//           deliveryDays = 5; // Faster initial setup
//           revisions = 3;
//           features = ["2 Social Platforms", "Comprehensive Strategy", "12 Posts per Month", "Custom Graphics", "Engagement Monitoring", "Bi-weekly Reports", "Competitor Analysis"];
//         },
//         {
//           id = "premium";
//           name = "Premium";
//           description = "Full management of 3 platforms with premium content";
//           price = 800_000_000; // 8 ICP in smallest units
//           deliveryDays = 3; // Priority setup
//           revisions = 5;
//           features = ["3 Social Platforms", "Advanced Growth Strategy", "Daily Posts", "Premium Graphics & Videos", "Community Management", "Influencer Outreach", "Weekly Analytics", "Performance Optimization"];
//         },
//       ];
//     };

//     let result = await Service.createService(freelancerId, socialMediaService);
//   };

//   private func createDataAnalysisServices(freelancerId : Principal, timestamp : Int) : async () {
//     let dataAnalysisService : UnregisteredServiceFormData = {
//       title = "Data Analysis & Visualization Services";
//       description = "I will analyze your data and create insightful visualizations and reports to help you make data-driven decisions. Using Python, R, and advanced visualization tools to uncover hidden patterns in your data.";
//       category = "Data";
//       subcategory = "Data Analysis";
//       currency = "ICP";
//       status = "Active";
//       tags = ["data analysis", "data visualization", "python", "R", "statistics", "business intelligence"];
//       attachments = ?[
//         {
//           imageUrl = "https://example.com/portfolio/data1.jpg";
//           imageTag = "Sales Analysis Dashboard";
//         },
//         {
//           imageUrl = "https://example.com/portfolio/data2.jpg";
//           imageTag = "Marketing Performance Report";
//         },
//       ];
//       tiers = [
//         {
//           id = "basic";
//           name = "Basic";
//           description = "Basic data analysis with simple visualizations";
//           price = 150_000_000; // 1.5 ICP in smallest units
//           deliveryDays = 3;
//           revisions = 2;
//           features = ["Up to 1000 data points", "Data Cleaning", "Basic Analysis", "3 Visualizations", "Summary Report", "Excel/CSV Output"];
//         },
//         {
//           id = "standard";
//           name = "Standard";
//           description = "Comprehensive analysis with interactive visualizations";
//           price = 300_000_000; // 3 ICP in smallest units
//           deliveryDays = 5;
//           revisions = 3;
//           features = ["Up to 10,000 data points", "Advanced Data Cleaning", "Statistical Analysis", "5 Interactive Visualizations", "Detailed Report", "Dashboard Creation", "Insights & Recommendations"];
//         },
//         {
//           id = "premium";
//           name = "Premium";
//           description = "Advanced analytics with predictive modeling";
//           price = 600_000_000; // 6 ICP in smallest units
//           deliveryDays = 10;
//           revisions = 5;
//           features = ["Unlimited Data Points", "Complete Data Processing", "Advanced Statistical Analysis", "Predictive Modeling", "10 Custom Visualizations", "Interactive Dashboard", "Executive Summary", "Full Technical Report", "Presentation of Findings"];
//         },
//       ];
//     };

//     let result = await Service.createService(freelancerId, dataAnalysisService);

//     // Second service
//     let machineLearningSvc : UnregisteredServiceFormData = {
//       title = "Machine Learning & AI Model Development";
//       description = "I will develop custom machine learning and AI models to solve your specific business problems. From predictive analytics to recommendation systems, get data-driven solutions tailored to your needs.";
//       category = "Data";
//       subcategory = "Machine Learning";
//       currency = "ICP";
//       status = "Active";
//       tags = ["machine learning", "AI", "predictive models", "python", "data science"];
//       attachments = ?[
//         {
//           imageUrl = "https://example.com/portfolio/ml1.jpg";
//           imageTag = "Predictive Model";
//         },
//         {
//           imageUrl = "https://example.com/portfolio/ml2.jpg";
//           imageTag = "Classification Results";
//         },
//       ];
//       tiers = [
//         {
//           id = "basic";
//           name = "Basic";
//           description = "Simple ML model development";
//           price = 400_000_000; // 4 ICP in smallest units
//           deliveryDays = 7;
//           revisions = 2;
//           features = ["Single ML Model", "Data Preprocessing", "Model Training", "Basic Evaluation", "Python Implementation", "Documentation"];
//         },
//         {
//           id = "standard";
//           name = "Standard";
//           description = "Advanced ML solution with optimization";
//           price = 800_000_000; // 8 ICP in smallest units
//           deliveryDays = 14;
//           revisions = 3;
//           features = ["Custom ML Solution", "Feature Engineering", "Model Optimization", "Cross-Validation", "API Integration", "Performance Metrics", "Technical Documentation"];
//         },
//         {
//           id = "premium";
//           name = "Premium";
//           description = "Enterprise-grade AI system development";
//           price = 1_500_000_000; // 15 ICP in smallest units
//           deliveryDays = 21;
//           revisions = 5;
//           features = ["Complete AI System", "Advanced Architecture", "Multiple Models", "Hyperparameter Optimization", "Deployment Strategy", "API Creation", "Monitoring Setup", "Comprehensive Documentation", "Knowledge Transfer Session"];
//         },
//       ];
//     };

//     let result2 = await Service.createService(freelancerId, machineLearningSvc);
//   };

// };
