import { useSearchParams, useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import ProfileCard from "@/components/parts/ProfileCard";
import SkeletonProfileCard from "@/components/parts/skeleton/SkeletonProfileCard";
import { Search, SearchX, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useRef, useEffect } from "react";

// Static mock data for testing
const MOCK_PEOPLE = [
  {
    id: "2",
    name: "Michael Chen",
    role: "Full Stack Engineer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    endorsements: [1]
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "UX/UI Designer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    endorsements: [1, 2, 3, 4, 5, 6]
  },
  {
    id: "4",
    name: "David Kim",
    role: "DevOps Engineer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    endorsements: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  },
  {
    id: "5",
    name: "Lisa Thompson",
    role: "Product Manager",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    endorsements: []
  },
  {
    id: "6",
    name: "Alex Martinez",
    role: "Data Scientist",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    endorsements: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  }
];

async function searchPeople(query: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  if (Math.random() < 0.1) {
    throw new Error('Search service temporarily unavailable');
  }
  
  const filteredPeople = MOCK_PEOPLE.filter(person => 
    person.name.toLowerCase().includes(query.toLowerCase()) ||
    person.role.toLowerCase().includes(query.toLowerCase())
  );
  
  return filteredPeople;
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  
  const {
    data: people = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['searchPeople', query],
    queryFn: () => searchPeople(query),
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
  
  const profileText = people.length <= 1 ? 'profile' : 'profiles';

  const handleProfileClick = (id: string) => {
    navigate(`/profile/${id}`);
  };

  const handleRetry = () => {
    refetch();
  };

  const handleTryNewSearch = () => {   
    setTimeout(() => {
      const searchInput = document.querySelector('input[placeholder*="search"], input[placeholder*="Search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }, 100);
  };

  const CountDisplay = () => {
    if (isLoading) {
      return (
        <span className="inline-flex items-center">
          <span className="text-2xl md:text-3xl font-bold text-primary-600 bg-gray-200 rounded animate-pulse" style={{width: '0.75em', height: '1em', display: 'inline-block'}}></span>
        </span>
      );
    }
    
    if (error) {
      return (
        <span className="text-2xl md:text-3xl font-bold text-red-500">--</span>
      );
    }
    
    return (
      <span className="text-2xl md:text-3xl font-bold text-primary-600">{people.length}</span>
    );
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Search Results - Resumid</title>
      </Helmet>

      <main className="min-h-screen py-6 md:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="mb-8">
            <h1 className="text-xl md:text-2xl font-semibold text-heading font-outfit text-center">
              Search Results
            </h1>
             {(!error && people.length > 0) && (
              <p className="text-center text-paragraph font-inter">
                Found <CountDisplay /> {profileText} with the keyword of <em className="italic text-heading">{query}</em>
              </p>
            )}
          </section>

          <section>
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <SkeletonProfileCard key={idx} />
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="p-6 bg-red-50 rounded-full inline-block mb-6">
                  <SearchX className="w-12 h-12 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-heading mb-3 font-outfit">
                  Search Error
                </h3>
                <p className="text-paragraph font-inter text-center mb-6 max-w-md">
                  {error.message || 'Something went wrong while searching. Please try again.'}
                </p>
                <Button 
                  onClick={handleRetry}
                  variant="gradient"
                  className="inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
              </div>
            ) : people.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {people.map((person) => (
                  <ProfileCard
                    key={person.id}
                    person={person}
                    onClick={handleProfileClick}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="p-6 bg-neutral-50 rounded-full inline-block mb-6">
                  <Search className="w-12 h-12 text-neutral-400" />
                </div>
                <h3 className="text-xl font-semibold text-heading mb-3 font-outfit">
                  No Results Found
                </h3>
                <p className="text-sm text-paragraph font-inter text-center mb-6">
                  Please try again with another keyowrd.
                </p>
                <Button 
                  onClick={handleTryNewSearch}
                  variant="gradient"
                  className="inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}