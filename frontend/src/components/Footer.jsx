import React from 'react';
import { HelpCircle, Star, Briefcase, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="site-footer bg-[#172337] text-white text-[12px] pt-10 pb-6 mt-12 border-t border-[#303f56]">
      <div className="container mx-auto px-4 max-w-[1248px]">
        {/* Footer Top Links */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pb-10 border-b border-[#303f56]">
          {/* Col 1 */}
          <div>
            <h5 className="text-[#878787] font-semibold mb-3 uppercase tracking-wider">About</h5>
            <ul className="space-y-2 font-medium">
              <li><a href="#" className="hover:underline text-[#f0f0f0]">Contact Us</a></li>
              <li><a href="#" className="hover:underline text-[#f0f0f0]">About Us</a></li>
              <li><a href="#" className="hover:underline text-[#f0f0f0]">Careers</a></li>
              <li><a href="#" className="hover:underline text-[#f0f0f0]">Flipkart Stories</a></li>
              <li><a href="#" className="hover:underline text-[#f0f0f0]">Press</a></li>
              <li><a href="#" className="hover:underline text-[#f0f0f0]">Corporate Information</a></li>
            </ul>
          </div>
          
          {/* Col 2 */}
          <div>
            <h5 className="text-[#878787] font-semibold mb-3 uppercase tracking-wider">Help</h5>
            <ul className="space-y-2 font-medium">
              <li><a href="#" className="hover:underline text-[#f0f0f0]">Payments</a></li>
              <li><a href="#" className="hover:underline text-[#f0f0f0]">Shipping</a></li>
              <li><a href="#" className="hover:underline text-[#f0f0f0]">Cancellation & Returns</a></li>
              <li><a href="#" className="hover:underline text-[#f0f0f0]">FAQ</a></li>
              <li><a href="#" className="hover:underline text-[#f0f0f0]">Report Infringement</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h5 className="text-[#878787] font-semibold mb-3 uppercase tracking-wider">Consumer Policy</h5>
            <ul className="space-y-2 font-medium">
              <li><a href="#" className="hover:underline text-[#f0f0f0]">Return Policy</a></li>
              <li><a href="#" className="hover:underline text-[#f0f0f0]">Terms Of Use</a></li>
              <li><a href="#" className="hover:underline text-[#f0f0f0]">Security</a></li>
              <li><a href="#" className="hover:underline text-[#f0f0f0]">Privacy</a></li>
              <li><a href="#" className="hover:underline text-[#f0f0f0]">Sitemap</a></li>
              <li><a href="#" className="hover:underline text-[#f0f0f0]">Grievance Redressal</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h5 className="text-[#878787] font-semibold mb-3 uppercase tracking-wider">Social</h5>
            <ul className="space-y-2 font-medium">
              <li><a href="#" className="hover:underline text-[#f0f0f0]">Facebook</a></li>
              <li><a href="#" className="hover:underline text-[#f0f0f0]">Twitter</a></li>
              <li><a href="#" className="hover:underline text-[#f0f0f0]">YouTube</a></li>
            </ul>
          </div>

          {/* Col 5 (Split border for Mail/Office in Flipkart) */}
          <div className="border-l border-[#303f56] pl-6 col-span-2 md:col-span-1">
            <h5 className="text-[#878787] font-semibold mb-3 uppercase tracking-wider">Mail Us:</h5>
            <p className="text-[#f0f0f0] leading-5 font-normal">
              Flipkart Internet Private Limited,<br />
              Buildings Alyssa, Begonia &<br />
              Clove Embassy Tech Village,<br />
              Outer Ring Road, Devarabeesanahalli Village,<br />
              Bengaluru, 560103,<br />
              Karnataka, India
            </p>
          </div>

          {/* Col 6 */}
          <div className="pl-2 col-span-2 md:col-span-1">
            <h5 className="text-[#878787] font-semibold mb-3 uppercase tracking-wider">Registered Office:</h5>
            <p className="text-[#f0f0f0] leading-5 font-normal">
              Flipkart Internet Private Limited,<br />
              Buildings Alyssa, Begonia &<br />
              Clove Embassy Tech Village,<br />
              Outer Ring Road, Devarabeesanahalli Village,<br />
              Bengaluru, 560103,<br />
              Karnataka, India<br />
              CIN : U51109KA2012PTC066107
            </p>
          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 text-[11px] font-medium text-[#f0f0f0]">
          <div className="flex flex-wrap gap-6">
            <span className="flex items-center gap-1.5 cursor-pointer hover:text-white transition">
              <Briefcase size={14} className="text-flipkart-yellow" /> Become a Seller
            </span>
            <span className="flex items-center gap-1.5 cursor-pointer hover:text-white transition">
              <Star size={14} className="text-flipkart-yellow" /> Advertise
            </span>
            <span className="flex items-center gap-1.5 cursor-pointer hover:text-white transition">
              <Award size={14} className="text-flipkart-yellow" /> Gift Cards
            </span>
            <span className="flex items-center gap-1.5 cursor-pointer hover:text-white transition">
              <HelpCircle size={14} className="text-flipkart-yellow" /> Help Center
            </span>
          </div>
          
          <div className="text-gray-400">
            &copy; 2007-2026 Flipkart-Clone.com. All rights simulated.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
