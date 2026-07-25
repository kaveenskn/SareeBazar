import AuthImageSlider from "../components/AuthImageSlider";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="w-full max-w-[1000px] flex flex-col lg:flex-row rounded-[24px] bg-white shadow-2xl overflow-hidden lg:min-h-[650px]">
        
        {/* Left Side: Image Slider (Inset card style) */}
        <div className="hidden lg:block w-1/2 p-3">
          <div className="w-full h-full relative rounded-[20px] overflow-hidden bg-primary-900">
            <AuthImageSlider />
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center relative">
          
          {/* Mobile Back Link */}
          <div className="lg:hidden absolute top-4 left-4 sm:left-6 z-10">
            <Link 
              href="/" 
              className="inline-flex items-center space-x-2 bg-transparent hover:bg-gray-100/80 px-3 py-2 rounded-full text-gray-500 hover:text-primary-600 transition-all text-sm font-medium drop-shadow-sm"
            >
              <ArrowLeft size={16} />
              <span>Back to website</span>
            </Link>
          </div>

          <div className="px-6 py-12 sm:px-12 sm:py-16 xl:px-16 w-full">

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
