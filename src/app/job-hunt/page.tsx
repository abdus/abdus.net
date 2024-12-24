"use client";

import Container from "@/components/container";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  EnvelopeOpenIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";
import { DownloadIcon, GlobeIcon, PhoneIcon } from "lucide-react";

const RESUME_PDF_DOWNLOAD_NAME = "Resume_Abdus-Azad_full-stack.pdf";
const EMAIL_CONTENT = `Dear [Hiring Manager's Name],

I hope you’re doing well. I’d like to refer Abdus Azad for an engineering position. Abdus has extensive experience in software development, with a strong foundation in both front-end and back-end technologies, including React, Node.js, TypeScript, AWS, and Docker.

He has consistently demonstrated technical proficiency and the ability to deliver impactful solutions. You can reach him at abdus@abdus.net or +91 7002 505 507.

Please let me know if there’s anything else you need.`;

export default function JobHunt() {
  return (
    <div className="overflow-auto h-full pb-32">
      <Header />

      <Container className="max-w-4xl">
        <header className="mb-4 border-b pb-2">
          <h2 className="text-2xl">Software Engineer</h2>
          <h3 className="text-lg">FE/BE/Full Stack</h3>
        </header>

        <div className="prose max-w-4xl text-[1.1em]">
          <p>
            I bring extensive experience with <strong>JavaScript</strong> and
            its frameworks, proficiency in <strong>AWS</strong>, and{" "}
            <strong>comfortable in startup</strong> environments. I am skilled
            at <strong>designing systems</strong>, driven by curiosity, and
            excel at solving engineering challenges. I thrive in roles that let
            me <strong>stay curious</strong> and <strong>ship quickly</strong>.
          </p>

          <h3 className="mt-16">Contact Info</h3>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <ContactInfoItem
              Icon={EnvelopeOpenIcon}
              text="abdus@abdus.net"
              href="mailto:abdus@abdus.net"
            />

            <ContactInfoItem
              Icon={PhoneIcon}
              text="+91 70025 05507"
              href="tel:+917002505507"
            />

            <ContactInfoItem
              Icon={GitHubLogoIcon}
              text="@abdus"
              href="https://github.com/abdus"
            />

            <ContactInfoItem
              Icon={LinkedInLogoIcon}
              text="@azAbdus"
              href="https://www.linkedin.com/in/abdus-azad/"
            />

            <ContactInfoItem
              Icon={GlobeIcon}
              text="abdus.net"
              href="https://abdus.net"
            />

            <ContactInfoItem
              Icon={DownloadIcon}
              text="Download Resume"
              href="/resume.pdf"
            />
          </div>

          <h3 className="mt-16">Email Template for Referral</h3>

          <p>
            I would love some help with my job hunt. If you know of any open
            positions that you think I would be a good fit for, please refer me.
          </p>

          <div className="max-w-[80ch] p-4 md:p-8 border border-dashed bg-accent rounded-lg">
            {EMAIL_CONTENT.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <div className="col-span-2 flex items-center justify-end gap-4 max-w-[80ch] mt-8">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="default"
                  className="flex items-center gap-2"
                >
                  Open Email and Send
                </Button>
              </DialogTrigger>

              <DialogContent onOpenAutoFocus={(ev) => ev.preventDefault()}>
                <DialogTitle>Confirm Resume Download</DialogTitle>
                <p>
                  As I cannot attach a PDF to an Email directly from this
                  website, would you like to download the Resume too, and attach
                  it to the email manually?
                </p>

                <DialogFooter className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(ev) => {
                      ev.preventDefault();

                      const mailtoLink = `mailto:?subject=${encodeURIComponent(
                        "Referral for Engineering Roles"
                      )}&body=${encodeURIComponent(EMAIL_CONTENT)}`;

                      window.open(mailtoLink, "_blank");
                    }}
                  >
                    Open Email
                  </Button>

                  <Button
                    type="button"
                    onClick={(ev) => {
                      ev.preventDefault();

                      const a = document.createElement("a");
                      a.href = "/resume.pdf";
                      a.download = RESUME_PDF_DOWNLOAD_NAME;
                      a.click();

                      const mailtoLink = `mailto:?subject=${encodeURIComponent(
                        "Referral for Engineering Roles"
                      )}&body=${encodeURIComponent(EMAIL_CONTENT)}`;

                      window.open(mailtoLink, "_blank");
                    }}
                  >
                    Download Resume and Open Email
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <h3 className="mt-16">My Resume</h3>
          <p>
            This is my current resume. You can view it in your browser or{" "}
            <a href="/resume.pdf" download={RESUME_PDF_DOWNLOAD_NAME}>
              download it
            </a>{" "}
            for later use.
          </p>

          <object
            data="/resume.pdf"
            type="application/pdf"
            className="w-full aspect-[1/1.4]"
          >
            <p>
              This browser does not support PDFs. Please download the PDF to
              view it:{" "}
              <a href="/resume.pdf" download={RESUME_PDF_DOWNLOAD_NAME}>
                Download Resume
              </a>
            </p>
          </object>

          <div className="mt-8">
            It has been{" "}
            <strong>
              {(
                (Date.now() - new Date("2024-12-20").getTime()) /
                (1000 * 60 * 60 * 24)
              ).toFixed(0)}{" "}
              days
            </strong>{" "}
            since I have been unemployed.
          </div>
        </div>
      </Container>
    </div>
  );
}

function ContactInfoItem({
  Icon,
  text,
  href,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: any;
  text: string;
  href: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-red-500" /> <a href={href}>{text}</a>
    </div>
  );
}
