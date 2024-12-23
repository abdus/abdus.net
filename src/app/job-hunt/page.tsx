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
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { DownloadIcon } from "lucide-react";

export default function JobHunt() {
  return (
    <div className="overflow-auto h-full">
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

          <h3 className="mt-16">Email Template for Referral</h3>

          <p>
            I would love some help with my job hunt. If you know of any open
            positions that you think I would be a good fit for, please refer me.
          </p>

          <div className="max-w-[80ch] p-4 md:p-8 border border-dashed bg-accent rounded-lg">
            <div>Dear Hiring Manager,</div>

            <p>
              I am looking for a new opportunity and I think I would be a great
              fit for your team. I have extensive experience with JavaScript and
              its frameworks, proficiency in AWS, and comfortable in startup
              environments. I am skilled at designing systems, driven by
              curiosity, and excel at solving engineering challenges. I thrive
              in roles that let me stay curious and ship quickly.
            </p>
          </div>

          <div className="col-span-2 flex items-center justify-end gap-4 max-w-[80ch] mt-8">
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2"
            >
              <DownloadIcon className="size-4" /> Download Resume
            </Button>

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
                  <Button type="button" variant="outline">
                    Open Email
                  </Button>
                  <Button type="button">Download Resume and Open Email</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <h3 className="mt-16">My Resume</h3>
          <p>
            I would love some help with my job hunt. If you know of any open
            positions that you think I would be a good fit for, please refer me.
          </p>

          <object
            type="application/pdf"
            data="/resume.pdf"
            className="w-full aspect-[1/1.4]"
          >
            <p>
              This browser does not support PDFs. Please download the PDF to
              view it:{" "}
              <a href="/resume.pdf" download="resume_abdus-azad_fullstack.pdf">
                Download Resume
              </a>
            </p>
          </object>
        </div>
      </Container>
    </div>
  );
}
