"use client"

import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import SplineComponent from "@/components/ui/SplineComponent";



export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 text-white bg-gray-950 h-[74.5vh]">
        

        {/* Carousel for Messages */}
        <div className="flex flex-row w-full justify-center items-center">
          
          <div className="md:w-1/2 w-full">
          <section className="text-center mb-8 md:mb-12">
          <h1 className="text-xl md:text-3xl font-bold">
            Whether it’s a quick text, honest feedback, or just fun
            interactions, stay completely incognito while connecting with
            others.
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg font-bold text-green-500">
            TextIncognito - Text Anything to Anyone. Stay Anonymous...
          </p>
        </section>
            <Carousel
              plugins={[Autoplay({ delay: 2500 })]}
              className="w-full max-w-lg md:max-w-xl"
            >
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem key={index} className="p-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>{message.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                        <Mail className="flex-shrink-0" />
                        <div>
                          <p>{message.content}</p>
                          <p className="text-xs text-muted-foreground">
                            {message.received}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
          <div className="md:w-1/2 w-0">
            <SplineComponent/>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2025 TextIncognito. All rights reserved.
      </footer>
    </>
  );
}
