import { useSearchParams } from "react-router";
import { Helmet } from "react-helmet";
import ProfileCard from "@/components/parts/ProfileCard";
import { Search, Users } from "lucide-react";

// Static mock data for testing
const MOCK_PEOPLE = [
  {
    id: "2",
    name: "Michael Chen",
    role: "Full Stack Engineer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    endorsements: 18
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "UX/UI Designer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    endorsements: 31
  },
  {
    id: "4",
    name: "David Kim",
    role: "DevOps Engineer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    endorsements: 15
  },
  {
    id: "5",
    name: "Lisa Thompson",
    role: "Product Manager",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    endorsements: 42
  },
  {
    id: "6",
    name: "Alex Martinez",
    role: "Data Scientist",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    endorsements: 27
  }
];

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || 'talented professionals';
  
  const people = MOCK_PEOPLE;
  const isLoading = false;

  const handleProfileClick = (id: string) => {
    console.log('Profile clicked:', id);
    // TODO: Navigate to profile detail page
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
          <p className="text-center text-paragraph font-inter">
            Found <span className="text-2xl md:text-3xl font-bold text-primary-600">{people.length}</span> people with the keyword of <em className="italic text-heading">{query}</em>
          </p>
        </section>

        {/* Results Grid */}
        <section>
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="animate-pulse">
                  <div className="bg-neutral-200 rounded-lg h-20"></div>
                </div>
              ))}
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
            <div className="text-center py-12">
              <div className="p-4 bg-neutral-50 rounded-lg inline-block mb-4">
                <Search className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-heading mb-2 font-outfit">
                No results found
              </h3>
              <p className="text-paragraph font-inter">
                Try adjusting your search terms or browse our featured professionals.
              </p>
            </div>
          )}
        </section>
        </div>
      </main>
    </>
  );
}