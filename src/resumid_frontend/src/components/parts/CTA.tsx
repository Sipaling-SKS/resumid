import { ArrowRightIcon } from "lucide-react";
import { Button } from "../ui/button";

function CTA() {
  return (
    <section className="responsive-container bg-[#f4f4f4] bg-gradient-to-r py-16 border-b border-neutral-200 flex justify-center py-28">
      <div className="relative w-full max-w-6xl h-[120px] md:h-[140px] flex flex-col justify-between px-8 py-4 rounded-bl-lg rounded-br-lg rounded-tr-lg bg-gradient-to-r from-primary-500 to-accent-500 shadow-lg text-white lg:ml-0 ml-4">
        
        <div className="absolute top-[-20px] sm:top-[-30px] left-[-20px] sm:left-[-30px] w-[20px] h-[20px] sm:w-[30px] sm:h-[30px] bg-primary-500 from-primary-500 to-accent-500 
            clip-path-[polygon(100%_0%,_100%_100%,_50%_100%,_0%_50%,_0%_0%)] 
            shadow-md">
        </div>

        <div className="flex flex-col md:flex-row justify-start md:justify-between items-center h-full lg:mt-8 mt-2"> 
        
          <h2 className="sm:text-xl md:text-2xl font-semibold text-left font-inter">
            Ready to Level Up Your Resume?
          </h2>

          <div className="z-10 lg:mt-0 mt-6">
            <Button className="bg-white" variant="secondary" size="lg">
              Get Started
              <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
