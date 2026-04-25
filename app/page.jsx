import HeroSection from "@/components/ui/hero";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, BrainCircuit, Briefcase, LineChart, ScrollText } from "lucide-react";
import Image from "next/image";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// Ye array function ke BAHAR hona chahiye
export const features = [
  {
    icon: <BrainCircuit className="w-10 h-10 mb-4 text-primary" />,
    title: "AI-Powered Career Guidance",
    description:
      "Get personalized career advice and insights powered by advanced AI technology.",
  },
  {
    icon: <Briefcase className="w-10 h-10 mb-4 text-primary" />,
    title: "Interview Preparation",
    description:
      "Practice with role-specific questions and get instant feedback to improve your performance.",
  },
  {
    icon: <LineChart className="w-10 h-10 mb-4 text-primary" />,
    title: "Industry Insights",
    description:
      "Stay ahead with real-time industry trends, salary data, and market analysis.",
  },
  {
    icon: <ScrollText className="w-10 h-10 mb-4 text-primary" />,
    title: "Smart Resume Creation",
    description: "Generate ATS-optimized resumes with AI assistance.",
  },
];

import { UserPlus, FileEdit, Users } from "lucide-react";
import Link from "next/link";

export const howItWorks = [
  {
    title: "Professional Onboarding",
    description: "Share your industry and expertise for personalized guidance",
    icon: <UserPlus className="w-8 h-8 text-primary" />,
  },
  {
    title: "Craft Your Documents",
    description: "Create ATS-optimized resumes and compelling cover letters",
    icon: <FileEdit className="w-8 h-8 text-primary" />,
  },
  {
    title: "Prepare for Interviews",
    description:
      "Practice with AI-powered mock interviews tailored to your role",
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    title: "Track Your Progress",
    description: "Monitor improvements with detailed performance analytics",
    icon: <LineChart className="w-8 h-8 text-primary" />,
  },
];

export const testimonial = [
  {
    quote:
      "The AI-powered interview prep was a game-changer. Landed my dream job at a top tech company!",
    author: "Sarah Chen",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
    role: "Software Engineer",
    company: "Tech Giant Co.",
  },
  {
    quote:
      "The industry insights helped me pivot my career successfully. The salary data was spot-on!",
    author: "Michael Rodriguez",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    role: "Product Manager",
    company: "StartUp Inc.",
  },
  {
    quote:
      "My resume's ATS score improved significantly. Got more interviews in two weeks than in six months!",
    author: "Priya Patel",
    image: "https://randomuser.me/api/portraits/women/74.jpg",
    role: "Marketing Director",
    company: "Global Corp",
  },
];

export const faqs = [
  {
    question: "What makes Sensai unique as a career development tool?",
    answer:
      "Sensai combines AI-powered career tools with industry-specific insights to help you advance your career. Our platform offers three main features: an intelligent resume builder, a cover letter generator, and an adaptive interview preparation system. Each tool is tailored to your industry and skills, providing personalized guidance for your professional journey.",
  },
  {
    question: "How does Sensai create tailored content?",
    answer:
      "Sensai learns about your industry, experience, and skills during onboarding. It then uses this information to generate customized resumes, cover letters, and interview questions. The content is specifically aligned with your professional background and industry standards, making it highly relevant and effective.",
  },
  {
    question: "How accurate and up-to-date are Sensai's industry insights?",
    answer:
      "We update our industry insights weekly using advanced AI analysis of current market trends. This includes salary data, in-demand skills, and industry growth patterns. Our system constantly evolves to ensure you have the most relevant information for your career decisions.",
  },
  {
    question: "Is my data secure with Sensai?",
    answer:
      "Absolutely. We prioritize the security of your professional information. All data is encrypted and securely stored using industry-standard practices. We use Clerk for authentication and never share your personal information with third parties.",
  },
  {
    question: "How can I track my interview preparation progress?",
    answer:
      "Sensai tracks your performance across multiple practice interviews, providing detailed analytics and improvement suggestions. You can view your progress over time, identify areas for improvement, and receive AI-generated tips to enhance your interview skills based on your responses.",
  },
  {
    question: "Can I edit the AI-generated content?",
    answer:
      "Yes! While Sensai generates high-quality initial content, you have full control to edit and customize all generated resumes, cover letters, and other content. Our markdown editor makes it easy to refine the content to perfectly match your needs.",
  },
];

export default function Home() {
  return (
    <div>
      <div className="grid-background"></div>

      <HeroSection />

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6"> 
          <h2 className="text-3x1 font-bold tracking-tighter text-center mb-12">
            Powerful Features for your Career Growth
            </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6x1 mx-auto">
            {features.map((feature,index)=>{
            return (
              <Card 
              key={index}
              className="border-2 hover:border-primary transition-colors duration-300"
              >
  
  <CardContent className="pt-6 text-center flex flex-col items-center">
    <div className="flex flex-col items-center justify-center">
      {features.icon}
      <h3 className="text-x1 font-bold mb-2">
        {feature.title}
        </h3>
      <p className="text-muted-foreground">
        {feature.description}
        </p>
    </div>
  </CardContent>
  
</Card>
            );
            
})}
            </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6"> 
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6x1 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4x1 font-bold">50+</h3>
              <p className="text-muted-foreground">Industies Covered</p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4x1 font-bold">1000+</h3>
              <p className="text-muted-foreground">Interview Questions</p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4x1 font-bold">95%</h3>
              <p className="text-muted-foreground">Success Rate</p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4x1 font-bold">24/7</h3>
              <p className="text-muted-foreground">AI Support</p>
            </div>

            </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6"> 
          <div className="text-center max-w-3x1 mx-auto mb-12">
          <h2 className="text-3x1 font-bold mb-4">
            How It Works
            </h2>
            <p className="text-muted-foreground">
              Four simple steps to accelerate your career growth
            </p>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6x1 mx-auto">
            {howItWorks.map((item, index) => {
            return (
              <div key={index}
              className="flex flex-col items-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                {item.icon}

                  </div>
                  <h3 className="font-semibold text-xl">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                  </div>
              
            );
            
})}
            </div>
        </div>
      </section>

      

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6"> 
          <div className="text-center max-w-3x1 mx-auto mb-12">
          <h2 className="text-3x1 font-bold mb-4">
            Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Find answers to common questions about our platform
            </p>
            </div>
          <div className="max-w-6x1 mx-auto">
            <Accordion type="single" collapsible className="w-full">
  {faqs.map((faqs, index) => {
              return (
                <AccordionItem key={index} value={`item-${index}`}>
    <AccordionTrigger>{faqs.question}</AccordionTrigger>
    <AccordionContent>
      {faqs.answer}
    </AccordionContent>
  </AccordionItem>
              );
            
            
})}
  
</Accordion>
            
            </div>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto py-24 gradient rounded-lg"> 
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3x1 mx-auto">
          <h2 className="text-3x1 font-bold tracking-tighter text-primary-foreground sm:text-4x1 md:text-5x1">
           Ready to Accelerate Your Career?
            </h2>
            <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-x1">
              Join thousands of professionals who are advancing their careers with AI-powered guidance.
            </p>
            <Link href="/dashboard" passHref>
            <Button 
            size="lg"
            variants="secondary"
            className="h-11 mt-5 animate-bounce"
            >
              Start Your Journey Today <ArrowRight className="m1-2 h-4 w-4" />
            </Button>
            </Link>
            </div>
        
        </div>
      </section>



    </div>
  );
}
