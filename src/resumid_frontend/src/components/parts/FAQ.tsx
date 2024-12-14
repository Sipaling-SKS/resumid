import Highlight from "@/components/highlight";
import auah from "@/assets/auah.svg";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"; 


const AccordionSection = () => {
  const accordionData = [
    { title: "How does the AI analyze resumes?", description: "React is a JavaScript library for building user interfaces." },
    { title: "What formats are supported?", description: "Radix UI provides low-level, unstyled components that are highly customizable." },
    { title: "Is my data secure?", description: "Yes. It’s secure by default. We’re using Web3 technologies and everything is decentralized ensuring user security." },
  ];

  return (
    <div className="w-full md:w-[80%]">
      <Accordion type="single" collapsible>
        {accordionData.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.description}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

// FAQ Komponen utama ing jgn lupa
function FAQ() {
  return (
    <header className="responsive-container flex flex-col md:flex-row justify-between items-start md:py-16 border-b border-neutral-200 min-h-[70vh] gap-16">
      <div className="w-full md:w-1/2 text-center md:text-left pr-6">
        <h2 className="font-outfit font-semibold text-[36px] text-balance leading-tight text-heading">
          <Highlight>Got Questions?</Highlight> We’ve Got
          <span className="block mt-2">Answers.</span>
        </h2>
        <div className="mt-12">
          <img src={auah} alt="Illustrasi FAQ" className="mx-auto md:mx-0" />
        </div>
      </div>

      <div className="w-full md:w-[60%] mt-16 md:mt-0 -mr-20 md:ml-8 md:pt-12">
        <div className="w-full max-w-none">
          <AccordionSection />
        </div>
      </div>
    </header>
  );
}

export default FAQ;
