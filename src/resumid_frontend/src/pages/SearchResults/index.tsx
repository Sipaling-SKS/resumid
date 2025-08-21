import { useSearchParams, useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import ProfileCard from "@/components/parts/ProfileCard";
import SkeletonProfileCard from "@/components/parts/skeleton/SkeletonProfileCard";
import { Search, SearchX, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useRef, useEffect } from "react";
import { SearchResult } from "../../../../declarations/resumid_backend/resumid_backend.did";
import { useAuth } from "@/contexts/AuthContext";

async function searchPeople(resumidActor: any, query: string) {
  if (!resumidActor) {
    throw new Error('Backend actor not available');
  }
  
  if (!query.trim()) {
    return [];
  }
  
  try {
    const results: SearchResult[] = await resumidActor.searchProfiles(query);
    
    return results.map(result => {
      const name = result.profileDetail?.[0]?.name?.[0] || 'Unknown User';
      
      return {
        id: result.userId,
        name: name,
        role: result.profileDetail?.[0]?.current_position?.[0] || 'No position specified',
        image: result.profileDetail?.[0]?.profileCid?.[0] 
          ? `https://gateway.pinata.cloud/ipfs/${result.profileDetail[0].profileCid[0]}`
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=ffffff&size=150`,
        endorsements: result.endorsements?.[0] ? result.endorsements[0].map((_, index) => index) : []
      };
    });
  } catch (error) {
    console.error('Backend search error:', error);
    throw new Error('Failed to search profiles');
  }
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const { resumidActor } = useAuth();
  
  const {
    data: people = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['searchProfiles', query],
    queryFn: () => searchPeople(resumidActor, query),
    enabled: !!query && !!resumidActor,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
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
             {(isLoading || (!error && people.length > 0)) && (
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