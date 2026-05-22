import { Award, Briefcase, CreditCard, HelpCircle, Mail, MapPin, ShieldCheck, Star } from 'lucide-react';

const footerLinks = [
  ['About', ['Contact Us', 'About Us', 'Careers', 'Flipkart Stories', 'Press']],
  ['Help', ['Payments', 'Shipping', 'Cancellation & Returns', 'FAQ']],
  ['Policy', ['Return Policy', 'Terms Of Use', 'Security', 'Privacy', 'Sitemap']],
  ['Social', ['Facebook', 'Twitter', 'YouTube', 'Instagram']]
];

const footerActions = [
  [Briefcase, 'Become a Seller'],
  [Star, 'Advertise'],
  [Award, 'Gift Cards'],
  [HelpCircle, 'Help Center'],
  [CreditCard, 'Secure Payments'],
  [ShieldCheck, 'Buyer Protection']
];

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-shell">
      <section className="footer-top">
        <div className="footer-brand">
          <img src="/flipkart-icons/chip-flipkart.png" alt="Flipkart" />
          <p>Shop smart with fast delivery, easy returns, safe payments, and deals across mobiles, fashion, home, grocery, and more.</p>
        </div>

        {footerLinks.map(([title, links]) => (
          <nav key={title}>
            <h4>{title}</h4>
            {links.map((link) => <a key={link} href="#">{link}</a>)}
          </nav>
        ))}

        <div className="footer-contact">
          <h4>Contact</h4>
          <p><Mail size={15} /> support@flipkart-clone.com</p>
          <p><MapPin size={15} /> Bengaluru, Karnataka, India</p>
          <span>Available 24x7 for orders, refunds, payments, and delivery help.</span>
        </div>
      </section>

      <section className="footer-bottom">
        <div>
          {footerActions.map(([Icon, label]) => (
            <span key={label}><Icon size={15} /> {label}</span>
          ))}
        </div>
        <small>© 2007-2026 Flipkart Clone. Demo ecommerce project.</small>
      </section>
    </div>
  </footer>
);

export default Footer;
