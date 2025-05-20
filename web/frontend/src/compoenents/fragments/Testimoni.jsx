import React from "react";

function Testimoni() {
  return (
    <section className="py-16 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Testimonial 1 */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 overflow-hidden rounded-full">
              <img
                src="/profile/Oday-Mashalla.png"
                alt="Oday Mashalla"
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-4 text-gray-700">
              Scraping reviews with Sentiview feels like having your own
              research team. No more manually checking sites one by one!
            </p>
            <h3 className="mt-4 text-lg font-semibold">Oday Mashalla</h3>
            <p className="text-sm text-gray-500">
              Digital Marketer @ KopiKampus
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 overflow-hidden rounded-full">
              <img
                src="/profile/Laura-Ang.png"
                alt="Upen V."
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-4 text-gray-700">
              Getting review data directly from e-commerce and analyzing it
              automatically? I didn’t expect it to be this fast!
            </p>
            <h3 className="mt-4 text-lg font-semibold">Laura Ang</h3>
            <p className="text-sm text-gray-500">Founder @ Skinca.id</p>
          </div>

          {/* Testimonial 3 */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 overflow-hidden rounded-full">
              <img
                src="/profile/Upen-V.png"
                alt="Laura Ang"
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-4 text-gray-700">
              Sentiview helped me gather product insights from customer comments
              and testimonials. Super useful for UX research!
            </p>
            <h3 className="mt-4 text-lg font-semibold">Upen V.</h3>
            <p className="text-sm text-gray-500">UI Designer @ Freelance</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimoni;
