import AuthImageSlider from "../components/AuthImageSlider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-[1000px] flex flex-col lg:flex-row rounded-[24px] bg-white shadow-2xl overflow-hidden min-h-[650px]">
        
        {/* Left Side: Image Slider (Inset card style) */}
        <div className="hidden lg:block w-1/2 p-3">
          <div className="w-full h-full relative rounded-[20px] overflow-hidden bg-primary-900">
            <AuthImageSlider />
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-10 sm:px-12 xl:px-16">
          {children}
        </div>
      </div>
    </div>
  );
}
