import AuthImageSlider from "../components/AuthImageSlider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side: Image Slider (Hidden on mobile, takes 50% on large screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary-900 shadow-2xl z-10">
        <AuthImageSlider />
      </div>

      {/* Right Side: Form Container */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {children}
        </div>
      </div>
    </div>
  );
}
