import { Mail, Phone, MapPin, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-6 h-6" />
              <span className="font-heading text-xl font-semibold">CampusConnect</span>
            </Link>
            <p className="font-paragraph text-sm opacity-80 leading-relaxed">
              Empowering students with seamless access to internships and placements through innovative technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="font-paragraph text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Browse Opportunities
                </Link>
              </li>
              <li>
                <Link to="/profile" className="font-paragraph text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Student Profile
                </Link>
              </li>
              <li>
                <Link to="/applications" className="font-paragraph text-sm opacity-80 hover:opacity-100 transition-opacity">
                  My Applications
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="font-paragraph text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Performance Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Resources */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Support Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#faq" className="font-paragraph text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Application Guidelines
                </a>
              </li>
              <li>
                <a href="#help" className="font-paragraph text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Resume Building Tips
                </a>
              </li>
              <li>
                <a href="#contact" className="font-paragraph text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Interview Preparation
                </a>
              </li>
              <li>
                <a href="#support" className="font-paragraph text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Technical Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Placement Cell</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                <a href="mailto:placement@campus.edu" className="font-paragraph text-sm opacity-80 hover:opacity-100 transition-opacity">
                  placement@campus.edu
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
                <a href="tel:+1234567890" className="font-paragraph text-sm opacity-80 hover:opacity-100 transition-opacity">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="font-paragraph text-sm opacity-80">
                  Campus Building A, Room 204
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <p className="font-paragraph text-sm text-center opacity-80">
            © {new Date().getFullYear()} CampusConnect. Dedicated to student success and career growth.
          </p>
        </div>
      </div>
    </footer>
  );
}
