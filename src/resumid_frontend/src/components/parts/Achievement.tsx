function Achievement() {
  return (
    <section className="responsive-container bg-[#f4f4f4] py-8 border-b border-neutral-200">
      <ul className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <li className="flex flex-col gap-1 justify-center items-center">
          <h4 className="text-balance font-inter text-heading text-center">
            🚀 <b className="font-semibold">Resumes analyzed</b> so far!
          </h4>
          <p className="font-outfit text-primary-500 text-3xl font-semibold">
            500,000+
          </p>
        </li>
        <li className="flex flex-col gap-1 justify-center items-center">
          <h4 className="text-balance font-inter text-heading text-center">
            🎯 <b className="font-semibold">Increased interview rate</b> among users
          </h4>
          <p className="font-outfit text-primary-500 text-3xl font-semibold">
            72.33%
          </p>
        </li>
        <li className="flex flex-col gap-1 justify-center items-center">
          <h4 className="text-balance font-inter text-heading text-center">
            ⭐ <b className="font-semibold">Rated</b> by our global community
          </h4>
          <p className="font-outfit text-primary-500 text-3xl font-semibold">
            4.8/5
          </p>
        </li>
      </ul>
    </section>
  );
}

export default Achievement;
