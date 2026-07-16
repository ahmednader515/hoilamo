import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { TornEdge } from "@/components/store/torn-edge";
import { t, type SiteContentMap } from "@/lib/get-site-content";

export function ContactSection({ content }: { content: SiteContentMap }) {
  const info = [
    {
      icon: MapPin,
      title: t(content, "contact.addressLabel"),
      text: t(content, "contact.address"),
      ltr: false,
    },
    {
      icon: Phone,
      title: t(content, "contact.phoneLabel"),
      text: t(content, "contact.phone"),
      ltr: true,
    },
    {
      icon: Mail,
      title: t(content, "contact.emailLabel"),
      text: t(content, "contact.email"),
      ltr: true,
    },
  ];

  return (
    <section
      id="contact"
      className="relative scroll-mt-28 bg-[#faf6f1] md:scroll-mt-32"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24 lg:px-14">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-amber-950">
            {t(content, "contact.title")}
          </h2>
          <p className="mt-2 text-amber-900/60">
            {t(content, "contact.subtitle")}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardContent className="space-y-4 p-6">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">الاسم</Label>
                  <Input id="contact-name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">البريد الإلكتروني</Label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message">الرسالة</Label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                  />
                </div>
                <Button type="submit">إرسال الرسالة</Button>
                <p className="text-xs text-amber-900/50">
                  {t(content, "contact.formNote")}
                </p>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {info.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 border border-amber-900/10 bg-white p-5"
              >
                <span className="rounded-lg bg-amber-100 p-2 text-amber-900">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-amber-950">{item.title}</h3>
                  <p
                    className="text-sm text-amber-900/70"
                    dir={item.ltr ? "ltr" : undefined}
                  >
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TornEdge fill="#1a120c" />
    </section>
  );
}
