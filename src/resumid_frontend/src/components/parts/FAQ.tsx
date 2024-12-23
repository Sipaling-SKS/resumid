import Highlight from "@/components/highlight";
import auah from "@/assets/auah.svg";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"; 


const AccordionSection = () => {
  const accordionData = [
    {
      title: "How does the AI analyze resumes?",
      description:
        "AI analyzes resumes by extracting key information like skills, experience, and education using natural language processing. It then matches this data with job requirements to assess the candidate’s suitability.",
    },
    {
      title: "What formats are supported?",
      description:
        "CVs are supported in PDF format, ensuring proper formatting and easy readability across platforms.",
    },
    {
      title: "Is my data secure?",
      description:
        "Yes. It’s secure by default. We’re using Web3 technologies and everything is decentralized ensuring user security.",
    },
  ];

  return (
    <div className="w-full">
      <Accordion type="single" collapsible>
        {accordionData.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border-b"
          >
            {/* Judul Accordion */}
            <AccordionTrigger className="font-inter w-full text-left py-4 font-semibold text-lg text-paragraph">
              {item.title}
            </AccordionTrigger>
            {/* Deskripsi Accordion */}
            <AccordionContent className="overflow-hidden">
              <div className="text-paragraph">
                {item.description}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

function FAQ() {
  return (
    <section className="responsive-container flex flex-col md:flex-row justify-center md:justify-between items-start py-12 md:py-16 border-b border-neutral-200 md:gap-16 gap-8"> 
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h2 className="font-outfit font-semibold text-3xl md:text-4xl text-balance leading-tight text-heading">
          <Highlight>Got Questions?</Highlight> We’ve Got
          <span className="block">Answers.</span>
        </h2>
        <div className="lg:mt-10">
          <img src={auah} alt="Illustrasi FAQ" className="mx-auto md:mx-0" />
        </div>
      </div>
      <div className="flex items-center w-full md:w-1/2 p-6 md:p-0">
        <AccordionSection />
      </div>
      {/* <div className="w-full md:w-[60%] lg:mt-10 md:mt-0 -mr-20 md:ml-8 md:pt-12">
        <div className="w-full max-w-none">
        </div>
      </div> */}
    </section>
  );
}

export default FAQ;
