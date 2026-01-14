import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { Applications } from '@/entities';
import { FileText, Calendar, CheckCircle, XCircle, Clock, MessageSquare, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Under Review';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Applications[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<Applications | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [newStatus, setNewStatus] = useState<string>('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const { items } = await BaseCrudService.getAll<Applications>('applications');
      setApplications(items);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async () => {
    if (!selectedApp) return;

    try {
      await BaseCrudService.update<Applications>('applications', {
        _id: selectedApp._id,
        applicationStatus: newStatus,
        mentorFeedback: feedback,
      });
      await loadApplications();
      setShowApprovalModal(false);
      setSelectedApp(null);
      setFeedback('');
      setNewStatus('');
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const openApprovalModal = (app: Applications) => {
    setSelectedApp(app);
    setFeedback(app.mentorFeedback || '');
    setNewStatus(app.applicationStatus || 'Pending');
    setShowApprovalModal(true);
  };

  const filteredApplications = filterStatus
    ? applications.filter((app) => app.applicationStatus === filterStatus)
    : applications;

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-5 h-5 text-green-700" />;
      case 'Rejected':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'Under Review':
        return <Clock className="w-5 h-5 text-yellow-700" />;
      default:
        return <Clock className="w-5 h-5 text-primary opacity-70" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-secondary text-secondary-foreground border-primary/20';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-4xl lg:text-5xl text-primary mb-3">
              Application Management
            </h1>
            <p className="font-paragraph text-base text-foreground opacity-80">
              Review and manage student applications for internship and placement opportunities.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="font-paragraph text-sm text-foreground font-medium">Filter by Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border-2 border-primary/20 rounded font-paragraph text-sm focus:outline-none focus:border-primary transition-colors bg-background"
              >
                <option value="">All Applications</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <p className="font-paragraph text-sm text-foreground opacity-70">
              Showing {filteredApplications.length} of {applications.length} applications
            </p>
          </div>

          {/* Applications List */}
          {loading ? (
            <div className="text-center py-16">
              <p className="font-paragraph text-lg text-foreground opacity-60">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16 bg-secondary rounded-sm">
              <FileText className="w-16 h-16 text-primary opacity-30 mx-auto mb-4" />
              <p className="font-paragraph text-lg text-foreground opacity-60">No applications submitted yet.</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-16 bg-secondary rounded-sm">
              <p className="font-paragraph text-lg text-foreground opacity-60">No applications match the selected filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredApplications.map((application) => (
                <ApplicationCard
                  key={application._id}
                  application={application}
                  onApprove={openApprovalModal}
                  getStatusIcon={getStatusIcon}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Approval Modal */}
      {showApprovalModal && selectedApp && (
        <div className="fixed inset-0 bg-primary/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background max-w-2xl w-full rounded-sm p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="font-heading text-2xl text-primary mb-6">Review Application</h2>

            <div className="space-y-6 mb-8">
              <div>
                <p className="font-paragraph text-sm text-foreground opacity-70 mb-1">Applicant</p>
                <p className="font-paragraph text-base text-foreground font-medium">{selectedApp.applicantName}</p>
              </div>

              <div>
                <p className="font-paragraph text-sm text-foreground opacity-70 mb-1">Opportunity</p>
                <p className="font-paragraph text-base text-foreground font-medium">{selectedApp.opportunityTitle}</p>
              </div>

              <div>
                <label className="block font-paragraph text-sm text-foreground font-medium mb-2">
                  Application Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded font-paragraph text-base focus:outline-none focus:border-primary transition-colors bg-background"
                >
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block font-paragraph text-sm text-foreground font-medium mb-2">
                  Mentor Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide feedback to the applicant..."
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded font-paragraph text-base focus:outline-none focus:border-primary transition-colors bg-background resize-none"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleApproval}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-paragraph font-medium rounded hover:opacity-90 transition-opacity"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedApp(null);
                  setFeedback('');
                  setNewStatus('');
                }}
                className="px-6 py-3 border-2 border-primary text-primary font-paragraph font-medium rounded hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function ApplicationCard({
  application,
  onApprove,
  getStatusIcon,
  getStatusColor,
}: {
  application: Applications;
  onApprove: (app: Applications) => void;
  getStatusIcon: (status?: string) => JSX.Element;
  getStatusColor: (status?: string) => string;
}) {
  return (
    <article className="bg-secondary p-6 lg:p-8 rounded-sm">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h3 className="font-heading text-2xl text-primary mb-2">{application.applicantName}</h3>
            <p className="font-paragraph text-base text-secondary-foreground font-medium">
              {application.opportunityTitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {application.submissionDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary opacity-70" />
                <span className="font-paragraph text-sm text-secondary-foreground">
                  Submitted: {format(new Date(application.submissionDate), 'MMM dd, yyyy')}
                </span>
              </div>
            )}
            <div className={`flex items-center gap-2 px-3 py-1 rounded border-2 ${getStatusColor(application.applicationStatus)}`}>
              {getStatusIcon(application.applicationStatus)}
              <span className="font-paragraph text-sm font-medium">
                {application.applicationStatus || 'Pending'}
              </span>
            </div>
          </div>

          {application.mentorFeedback && (
            <div className="p-4 bg-background rounded-sm">
              <div className="flex items-start gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <p className="font-paragraph text-xs text-foreground opacity-70">Mentor Feedback</p>
              </div>
              <p className="font-paragraph text-sm text-foreground leading-relaxed">
                {application.mentorFeedback}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          {application.resumeLink && (
            <a
              href={application.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-background border-2 border-primary/20 text-primary font-paragraph text-sm font-medium rounded hover:border-primary transition-colors"
            >
              <FileText className="w-4 h-4" />
              View Resume
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {application.coverLetterLink && (
            <a
              href={application.coverLetterLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-background border-2 border-primary/20 text-primary font-paragraph text-sm font-medium rounded hover:border-primary transition-colors"
            >
              <FileText className="w-4 h-4" />
              Cover Letter
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <button
            onClick={() => onApprove(application)}
            className="px-4 py-2 bg-primary text-primary-foreground font-paragraph text-sm font-medium rounded hover:opacity-90 transition-opacity"
          >
            Review Application
          </button>
        </div>
      </div>
    </article>
  );
}
