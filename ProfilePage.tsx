import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { StudentProfiles } from '@/entities';
import { User, Mail, GraduationCap, Award, FileText } from 'lucide-react';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfiles | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { items } = await BaseCrudService.getAll<StudentProfiles>('studentprofiles');
      if (items.length > 0) {
        setProfile(items[0]);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="font-paragraph text-lg text-foreground opacity-60">Loading profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-4xl lg:text-5xl text-primary mb-3">
              Student Profile
            </h1>
            <p className="font-paragraph text-base text-foreground opacity-80">
              Your student profile information.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture Section */}
            <div className="lg:col-span-1">
              <div className="bg-secondary p-8 rounded-sm">
                <div className="mb-6">
                  {profile?.profilePicture ? (
                    <div className="w-48 h-48 mx-auto rounded-sm overflow-hidden bg-background">
                      <Image
                        src={profile.profilePicture}
                        alt="Profile picture"
                        className="w-full h-full object-cover"
                        width={192}
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-48 mx-auto rounded-sm bg-background flex items-center justify-center">
                      <User className="w-24 h-24 text-primary opacity-30" />
                    </div>
                  )}
                </div>

                {profile && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3 text-secondary-foreground">
                      <Mail className="w-5 h-5 text-primary opacity-70" />
                      <span className="font-paragraph text-sm">{profile.email || 'No email provided'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-secondary-foreground">
                      <GraduationCap className="w-5 h-5 text-primary opacity-70" />
                      <span className="font-paragraph text-sm">Class of {profile.graduationYear || 'N/A'}</span>
                    </div>
                    {profile.gpa && (
                      <div className="flex items-center gap-3 text-secondary-foreground">
                        <Award className="w-5 h-5 text-primary opacity-70" />
                        <span className="font-paragraph text-sm">GPA: {profile.gpa.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="lg:col-span-2">
              <div className="bg-secondary p-8 rounded-sm">
                {profile ? (
                  <div className="space-y-8">
                    {/* Personal Information */}
                    <div>
                      <h2 className="font-heading text-2xl text-primary mb-4">Personal Information</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <p className="font-paragraph text-xs text-secondary-foreground opacity-70 mb-1">Full Name</p>
                          <p className="font-paragraph text-base text-secondary-foreground font-medium">
                            {profile.studentName || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <p className="font-paragraph text-xs text-secondary-foreground opacity-70 mb-1">Email</p>
                          <p className="font-paragraph text-base text-secondary-foreground font-medium">
                            {profile.email || 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Academic Information */}
                    <div>
                      <h2 className="font-heading text-2xl text-primary mb-4">Academic Information</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <p className="font-paragraph text-xs text-secondary-foreground opacity-70 mb-1">Major</p>
                          <p className="font-paragraph text-base text-secondary-foreground font-medium">
                            {profile.major || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <p className="font-paragraph text-xs text-secondary-foreground opacity-70 mb-1">Graduation Year</p>
                          <p className="font-paragraph text-base text-secondary-foreground font-medium">
                            {profile.graduationYear || 'Not provided'}
                          </p>
                        </div>
                        {profile.gpa && (
                          <div>
                            <p className="font-paragraph text-xs text-secondary-foreground opacity-70 mb-1">GPA</p>
                            <p className="font-paragraph text-base text-secondary-foreground font-medium">
                              {profile.gpa.toFixed(2)} / 4.00
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Skills */}
                    {profile.skills && (
                      <div>
                        <h2 className="font-heading text-2xl text-primary mb-4">Skills & Technologies</h2>
                        <p className="font-paragraph text-base text-secondary-foreground leading-relaxed whitespace-pre-line">
                          {profile.skills}
                        </p>
                      </div>
                    )}

                    {/* Resume */}
                    {profile.resumeUrl && (
                      <div>
                        <h2 className="font-heading text-2xl text-primary mb-4">Resume</h2>
                        <a
                          href={profile.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-background border-2 border-primary/20 text-primary font-paragraph font-medium rounded hover:border-primary transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          View Resume
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="font-paragraph text-lg text-secondary-foreground opacity-60">
                      No profile information available.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
