import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-md text-center space-y-8">
          <h1 className="text-9xl font-bold text-gray-200">404</h1>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
            <p className="text-gray-600">
              We couldn't find the page you're looking for. It might have been moved or doesn't exist.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto">
                Go Home
              </Button>
            </Link>
            <Link href="/apply">
              <Button variant="outline" className="w-full sm:w-auto">
                Start Application
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}