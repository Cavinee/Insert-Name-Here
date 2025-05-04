"use client"

import { Link } from "react-router-dom";
import { GlowingEffect } from "./ui/glowing-effect";
import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";

export function FeaturedServicesList() {
    return (
      <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
      <GridItem
          area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
          icon={<Box className="h-4 w-4 text-black dark:text-neutral-400" />}
          title="Web Development"
          description="Get your website built by expert developers using the latest technologies."
          link="/services?category=WebDevelopment"
      />

      <GridItem
          area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
          icon={<Settings className="h-4 w-4 text-black dark:text-neutral-400" />}
          title="Mobile Development"
          description="Build responsive and high-performance mobile applications."
          link="/services?category=MobileDevelopment"
      />

      <GridItem
          area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/2/8]"
          icon={<Lock className="h-4 w-4 text-black dark:text-neutral-400" />}
          title="Machine Learning"
          description="Leverage AI and machine learning to solve complex problems."
          link="/services?category=MachineLearning"
      />

      <GridItem
          area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
          icon={<Sparkles className="h-4 w-4 text-black dark:text-neutral-400" />}
          title="Cloud Services"
          description="Scale your business with cloud computing solutions."
          link="/services?category=CloudServices"
      />

      <GridItem
          area="md:[grid-area:3/1/4/7] xl:[grid-area:2/5/3/8]"
          icon={<Search className="h-4 w-4 text-black dark:text-neutral-400" />}
          title="Software Testing"
          description="Ensure the quality of your software with professional testing services."
          link="/services?category=SoftwareTesting"
      />

      <GridItem
          area="md:[grid-area:3/7/4/13] xl:[grid-area:2/8/3/13]"
          icon={<Box className="h-4 w-4 text-black dark:text-neutral-400" />}
          title="Technical Writing"
          description="Produce clear and concise technical documentation."
          link="/services?category=TechnicalWriting"
      />
  </ul>
    );
}

interface GridItemProps {
    area: string;
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
    link: string;
}
   
const GridItem = ({ area, icon, title, description, link }: GridItemProps) => {
    return (
      <li className={`min-h-[14rem] list-none ${area}`}>
        <Link to={link} className="block h-full">
          <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3 hover:shadow-lg transition-shadow">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
              <div className="relative flex flex-1 flex-col justify-between gap-3">
                <div className="w-fit rounded-lg border border-gray-600 p-2">
                  {icon}
                </div>
                <div className="space-y-3">
                  <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                    {title}
                  </h3>
                  <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                    {description}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </li>
    );
  };