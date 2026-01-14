import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { PerformanceFeedback } from '@/entities';
import { Star, Calendar, TrendingUp, AlertCircle, MessageSquare, Plus } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<PerformanceFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Partial<PerformanceFeedback>>({
    overallRating: 0,
    feedbackDate: new Date().toISOString(),
  });

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const { items } = await BaseCrudService.getAll<PerformanceFeedback>('performancefeedback');
      setFeedbacks(items.sort((a, b) => {
        const dateA = a.feedbackDate ? new Date(a.feedbackDate).getTime() : 0;
        const dateB = b.feedbackDate ? new Date(b.feedbackDate).getTime() : 0;
        return dateB - dateA;
      }));
    } catch (error) {
      console.error('Error loading feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await BaseCrudService.create('performancefeedback', {
        _id: crypto.randomUUID(),
        ...formData,
      });
      await loadFeedbacks();
      setShowAddModal(false);
      setFormData({
        overallRating: 0,
        feedbackDate: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleChange = (field: keyof PerformanceFeedback, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const averageRating = feedbacks.length > 0
    ? feedbacks.reduce((sum, f) => sum + (f.overallRating || 0), 0) / feedbacks.length
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-heading text-4xl lg:text-5xl text-primary mb-3">
                Performance Feedback
              </h1>
              <p className="font-paragraph text-base text-foreground opacity-80">
                Track student performance and supervisor evaluations during internships.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-paragraph font-medium rounded hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add Feedback
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-secondary p-6 rounded-sm">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-5 h-5 text-primary" />
                <p className="font-paragraph text-sm text-secondary-foreground opacity-70">Average Rating</p>
              </div>
              <p className="font-heading text-3xl text-primary">
                {averageRating.toFixed(1)} / 5.0
              </p>
            </div>

            <div className="bg-secondary p-6 rounded-sm">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <p className="font-paragraph text-sm text-secondary-foreground opacity-70">Total Feedback</p>
              </div>
              <p className="font-heading text-3xl text-primary">{feedbacks.length}</p>
            </div>

            <div className="bg-secondary p-6 rounded-sm">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <p className="font-paragraph text-sm text-secondary-foreground opacity-70">Recent Reviews</p>
              </div>
              <p className="font-heading text-3xl text-primary">
                {feedbacks.filter(f => {
                  if (!f.feedbackDate) return false;
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return new Date(f.feedbackDate) > thirtyDaysAgo;
                }).length}
              </p>
            </div>
          </div>

          {/* Feedback List */}
          {loading ? (
            <div className="text-center py-16">
              <p className="font-paragraph text-lg text-foreground opacity-60">Loading feedback...</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-16 bg-secondary rounded-sm">
              <MessageSquare className="w-16 h-16 text-primary opacity-30 mx-auto mb-4" />
              <p className="font-paragraph text-lg text-foreground opacity-60 mb-2">No feedback submitted yet.</p>
              <p className="font-paragraph text-sm text-foreground opacity-60">
                Click "Add Feedback" to submit your first performance review.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {feedbacks.map((feedback) => (
                <FeedbackCard key={feedback._id} feedback={feedback} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Feedback Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-primary/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background max-w-2xl w-full rounded-sm p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="font-heading text-2xl text-primary mb-6">Submit Performance Feedback</h2>

            <form className="space-y-6">
              {/* Internship Title */}
              <div>
                <label className="block font-paragraph text-sm text-foreground font-medium mb-2">
                  Internship Title *
                </label>
                <input
                  type="text"
                  value={formData.internshipTitle || ''}
                  onChange={(e) => handleChange('internshipTitle', e.target.value)}
                  placeholder="e.g., Software Development Intern"
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded font-paragraph text-base focus:outline-none focus:border-primary transition-colors bg-background"
                  required
                />
              </div>

              {/* Overall Rating */}
              <div>
                <label className="block font-paragraph text-sm text-foreground font-medium mb-2">
                  Overall Rating (1-5) *
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.overallRating || ''}
                    onChange={(e) => handleChange('overallRating', parseFloat(e.target.value))}
                    className="w-32 px-4 py-3 border-2 border-primary/20 rounded font-paragraph text-base focus:outline-none focus:border-primary transition-colors bg-background"
                    required
                  />
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${
                          star <= (formData.overallRating || 0)
                            ? 'fill-primary text-primary'
                            : 'text-primary opacity-30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback Date */}
              <div>
                <label className="block font-paragraph text-sm text-foreground font-medium mb-2">
                  Feedback Date *
                </label>
                <input
                  type="date"
                  value={formData.feedbackDate ? new Date(formData.feedbackDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleChange('feedbackDate', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded font-paragraph text-base focus:outline-none focus:border-primary transition-colors bg-background"
                  required
                />
              </div>

              {/* Strengths */}
              <div>
                <label className="block font-paragraph text-sm text-foreground font-medium mb-2">
                  Strengths
                </label>
                <textarea
                  value={formData.strengths || ''}
                  onChange={(e) => handleChange('strengths', e.target.value)}
                  placeholder="Describe the student's key strengths and positive attributes..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded font-paragraph text-base focus:outline-none focus:border-primary transition-colors bg-background resize-none"
                />
              </div>

              {/* Areas for Improvement */}
              <div>
                <label className="block font-paragraph text-sm text-foreground font-medium mb-2">
                  Areas for Improvement
                </label>
                <textarea
                  value={formData.areasForImprovement || ''}
                  onChange={(e) => handleChange('areasForImprovement', e.target.value)}
                  placeholder="Identify areas where the student can improve..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded font-paragraph text-base focus:outline-none focus:border-primary transition-colors bg-background resize-none"
                />
              </div>

              {/* Supervisor Comments */}
              <div>
                <label className="block font-paragraph text-sm text-foreground font-medium mb-2">
                  Supervisor Comments
                </label>
                <textarea
                  value={formData.supervisorComments || ''}
                  onChange={(e) => handleChange('supervisorComments', e.target.value)}
                  placeholder="Additional comments and observations..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded font-paragraph text-base focus:outline-none focus:border-primary transition-colors bg-background resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-paragraph font-medium rounded hover:opacity-90 transition-opacity"
                >
                  Submit Feedback
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({
                      overallRating: 0,
                      feedbackDate: new Date().toISOString(),
                    });
                  }}
                  className="px-6 py-3 border-2 border-primary text-primary font-paragraph font-medium rounded hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function FeedbackCard({ feedback }: { feedback: PerformanceFeedback }) {
  return (
    <article className="bg-secondary p-6 lg:p-8 rounded-sm">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <h3 className="font-heading text-2xl text-primary mb-2">
              {feedback.internshipTitle || 'Internship Feedback'}
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              {feedback.feedbackDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary opacity-70" />
                  <span className="font-paragraph text-sm text-secondary-foreground">
                    {format(new Date(feedback.feedbackDate), 'MMMM dd, yyyy')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Strengths */}
          {feedback.strengths && (
            <div className="p-4 bg-background rounded-sm">
              <div className="flex items-start gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <p className="font-paragraph text-xs text-foreground opacity-70 font-medium">Strengths</p>
              </div>
              <p className="font-paragraph text-sm text-foreground leading-relaxed">
                {feedback.strengths}
              </p>
            </div>
          )}

          {/* Areas for Improvement */}
          {feedback.areasForImprovement && (
            <div className="p-4 bg-background rounded-sm">
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <p className="font-paragraph text-xs text-foreground opacity-70 font-medium">Areas for Improvement</p>
              </div>
              <p className="font-paragraph text-sm text-foreground leading-relaxed">
                {feedback.areasForImprovement}
              </p>
            </div>
          )}

          {/* Supervisor Comments */}
          {feedback.supervisorComments && (
            <div className="p-4 bg-background rounded-sm">
              <div className="flex items-start gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <p className="font-paragraph text-xs text-foreground opacity-70 font-medium">Supervisor Comments</p>
              </div>
              <p className="font-paragraph text-sm text-foreground leading-relaxed">
                {feedback.supervisorComments}
              </p>
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="lg:col-span-1">
          <div className="bg-background p-6 rounded-sm text-center">
            <p className="font-paragraph text-xs text-foreground opacity-70 mb-2">Overall Rating</p>
            <div className="mb-3">
              <p className="font-heading text-4xl text-primary">
                {feedback.overallRating?.toFixed(1) || '0.0'}
              </p>
              <p className="font-paragraph text-sm text-foreground opacity-70">out of 5.0</p>
            </div>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= (feedback.overallRating || 0)
                      ? 'fill-primary text-primary'
                      : 'text-primary opacity-30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
