// // "use client"

// import { CardBody, CardContainer, CardItem } from "./ui/3d-card"
// import { Button } from "./ui/button"
// import { Link } from "react-router-dom"

// export function SpotlightSection() {
//   return (
//     <section className="py-16 md:py-24">
//       <div className="container mx-auto px-4">
//         <Spotlight className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//           <div>
//             <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Next Project?</h2>
//             <p className="text-muted-foreground mb-8 text-lg">
//               Whether you're looking to hire top talent or showcase your skills, our marketplace connects you with
//               opportunities worldwide.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4">
//               <Button size="lg" asChild>
//                 <Link to="/browse">Find Talent</Link>
//               </Button>
//               <Button size="lg" variant="outline" asChild>
//                 <Link to="/sell">Offer Services</Link>
//               </Button>
//             </div>
//           </div>

//           <CardContainer className="w-full">
//             <CardBody className="bg-card relative group/card dark:hover:shadow-2xl dark:hover:shadow-primary/[0.1] border border-border">
//               <CardItem translateZ={50} className="text-2xl font-bold text-center w-full">
//                 Join Our Global Community
//               </CardItem>
//               <CardItem
//                 as="p"
//                 translateZ={60}
//                 className="text-muted-foreground text-center text-sm max-w-sm mx-auto mt-4"
//               >
//                 Connect with clients and freelancers from over 150 countries
//               </CardItem>
//               <CardItem translateZ={100} className="w-full mt-8">
//                 <img
//                   src="/placeholder.svg?height=200&width=400&text=Global+Marketplace"
//                   alt="Global marketplace illustration"
//                   className="w-full h-auto rounded-xl"
//                 />
//               </CardItem>
//               <CardItem translateZ={80} className="text-center text-sm font-bold text-primary mt-4">
//                 Trusted by 10,000+ users worldwide
//               </CardItem>
//             </CardBody>
//           </CardContainer>
//         </Spotlight>
//       </div>
//     </section>
//   )
// }
