import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/Toaster";
import "@/styles/globals.css";

export const metadata = {
  title: "Threadit - thread together",
  description: "A Reddit clone built with Next.js and TypeScript.",
};
export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-white font-noto antialiased light">
      <body className="bg-[#edecea] min-h-screen antialiased text-slate-900 pt-12">
        <Providers>
          {/* @ts-expect-error Server Component*/}
          <Navbar />
          {authModal}
          <div className="max-w-7xl mx-auto md:container sm:px-4 px-2 pt-12 ">
            <div className="fixed inset-0 w-full h-full">
              <img
                alt="bg-image"
                src="/texture-bg.jpeg"
                className="opacity-[7%] object-cover w-full h-full "
              />
            </div>
            {children}
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
