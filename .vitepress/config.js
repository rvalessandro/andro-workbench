import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid(
  defineConfig({
    title: "rvalessandro",
    description: "How I think and work",

    // Only scan public folder
    srcDir: "./public",

    // Mermaid configuration
    mermaid: {},

  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Articles", link: "/articles" },
      { text: "Mental Models", link: "/mental-models/overview" },
      { text: "References", link: "/references" },
    ],

    sidebar: {
      "/": [
        {
          text: "Mental Models",
          items: [
            { text: "Overview", link: "/mental-models/overview" },
            { text: "How to be Successful", link: "/mental-models/how-to-be-successful" },
            { text: "General", link: "/mental-models/general" },
            { text: "Product", link: "/mental-models/product" },
            { text: "Engineering", link: "/mental-models/engineering" },
          ],
        },
        {
          text: "1:1 Framework",
          items: [
            { text: "Overview", link: "/1-1/framework" },
            { text: "Goal Setting", link: "/1-1/goal-setting" },
            { text: "Quarterly 1:1", link: "/1-1/quarterly_1-1" },
            { text: "Biweekly 1:1", link: "/1-1/biweekly_1-1" },
          ],
        },
        {
          text: "Retrospectives",
          items: [
            { text: "Framework", link: "/retrospectives/framework" },
            { text: "Project/Issue", link: "/retrospectives/project-issue" },
            {
              text: "Quarterly Review",
              link: "/retrospectives/quarterly-review",
            },
          ],
        },
        {
          text: "Career",
          items: [
            { text: "Social Capital", link: "/career/social-capital" },
            { text: "Levels Overview", link: "/career/overview" },
            {
              text: "Software Engineer",
              link: "/career/software-engineer-levels",
            },
            { text: "Product Manager", link: "/career/product-manager-levels" },
          ],
        },
        {
          text: "Quarterly Planning",
          items: [
            { text: "Rock Sizing", link: "/quarterly-planning/rock-sizing" },
            { text: "DRI Responsibilities", link: "/quarterly-planning/dri-responsibilities" },
            { text: "DRI Weekly Sync", link: "/quarterly-planning/dri-weekly-sync" },
          ],
        },
        {
          text: "Communication",
          items: [
            { text: "Overview", link: "/communication/overview" },
            { text: "Written Communication", link: "/communication/written-communication" },
            { text: "Feedback & Difficult Conversations", link: "/communication/feedback-and-difficult-conversations" },
          ],
        },
        {
          text: "Engineering",
          items: [
            { text: "Fundamentals", link: "/engineering/fundamentals" },
          ],
        },
        {
          text: "References",
          items: [
            { text: "All References", link: "/references" },
          ],
        },
      ],
    },

    search: {
      provider: "local",
      options: {
        // Only search public folder (default since srcDir is public)
      },
    },

    socialLinks: [{ icon: "github", link: "https://github.com/yourusername" }],
  },
}));
