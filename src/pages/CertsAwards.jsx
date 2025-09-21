
export default function CertsAwards() {
  return (
    <section id="certsawards" className="bg-transparent p-0 m-0 min-h-screen">
      <div className="flex justify-start">
        <h2
          className="font-bold text-teal-500 dark:text-white mb-4"
          style={{ marginLeft: "1px" }}
        >
          Certifications & Awards
        </h2>
      </div>
      <div className="bg-transparent w-full flex justify-center">
        <div className="flex flex-col items-start gap-6 text-white">
          <div className="bg-white/5 dark:bg-white/5 rounded-lg shadow-lg overflow-hidden backdrop-blur max-w-md w-full h-30 flex flex-row p-4">
            <div className="flex-1 flex flex-col justify-center text-white">
              <h3 className="text-sm font-semibold mb-2">AWS Certified Solutions Architect – Associate</h3>
              <p className="mb-1 text-xs">
                Amazon Web Services (AWS) - Issued Mar 2023
              </p>
              <a
                href="https://www.credly.com/badges/1f4b8e6e-2d3a-4c9f-9c8d-8f8e8f8e8f8e/public_url"
                className="text-blue-300 hover:underline text-xs"
              >
                Verify Credential
              </a>
            </div>
          </div>
          <div className="bg-white/5 dark:bg-white/5 rounded-lg shadow-lg overflow-hidden backdrop-blur max-w-md w-full h-30 flex flex-row p-4">
            <div className="flex-1 flex flex-col justify-center text-white">
              <h3 className="text-sm font-semibold mb-2">Google Data Analytics Professional Certificate</h3>
              <p className="mb-1 text-xs">
                Coursera - Issued Jan 2023
              </p>
              <a
                href="https://www.coursera.org/account/accomplishments/professional-cert/XYZ123"
                className="text-blue-300 hover:underline text-xs"
              >
                Verify Credential
              </a>
            </div>
          </div>
          <div className="bg-white/5 dark:bg-white/5 rounded-lg shadow-lg overflow-hidden backdrop-blur max-w-md w-full h-30 flex flex-row p-4">
            <div className="flex-1 flex flex-col justify-center text-white">
              <h3 className="text-sm font-semibold mb-2">Dean's List, ya right</h3>
              <p className="mb-1 text-xs">
                University of Example - Awarded 2020, 2021
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}