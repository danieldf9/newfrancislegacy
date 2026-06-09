
import { Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContactPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Contact Us</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          We'd love to hear from you! Whether you have a question about our AI tools, a partnership opportunity, or just want to say hello, feel free to reach out.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card>
          <CardHeader className="items-center">
            <div className="p-4 bg-primary/10 rounded-full w-fit">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="mt-4">Email Us</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Send your inquiries to our team.
            </p>
            <a href="mailto:support@francislegacy.com" className="text-primary font-semibold hover:underline mt-2 inline-block">
              support@francislegacy.com
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="items-center">
            <div className="p-4 bg-primary/10 rounded-full w-fit">
              <Phone className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="mt-4">Call Us</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Speak with a team member directly.
            </p>
            <a href="tel:+919740937182" className="text-primary font-semibold hover:underline mt-2 inline-block">
              +91 9740937182
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="items-center">
            <div className="p-4 bg-primary/10 rounded-full w-fit">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="mt-4">Our Location</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Visit our corporate office (by appointment).
            </p>
            <p className="text-primary font-semibold mt-2">
              3-13 bk house bondukumeri, Ajekar karkala, udupi
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
