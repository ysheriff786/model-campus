// HPI 1.6-V
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Opportunities } from '@/entities';
import { Search, MapPin, Calendar, DollarSign, Building2, ArrowRight, ArrowUpRight, Filter, Briefcase, Users, Award } from 'lucide-react';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

// --- Utility Components for Motion & Layout ---

type AnimatedElementProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
};

const AnimatedElement: React.FC<AnimatedElementProps> = ({ children, className, delay = 0, direction = 'up' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(element);
      }
    }, { threshold: 0.15 });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(40px)';
      case 'down': return 'translateY(-40px)';
      case 'left': return 'translateX(40px)';
      case 'right': return 'translateX(-40px)';
      default: return 'none';
    }
  };

  return (
    <div
      ref={ref}
      className={`${className || ''} transition-all duration-1000 ease-out will-change-transform`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0, 0)' : getInitialTransform(),
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

const ParallaxSection: React.FC<{ children: React.ReactNode; className?: string; offset?: number }> = ({ children, className, offset = 50 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  
  return (
    <div ref={ref} className={`relative overflow-hidden ${className || ''}`}>
      <motion.div style={{ y }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  );
};

const Marquee: React.FC<{ items: string[] }> = ({ items }) => {
  return (
    <div className="w-full overflow-hidden bg-primary py-4 flex whitespace-nowrap border-y border-primary/10">
      <motion.div 
        className="flex gap-12 items-center"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      >
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="text-secondary font-heading text-xl uppercase tracking-widest opacity-80">{item}</span>
            <div className="w-2 h-2 rounded-full bg-secondary/50" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// --- Main Page Component ---

export default function HomePage() {
  // --- Data Fidelity Protocol: Canonical Data Sources ---
  const [opportunities, setOpportunities] = useState<Opportunities[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunities[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');

  // --- Data Fetching (Preserved Logic) ---
  useEffect(() => {
    loadOpportunities();
  }, []);

  useEffect(() => {
    filterOpportunities();
  }, [searchTerm, locationFilter, companyFilter, opportunities]);

  const loadOpportunities = async () => {
    try {
      const { items } = await BaseCrudService.getAll<Opportunities>('opportunities');
      setOpportunities(items);
      setFilteredOpportunities(items);
    } catch (error) {
      console.error('Error loading opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOpportunities = () => {
    let filtered = opportunities;

    if (searchTerm) {
      filtered = filtered.filter(
        (opp) =>
          opp.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opp.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opp.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter((opp) =>
        opp.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (companyFilter) {
      filtered = filtered.filter((opp) =>
        opp.companyName?.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }

    setFilteredOpportunities(filtered);
  };

  const uniqueLocations = Array.from(new Set(opportunities.map((o) => o.location).filter(Boolean)));
  const uniqueCompanies = Array.from(new Set(opportunities.map((o) => o.companyName).filter(Boolean)));

  // --- Render ---
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-secondary">
      <Header />

      {/* --- Hero Section: Immersive & Full Bleed --- */}
      <section className="relative w-full min-h-[95vh] flex flex-col justify-between pt-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
           <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[120px]" />
           <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary-foreground rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-12 lg:pt-24 flex flex-col items-center text-center">
          <AnimatedElement direction="up" delay={100}>
            <span className="inline-block py-1 px-3 border border-primary/30 rounded-full text-xs font-bold tracking-widest uppercase text-primary mb-6 bg-background/50 backdrop-blur-sm">
              Campus Placement Portal
            </span>
          </AnimatedElement>
          
          <AnimatedElement direction="up" delay={200}>
            <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl text-primary leading-[0.9] tracking-tighter mb-8">
              CRAFT YOUR <br />
              <span className="italic font-light opacity-80">FUTURE</span> TODAY
            </h1>
          </AnimatedElement>

          <AnimatedElement direction="up" delay={300} className="max-w-2xl mx-auto">
            <p className="font-paragraph text-lg md:text-xl text-primary/80 leading-relaxed mb-10">
              A curated ecosystem connecting exceptional academic talent with world-class industry opportunities. Build your profile, discover your path, and launch your career.
            </p>
          </AnimatedElement>

          <AnimatedElement direction="up" delay={400} className="flex flex-col sm:flex-row gap-4 items-center">
            <a
              href="#opportunities"
              className="group relative px-8 py-4 bg-primary text-secondary overflow-hidden rounded-sm transition-all hover:shadow-xl hover:shadow-primary/20"
            >
              <span className="relative z-10 flex items-center font-medium tracking-wide">
                Explore Opportunities <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-secondary-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
            </a>
            <Link
              to="/profile"
              className="px-8 py-4 border border-primary/30 text-primary font-medium rounded-sm hover:bg-primary/5 transition-colors"
            >
              Create Student Profile
            </Link>
          </AnimatedElement>
        </div>

        {/* Hero Image Parallax */}
        <div className="relative w-full h-[40vh] lg:h-[50vh] mt-12 lg:mt-20 overflow-hidden">
          <ParallaxSection offset={-50} className="w-full h-[120%] -mt-[10%]">
            <Image
              src="https://static.wixstatic.com/media/1bf138_dea3f58ca3b64bdaaa62aeca786de3a5~mv2.png?originWidth=1920&originHeight=576"
              alt="Students collaborating in a modern campus environment"
              className="w-full h-full object-cover"
              width={1920}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
          </ParallaxSection>
        </div>
      </section>

      {/* --- Marquee Section --- */}
      <Marquee items={["Internships", "Placements", "Mentorship", "Career Growth", "Industry Leaders", "Skill Development"]} />

      {/* --- Mission / Sticky Layout Section --- */}
      <section className="py-24 lg:py-32 bg-secondary/30 relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sticky Sidebar */}
            <div className="lg:w-1/3">
              <div className="sticky top-32">
                <AnimatedElement direction="right">
                  <h2 className="font-heading text-4xl lg:text-5xl text-primary mb-6 leading-tight">
                    Bridging the Gap Between <span className="italic text-primary/70">Academia</span> & Industry.
                  </h2>
                  <p className="font-paragraph text-primary/70 text-lg mb-8">
                    Our platform streamlines the entire placement lifecycle, ensuring transparency, efficiency, and better outcomes for everyone involved.
                  </p>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 p-4 bg-background rounded-sm border border-primary/10 shadow-sm">
                      <div className="p-3 bg-secondary rounded-full text-primary">
                        <Briefcase size={24} />
                      </div>
                      <div>
                        <h4 className="font-heading text-lg text-primary">For Students</h4>
                        <p className="text-sm text-primary/60">Build profiles, apply, and track progress.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-background rounded-sm border border-primary/10 shadow-sm">
                      <div className="p-3 bg-secondary rounded-full text-primary">
                        <Users size={24} />
                      </div>
                      <div>
                        <h4 className="font-heading text-lg text-primary">For Mentors</h4>
                        <p className="text-sm text-primary/60">Review applications and guide talent.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-background rounded-sm border border-primary/10 shadow-sm">
                      <div className="p-3 bg-secondary rounded-full text-primary">
                        <Award size={24} />
                      </div>
                      <div>
                        <h4 className="font-heading text-lg text-primary">For Supervisors</h4>
                        <p className="text-sm text-primary/60">Provide structured performance feedback.</p>
                      </div>
                    </div>
                  </div>
                </AnimatedElement>
              </div>
            </div>

            {/* Scrolling Content */}
            <div className="lg:w-2/3 flex flex-col gap-12">
              <AnimatedElement direction="up" delay={100}>
                <div className="relative aspect-[16/9] overflow-hidden rounded-sm">
                  <Image
                    src="https://static.wixstatic.com/media/1bf138_c6496f99a6844efab9e1f0792d3b1957~mv2.png?originWidth=1152&originHeight=640"
                    alt="Mentors guiding students"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    width={1200}
                  />
                </div>
              </AnimatedElement>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatedElement direction="up" delay={200}>
                  <div className="p-8 bg-background border border-primary/10 h-full hover:border-primary/30 transition-colors">
                    <h3 className="font-heading text-2xl text-primary mb-4">Curated Opportunities</h3>
                    <p className="text-primary/70 leading-relaxed">
                      Access a verified list of internships and full-time roles from partner organizations, filtered specifically for your academic discipline.
                    </p>
                  </div>
                </AnimatedElement>
                <AnimatedElement direction="up" delay={300}>
                  <div className="p-8 bg-background border border-primary/10 h-full hover:border-primary/30 transition-colors">
                    <h3 className="font-heading text-2xl text-primary mb-4">Streamlined Process</h3>
                    <p className="text-primary/70 leading-relaxed">
                      From application to offer letter, every step is digital. No more paperwork, lost emails, or missed deadlines.
                    </p>
                  </div>
                </AnimatedElement>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Opportunities Section (The Core) --- */}
      <section id="opportunities" className="py-24 bg-background relative">
        <div className="container mx-auto px-6 lg:px-12">
          
          {/* Section Header */}
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <AnimatedElement direction="up">
              <h2 className="font-heading text-4xl lg:text-6xl text-primary mb-6">Current Openings</h2>
              <p className="text-primary/60 text-lg">
                Discover roles that match your ambition. Filter by role, location, or company to find your perfect fit.
              </p>
            </AnimatedElement>
          </div>

          {/* Sticky Filter Bar */}
          <div className="sticky top-4 z-40 mb-12">
            <div className="bg-background/95 backdrop-blur-md border border-primary/10 shadow-lg rounded-lg p-4 lg:p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Search */}
                <div className="md:col-span-5 relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="Search roles, companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-secondary/30 border border-transparent focus:border-primary/30 rounded-sm font-paragraph text-base focus:outline-none transition-all placeholder:text-primary/40"
                  />
                </div>

                {/* Location Filter */}
                <div className="md:col-span-3 relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40 group-focus-within:text-primary transition-colors" />
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full pl-12 pr-8 py-3 bg-secondary/30 border border-transparent focus:border-primary/30 rounded-sm font-paragraph text-base focus:outline-none transition-all appearance-none cursor-pointer text-primary/80"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Filter className="w-4 h-4 text-primary/40" />
                  </div>
                </div>

                {/* Company Filter */}
                <div className="md:col-span-3 relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40 group-focus-within:text-primary transition-colors" />
                  <select
                    value={companyFilter}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                    className="w-full pl-12 pr-8 py-3 bg-secondary/30 border border-transparent focus:border-primary/30 rounded-sm font-paragraph text-base focus:outline-none transition-all appearance-none cursor-pointer text-primary/80"
                  >
                    <option value="">All Companies</option>
                    {uniqueCompanies.map((company) => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Filter className="w-4 h-4 text-primary/40" />
                  </div>
                </div>

                {/* Results Count Display */}
                <div className="md:col-span-1 flex items-center justify-center md:justify-end">
                  <span className="text-sm font-medium text-primary/50 whitespace-nowrap">
                    {filteredOpportunities.length} Results
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Opportunities Grid */}
          {loading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-primary/50 font-medium">Loading opportunities...</p>
              </div>
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-primary/10 rounded-lg">
              <Briefcase className="w-16 h-16 text-primary/20 mb-4" />
              <h3 className="text-xl font-heading text-primary mb-2">No opportunities found</h3>
              <p className="text-primary/60 max-w-md">
                We couldn't find any matches for your current filters. Try adjusting your search criteria or browse all available roles.
              </p>
              <button 
                onClick={() => { setSearchTerm(''); setLocationFilter(''); setCompanyFilter(''); }}
                className="mt-6 px-6 py-2 bg-secondary text-primary font-medium rounded-sm hover:bg-secondary/80 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredOpportunities.map((opportunity, index) => (
                <AnimatedElement key={opportunity._id} delay={index * 50} className="h-full">
                  <OpportunityCard opportunity={opportunity} />
                </AnimatedElement>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- Stats / Trust Section --- */}
      <section className="py-20 bg-primary text-secondary overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-secondary/10">
            <div className="p-4">
              <h3 className="text-4xl lg:text-6xl font-heading mb-2">500+</h3>
              <p className="text-secondary/60 text-sm uppercase tracking-widest">Placements</p>
            </div>
            <div className="p-4">
              <h3 className="text-4xl lg:text-6xl font-heading mb-2">50+</h3>
              <p className="text-secondary/60 text-sm uppercase tracking-widest">Partners</p>
            </div>
            <div className="p-4">
              <h3 className="text-4xl lg:text-6xl font-heading mb-2">98%</h3>
              <p className="text-secondary/60 text-sm uppercase tracking-widest">Success Rate</p>
            </div>
            <div className="p-4">
              <h3 className="text-4xl lg:text-6xl font-heading mb-2">24/7</h3>
              <p className="text-secondary/60 text-sm uppercase tracking-widest">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://static.wixstatic.com/media/1bf138_235db86de17e44cdb278cb64947d145d~mv2.png?originWidth=1920&originHeight=576"
            alt="Background texture"
            className="w-full h-full object-cover opacity-10"
            width={1920}
          />
        </div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
          <AnimatedElement direction="up">
            <h2 className="font-heading text-5xl lg:text-7xl text-primary mb-8">Ready to Start?</h2>
            <p className="text-xl text-primary/70 max-w-2xl mx-auto mb-12">
              Your career journey begins with a single step. Create your profile today and unlock a world of possibilities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                to="/profile"
                className="px-10 py-4 bg-primary text-secondary font-medium text-lg rounded-sm hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300"
              >
                Create Student Profile
              </Link>
              <a
                href="#opportunities"
                className="px-10 py-4 bg-white border border-primary/20 text-primary font-medium text-lg rounded-sm hover:bg-secondary/30 transition-colors"
              >
                Browse Jobs
              </a>
            </div>
          </AnimatedElement>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// --- Sub-Components ---

function OpportunityCard({ opportunity }: { opportunity: Opportunities }) {
  return (
    <article className="group relative flex flex-col h-full bg-white border border-primary/10 rounded-sm overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      
      <div className="p-8 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h3 className="font-heading text-2xl text-primary mb-2 group-hover:text-primary/80 transition-colors line-clamp-2">
              {opportunity.role}
            </h3>
            <p className="font-paragraph text-sm font-bold text-primary/60 uppercase tracking-wider">
              {opportunity.companyName}
            </p>
          </div>
          {opportunity.companyLogo && (
            <div className="w-12 h-12 ml-4 rounded-full bg-secondary/30 p-2 flex-shrink-0">
              <Image
                src={opportunity.companyLogo}
                alt={`${opportunity.companyName} logo`}
                className="w-full h-full object-contain mix-blend-multiply"
                width={48}
              />
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-6 text-sm text-primary/70">
          {opportunity.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 opacity-50" />
              <span className="truncate">{opportunity.location}</span>
            </div>
          )}
          {opportunity.stipend && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 opacity-50" />
              <span className="truncate">{opportunity.stipend}</span>
            </div>
          )}
          {opportunity.applicationDeadline && (
            <div className="flex items-center gap-2 col-span-2">
              <Calendar className="w-4 h-4 opacity-50" />
              <span>Apply by {format(new Date(opportunity.applicationDeadline), 'MMM dd, yyyy')}</span>
            </div>
          )}
        </div>

        {/* Description Preview */}
        <p className="text-primary/60 text-sm leading-relaxed mb-8 line-clamp-3 flex-grow">
          {opportunity.description}
        </p>

        {/* Actions */}
        <div className="mt-auto pt-6 border-t border-primary/5 flex items-center justify-between">
          <Link
            to={`/opportunity/${opportunity._id}`}
            className="text-primary font-medium text-sm flex items-center gap-2 group/link"
          >
            View Details
            <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
          </Link>
          
          {opportunity.applicationUrl && (
            <a
              href={opportunity.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-secondary text-primary rounded-full hover:bg-primary hover:text-secondary transition-colors"
              title="Apply External"
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}