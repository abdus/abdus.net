import Container from "@/components/container"
import Header from "@/components/header"
import { ProjectList, Organization } from "@/components/project-list"

const organizations: Organization[] = [
  {
    name: "Developer Tools & Extensions",
    isVisible: true,
    projects: [
      {
        title: "MiniGrep",
        description: "A mini program that copies the functionalities of GNU GREP (minus the RegEx part). I built it while learning Rust.",
        repo: "https://github.com/abdus/minigrep",
        tags: ["rust", "cargo"],
        isVisible: true,
        deprecated: false
      },
      {
        title: "GoldenFalcon",
        description: "GoldenFalcon is a Command-line application that can be used to send emails. Under the hood, it uses Nodemailer to deliver the emails.",
        repo: "https://github.com/abdus/goldenfalcon",
        tags: ["node.js", "cli"],
        isVisible: true,
        deprecated: false
      },
      {
        title: "LinkClick",
        description: "A chrome extension which will enable you to reach your favorite website quickly. This is the first project I built after learning HTML, CSS and JavaScript.",
        repo: "https://github.com/abdus/linkclick",
        tags: ["javascript", "chrome-extension"],
        isVisible: true,
        deprecated: true // Old project, not maintained
      },
      {
        title: "InspiroTab",
        description: "A Google Chrome extension to replace your default Google Chrome tab and greet you with a awesome wallpaper and a cool quote.",
        repo: "https://github.com/abdus/InspiroTab",
        tags: ["javascript", "chrome-extension"],
        isVisible: true,
        deprecated: true // Chrome manifest v2
      }
    ]
  },
  {
    name: "Web Applications",
    isVisible: true,
    projects: [
      {
        title: "Lynx Bar",
        description: "A website that contains a list of cool webapps. It has functionalities such as Searching etc. Made with Next.js",
        link: "https://lynx.bar",
        repo: "https://github.com/abdus/awesome-websites/",
        tags: ["react", "javascript", "next.js"],
        isVisible: true,
        deprecated: false,
        media: [
          {
            type: "image",
            url: "/assets/projects/lynx-bar.png",
            alt: "Lynx Bar Screenshot"
          }
        ]
      },
      {
        title: "DogeGram",
        description: "Love memes? I am sure you will love DogeGram too! DogeGram is like the 'Instagram for Memes'",
        link: "https://github.com/abdus/doge-gram",
        repo: "https://github.com/abdus/doge-gram",
        tags: ["next.js", "javascript"],
        isVisible: true,
        deprecated: false
      },
      {
        title: "Photo Editor",
        description: "Had fun with filter property of CSS. Supported operations are Blur, Brightness, Contrast etc. This can export the edited image.",
        link: "https://abdus.github.io/photo-editor/",
        repo: "https://github.com/abdus/photo-editor",
        tags: ["html", "css", "javascript"],
        isVisible: true,
        deprecated: false
      },
      {
        title: "Gradient Generator",
        description: "A web-app to generate CSS gradient. I built this to learn JavaScript and DOM manipulation.",
        link: "https://abdus.github.io/background-gradient-generator/",
        repo: "https://github.com/abdus/background-gradient-generator",
        tags: ["javascript", "css"],
        isVisible: true,
        deprecated: false,
        media: [
          {
            type: "image",
            url: "/assets/projects/gradient.png",
            alt: "Gradient Generator Screenshot"
          }
        ]
      },
      {
        title: "Pixel Art Maker",
        description: "This project is a part of Google-India Front-end Scholarship. User can create images by coloring small boxes.",
        link: "https://abdus.github.io/pixel-art-maker/",
        repo: "https://github.com/abdus/pixel-art-maker",
        tags: ["html", "css", "javascript"],
        isVisible: true,
        deprecated: false
      },
      {
        title: "Issue Tracker",
        description: "I intended to build a bug-tracker for software projects. Built using Node, EJS and MongoDB.",
        repo: "https://github.com/abdus/issue-tracker",
        tags: ["node", "mongodb", "ejs"],
        isVisible: false // Incomplete project
      }
    ]
  },
  {
    name: "Mobile Applications",
    isVisible: true,
    projects: [
      {
        title: "Flixx",
        description: "Flixx is an android app which allows user to browse through different movie genre. It fetches information from The Movie Database.",
        link: "https://github.com/abdus/flixx/releases/tag/v0.0.1",
        repo: "https://github.com/abdus/flixx",
        tags: ["react-native", "javascript", "android"],
        isVisible: true,
        deprecated: false,
        media: [
          {
            type: "image",
            url: "/assets/projects/flixx.png",
            alt: "Flixx App Screenshot"
          }
        ]
      },
      {
        title: "Focus Time",
        description: "A simple Android application to keep you focused. I built this in order to learn and get better at React Native.",
        link: "https://github.com/abdus/focus-time",
        repo: "https://github.com/abdus/focus-time",
        tags: ["react-native", "javascript"],
        isVisible: true,
        deprecated: false
      }
    ]
  },
  {
    name: "Libraries & Templates",
    isVisible: true,
    projects: [
      {
        title: "React DropDown",
        description: "A React library to add DropDown menu in web-applications. It creates a drop-down component (that can be customized) based on a given Array of Values.",
        repo: "https://github.com/abdus/react-dropdown",
        tags: ["react", "npm-package"],
        isVisible: true,
        deprecated: false
      },
      {
        title: "Webpack TypeScript Starter",
        description: "Starter template to easily set-up a new TypeScript project with Webpack. It has built-in support for CSS Modules.",
        repo: "https://github.com/abdus/webpack-typescript-starter",
        tags: ["typescript", "webpack"],
        isVisible: true,
        deprecated: false
      },
      {
        title: "Image Resizer",
        description: "SpringBoot webapp that resizes a given image based on the scale factor. It is capable of resizing images from remote location.",
        repo: "https://github.com/abdus/java-image-resizer",
        tags: ["java", "springboot"],
        isVisible: true,
        deprecated: false
      },
      {
        title: "React Chrome Extension",
        description: "This template initializes a React project that can be deployed as a Chrome Extension.",
        repo: "https://github.com/abdus/react-chrome-ext",
        tags: ["react", "chrome", "javascript"],
        isVisible: true,
        deprecated: true // Chrome manifest v2
      }
    ]
  },
  {
    name: "Configuration & Scripts",
    isVisible: true,
    projects: [
      {
        title: "Nginx Pretty Index",
        description: "A Beautiful auto-index page for Nginx. It uses XSLT, HTML and CSS to achieve the styles and functionalities.",
        link: "https://public.abdus.net",
        repo: "https://github.com/abdus/nginx-pretty-index",
        tags: ["xslt", "nginx"],
        isVisible: true,
        deprecated: false,
        media: [
          {
            type: "image",
            url: "/assets/projects/nginx-index.png",
            alt: "Nginx Pretty Index Screenshot"
          }
        ]
      },
      {
        title: "Dotfiles",
        description: "Dotfiles are text-based config files for different software. I maintain my dots so that I don't have to start from scratch everytime I change/reinstall the OS.",
        repo: "https://github.com/abdus/dotfiles",
        tags: ["bash", "lua"],
        isVisible: true,
        deprecated: false
      },
      {
        title: "Scripts",
        description: "Bunch of small scripts that I wrote at past. These scripts help me automate a few repetitive tasks.",
        repo: "https://github.com/abdus/scripts",
        tags: ["bash"],
        isVisible: true,
        deprecated: false
      },
      {
        title: "accueil.vim",
        description: "Accueil is a French phrase for Home. This is my first Vim plug-in written in VimScript. It does not do much tho, just a few text formatting.",
        repo: "https://github.com/abdus/accueil.vim",
        tags: ["vimscript"],
        isVisible: true,
        deprecated: false
      }
    ]
  }
]

export default function ProjectsPage() {
  return (
    <div className="overflow-auto">
      <Header />
      <Container className="max-w-4xl">
        <div className="py-4 md:py-16">
          <h1 className="text-3xl md:text-4xl mb-8">Projects</h1>
          <ProjectList organizations={organizations} />
        </div>
      </Container>
    </div>
  )
}
