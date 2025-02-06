import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export function About() {
  return (
    <section className="flex flex-col md:flex-row py-4 md:py-16 px-4 w-full max-w-4xl mx-auto">
      <div className="relative aspect-square w-full mx-auto min-w-[200px] max-w-[200px] md:min-w-[250px] md:max-w-[250px] md:pr-8">
        <img
          src="/assets/me.jpg"
          alt="Profile picture"
          className="rounded-full w-full"
        />
      </div>

      <div className="flex flex-col items-center md:items-start md:pr-8 space-y-4 mt-4 md:mt-0 text-center md:text-left">
        <p className="text-lg text-gray-600">
          Hello! I&apos;m a passionate developer who loves building things for the
          web. I specialize in creating fast, accessible, and user-friendly
          applications using modern technologies.
        </p>
        <p className="text-lg text-gray-600">
          When I&apos;m not coding, you can find me exploring new technologies,
          contributing to open-source projects, or writing about my experiences
          in tech.
        </p>

        <div className="flex gap-4 mt-8">
          <a
            href="https://github.com/abdus"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-6 h-6" />
            <span className="sr-only">GitHub Profile</span>
          </a>
          <a
            href="https://twitter.com/azabdus"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter className="w-6 h-6" />
            <span className="sr-only">Twitter Profile</span>
          </a>
          <a
            href="https://linkedin.com/in/thisisabdus"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="w-6 h-6" />
            <span className="sr-only">LinkedIn Profile</span>
          </a>
          <a
            href="mailto:dev.abdus@gmail.com"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Mail className="w-6 h-6" />
            <span className="sr-only">Email Address</span>
          </a>
        </div>
      </div>
    </section>
  );
}
