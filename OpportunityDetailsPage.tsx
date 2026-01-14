import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Opportunities } from '@/entities';
import { ArrowLeft, MapPin, Calendar, DollarSign, Building2, ExternalLink, CheckCircle } from 'lucide-react';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

export default function OpportunityDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [opportunity, setOpportunity] = useState<Opportunities | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOpportunity();
    }
  }, [id]);

  const loadOpportunity = async () => {
    try {
      if (!id) return;
      const item = await BaseCrudService.getById<Opportunities>('opportunities', id);
      setOpportunity(item);
    } catch (error) {
      console.error('Error loading opportunity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="font-paragraph text-lg text-foreground opacity-60">Loading opportunity details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <p className="font-paragraph text-lg text-foreground opacity-60 mb-6">Opportunity not found</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-paragraph font-medium rounded hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Opportunities
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-secondary py-6">
          <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-paragraph text-sm text-secondary-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Opportunities
            </Link>
          </div>
        </div>

        {/* Opportunity Header */}
        <section className="bg-background py-12">
          <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="flex items-start gap-6 mb-8">
                  {opportunity.companyLogo && (
                    <div className="flex-shrink-0 w-24 h-24 bg-secondary rounded-sm overflow-hidden p-3">
                      <Image
                        src={opportunity.companyLogo}
                        alt={`${opportunity.companyName} logo`}
                        className="w-full h-full object-contain"
                        width={96}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h1 className="font-heading text-4xl lg:text-5xl text-primary mb-3 leading-tight">
                      {opportunity.role}
                    </h1>
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="w-5 h-5 text-primary opacity-70" />
                      <p className="font-paragraph text-xl text-foreground font-medium">
                        {opportunity.companyName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 p-6 bg-secondary rounded-sm">
                  {opportunity.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-paragraph text-xs text-secondary-foreground opacity-70 mb-1">Location</p>
                        <p className="font-paragraph text-base text-secondary-foreground font-medium">{opportunity.location}</p>
                      </div>
                    </div>
                  )}
                  {opportunity.stipend && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-paragraph text-xs text-secondary-foreground opacity-70 mb-1">Stipend</p>
                        <p className="font-paragraph text-base text-secondary-foreground font-medium">{opportunity.stipend}</p>
                      </div>
                    </div>
                  )}
                  {opportunity.applicationDeadline && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-paragraph text-xs text-secondary-foreground opacity-70 mb-1">Application Deadline</p>
                        <p className="font-paragraph text-base text-secondary-foreground font-medium">
                          {format(new Date(opportunity.applicationDeadline), 'MMMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {opportunity.description && (
                  <div className="mb-8">
                    <h2 className="font-heading text-2xl text-primary mb-4">About This Opportunity</h2>
                    <p className="font-paragraph text-base text-foreground leading-relaxed whitespace-pre-line">
                      {opportunity.description}
                    </p>
                  </div>
                )}

                {/* Eligibility Criteria */}
                {opportunity.eligibilityCriteria && (
                  <div className="mb-8">
                    <h2 className="font-heading text-2xl text-primary mb-4">Eligibility Requirements</h2>
                    <div className="p-6 bg-secondary rounded-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <p className="font-paragraph text-base text-secondary-foreground leading-relaxed">
                          {opportunity.eligibilityCriteria}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="bg-secondary p-8 rounded-sm">
                    <h3 className="font-heading text-xl text-primary mb-6">Ready to Apply?</h3>
                    
                    <div className="space-y-4 mb-6">
                      <p className="font-paragraph text-sm text-secondary-foreground leading-relaxed">
                        Make sure your profile is complete before submitting your application.
                      </p>
                      {opportunity.applicationDeadline && (
                        <div className="p-4 bg-background rounded-sm">
                          <p className="font-paragraph text-xs text-foreground opacity-70 mb-1">Time Remaining</p>
                          <p className="font-paragraph text-sm text-foreground font-medium">
                            {new Date(opportunity.applicationDeadline) > new Date()
                              ? `Until ${format(new Date(opportunity.applicationDeadline), 'MMM dd, yyyy')}`
                              : 'Application deadline has passed'}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {opportunity.applicationUrl && (
                        <a
                          href={opportunity.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-paragraph font-medium rounded hover:opacity-90 transition-opacity"
                        >
                          Apply Now
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <Link
                        to="/profile"
                        className="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary font-paragraph font-medium rounded hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        Update Profile
                      </Link>
                    </div>
                  </div>

                  <div className="mt-6 p-6 bg-background border-2 border-primary/20 rounded-sm">
                    <h4 className="font-heading text-base text-primary mb-3">Need Help?</h4>
                    <p className="font-paragraph text-sm text-foreground opacity-80 mb-4 leading-relaxed">
                      Contact the placement cell for guidance on your application.
                    </p>
                    <a
                      href="mailto:placement@campus.edu"
                      className="font-paragraph text-sm text-primary hover:opacity-80 transition-opacity underline"
                    >
                      placement@campus.edu
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
