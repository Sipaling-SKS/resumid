import { ArrowRightIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

function CTA() {
  const navigate = useNavigate();

  return (
    <section className="responsive-container bg-[#f4f4f4] border-b border-neutral-200 flex justify-center py-16 md:py-28">
      <div className="relative w-full max-w-6xl flex flex-col justify-between px-4 md:px-8 py-4 md:py-8 md:pt-16 rounded-bl-lg rounded-br-lg rounded-tr-lg bg-gradient-to-r from-primary-500 to-accent-500 shadow-lg text-white ml-[20px]">

        <div className="absolute top-[-20px] sm:top-[-30px] left-[-20px] sm:left-[-30px] w-[20px] h-[20px] sm:w-[30px] sm:h-[30px] bg-primary-500 from-primary-500 to-accent-500 
            clip-path-[polygon(100%_0%,_100%_100%,_50%_100%,_0%_50%,_0%_0%)] 
            shadow-md">
        </div>

        <div className="flex flex-col md:flex-row justify-start md:justify-between md:items-center h-full lg:mt-8 mt-0">

          <h2 className="sm:text-xl md:text-2xl font-semibold text-left font-inter">
            Ready to Level Up Your Resume?
          </h2>

          <div className="z-10 lg:mt-0 mt-4">
            <Button className="bg-white text-paragraph hover:text-paragraph" variant="grey" size="lg" onClick={() => navigate("/resume-analyzer")}>
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
