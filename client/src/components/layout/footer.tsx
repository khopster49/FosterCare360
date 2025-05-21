import { Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">UK Fostering</h3>
            <p className="text-sm text-neutral-300">
              Our mission is to provide safe, supportive homes for children in need through our network of dedicated foster carers.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Contact Us</h3>
            <ul className="text-sm text-neutral-300 space-y-2">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>support@ukfostering.org</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>0800 123 4567</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Privacy & Compliance</h3>
            <ul className="text-sm text-neutral-300 space-y-2">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Fostering Regulations</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-neutral-700 text-sm text-neutral-400 text-center">
          <p>&copy; {new Date().getFullYear()} UK Fostering Onboarding Programme. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
