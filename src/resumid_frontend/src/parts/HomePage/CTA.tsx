import { ArrowRightIcon } from "lucide-react";

function CTA() {
  return (
    <section className="responsive-container bg-[#f4f4f4] py-16 border-b border-neutral-200 flex justify-center">
      <div className="relative w-full max-w-6xl h-[120px] md:h-[140px] flex flex-col justify-between px-8 py-4 rounded-bl-lg rounded-br-lg rounded-tr-lg bg-gradient-to-r from-primary-500 to-accent-500 shadow-lg text-white">
        
        {/* Kotak Kecil di luar kotak besar, sudut lancip */}
        <div className="absolute top-[-20px] sm:top-[-30px] left-[-20px] sm:left-[-30px] w-[20px] h-[20px] sm:w-[30px] sm:h-[30px] bg-gradient-to-r from-primary-500 to-accent-500 
            clip-path-[polygon(100%_0%,_100%_100%,_50%_100%,_0%_50%,_0%_0%)] 
            shadow-md">
        </div>

        {/* Wrapper untuk teks dan tombol */}
        <div className="flex justify-between items-center h-full mt-8"> {/* Menambahkan margin top untuk memindahkan ke bawah */}
          {/* Teks di kiri */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-left">
            Ready to Level Up Your Resume?
          </h2>

          {/* Tombol di kanan */}
          <div className="z-10">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-inter rounded-md bg-white text-primary-500 text-xs sm:text-sm md:text-base px-4 sm:px-6 py-2 font-medium hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
              Get Started
              <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
