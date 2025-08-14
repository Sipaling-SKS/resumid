import { Card, CardContent } from "@/components/ui/card";
import { Award, UserRoundSearch } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  person: {
    id: string;
    name: string;
    role: string;
    image: string;
    endorsements: number;
  };
  onClick?: (id: string) => void;
  className?: string;
}

export default function ProfileCard({ person, onClick, className }: ProfileCardProps) {
  const handleClick = () => {
    onClick?.(person.id);
  };

  const displayEndorsements = person.endorsements > 10 ? "10+" : person.endorsements.toString();

  return (
    <Card 
      className={cn(
        "p-5 relative overflow-hidden transition-all duration-300 cursor-pointer hover:border-primary-500 group",
        className
      )}
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="flex items-start justify-start w-full">
          <div className="flex-shrink-0">
            <img 
              src={person.image} 
              alt={person.name}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-2 border-neutral-200"
            />
          </div>
          
          <div className="flex-1 mx-4 min-w-0">
            <div className="space-y-1">
              <h3 className="font-semibold text-heading text-sm sm:text-base truncate font-inter">
                {person.name}
              </h3>
              <p className="text-xs sm:text-sm text-paragraph truncate font-inter">
                {person.role}
              </p>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4 text-primary-500" />
                <span className="text-xs text-paragraph font-inter">
                  <span className="text-base font-bold text-primary-600">{displayEndorsements}</span> endorsements
                </span>
              </div>
            </div>
          </div>
        </div>
        
       <div className="absolute -right-20 top-0 h-full flex items-center transform translate-x-0 group-hover:-translate-x-20 transition-transform duration-300 ease-out">
          <div className="bg-primary-500 h-full flex items-center px-4">
            <div className="flex flex-col items-center text-white">
              <UserRoundSearch className="w-6 h-6 mb-1" />
              <div className="text-[0.65rem] font-medium text-center leading-tight">
                <div>Learn</div>
                <div>More</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}