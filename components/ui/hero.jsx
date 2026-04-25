"use client";
import React, { useRef, useEffect } from "react";
// ... baki imports

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
    const imageRef = useRef(null);

    useEffect(() => {
        const imageElement = imageRef.current;

        const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const scrollThreshold = 100;

        if (scrollPosition > scrollThreshold) {
            imageElement.classList.add("scrolled");
        } else {
            imageElement.classList.remove("scrolled");
        }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className="w-full pt-36 md:pt-48 pb-10">
            <div className="space-y-6 text-center">
                <div className="space-y-6 mx-auto">
                    <h1 className="text-5xl font-bold md:text-6x1 lg:text-7xl xl:text-8x1 gradient-title">
                        Your AI Career Coach for
                        <br />
                        Professional Success
                    </h1>
                    <p className="mx-auto max-w-[600px] text-muted-foreground md:text-x1">
                        Advance your career with personalized guidance, interview prep, and AI- powered tools for job success.
                    </p>
                </div>
                <div className="flex justify-center space-x-4">
                    <Link href="/dashboard">
                    <Button size="lg" className="px-8">
                        Get Started
                        </Button>
                        </Link>
                </div>
                <div className="hero-image-wrapper mt-5 md:mt-0">
                    <div ref={imageRef} className="hero-image">
                        <Image
                        src={"/banner.jpeg"}
                        width={1280}
                        height={720}
                        alt="Banner Sensai"
                        className="rounded-lg shadow-2x1 border mx-auto"
                        priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;