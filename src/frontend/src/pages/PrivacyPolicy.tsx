import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function PrivacyPolicy() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">
            Last updated: February 5, 2026
          </p>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              Resume Builder is committed to protecting your privacy. This policy explains how we handle your data
              when you use our application.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Storage</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-4">
            <div>
              <h3 className="text-base font-semibold mb-2">Guest Mode (Local Storage)</h3>
              <p>
                When you use Resume Builder as a guest, all your resume data is stored locally in your browser's
                storage. This data never leaves your device and is not transmitted to any server. Your resumes remain
                private and accessible only on the device where they were created.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-2">Logged-In Mode (Synced Storage)</h3>
              <p>
                When you log in using Internet Identity, your resume data is stored in a secure canister on the
                Internet Computer blockchain. This allows you to access your resumes from any device. Your data is
                associated with your Internet Identity principal and is only accessible to you.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Photos</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              When you upload a profile photo, it is stored as part of your resume data. Photos are used exclusively
              within your resumes for preview and PDF export. We do not use your photos for any other purpose, and
              they are not shared with third parties.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              Resume Builder requires minimal permissions. When you choose to upload a profile photo, your browser's
              file picker is used. We do not request access to your device's camera or photo library beyond the
              standard file selection dialog.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Sharing</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              We do not share, sell, or distribute your personal data or resume content with any third parties. Your
              data is yours alone. When you export a resume as a PDF, the file is generated locally in your browser
              and saved to your device.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              This version of Resume Builder does not include any analytics, tracking, or advertising services. We do
              not collect usage data or behavioral information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              For logged-in users, data is stored on the Internet Computer blockchain with cryptographic security.
              Access to your resumes requires authentication via Internet Identity. For guest users, data security
              depends on your browser's local storage security and device access controls.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              You have full control over your data. You can delete any resume at any time. If you are logged in, you
              can log out to disconnect your Internet Identity. Guest users can clear their browser's local storage
              to remove all resume data.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              We may update this privacy policy from time to time. Any changes will be posted on this page with an
              updated revision date.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              If you have questions about this privacy policy or how we handle your data, please contact us through
              the application's support channels.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
