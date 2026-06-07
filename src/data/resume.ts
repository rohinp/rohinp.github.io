export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
};

export type CompetencyGroup = {
  label: string;
  items: string[];
};

export type Contribution = {
  title: string;
  description: string;
};

export type Talk = {
  title: string;
  venue: string;
};

export type Education = {
  program: string;
  institution: string;
  note: string;
};

export type ResumeData = {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  summary: string;
  availability: {
    status: string;
    note: string;
  };
  experience: ExperienceItem[];
  competencies: CompetencyGroup[];
  openSource: Contribution[];
  talks: Talk[];
  education: Education;
  awards: string[];
};

export const resume: ResumeData = {
  name: "Rohin Patel",
  role: "Senior Software Engineer · AI Platform Lead",
  location: "Amsterdam, NL",
  email: "rohin.patel@outlook.com",
  phone: "+31 621 388 735",
  website: "https://rohin-lab.com",
  summary:
    "Senior Software Engineer and technical leader with 15+ years designing distributed systems, cyber security products, and AI-powered applications across global enterprises.",
  availability: {
    status: "Leading AI + distributed platforms at IBM's ReaQta",
    note: "Exploring technical leadership and collaboration opportunities that blend multi-tenant systems with Generative AI.",
  },
  experience: [
    {
      company: "ReaQta (IBM Company)",
      role: "Senior Software Engineer / Lead Developer",
      period: "Jan 2023 — Present",
      location: "Netherlands",
      highlights: [
        "Designed distributed backend services processing large cyber-security telemetry streams with Scala, Akka, Cassandra, and Elasticsearch.",
        "Led the migration from isolated deployments to a multi-tenant MSSP architecture, stewarding multiple enterprise cutovers.",
        "Introduced the platform's first RAG solution for explaining Detection Strategies and expanded AI assistance across docs, context search, and navigation.",
        "Delivered an Agentic RAG evaluator that inspects user-authored Detection Strategies for logical flaws and event-storm risks.",
        "Drove WatsonX AI and LangChain integrations, vector search capabilities, and fine-tuning experiments for strategy generation while mentoring global teams.",
      ],
    },
    {
      company: "VakantieDiscounter",
      role: "Senior Developer",
      period: "Nov 2021 — Dec 2022",
      location: "Amsterdam, Netherlands",
      highlights: [
        "Developed backend systems aggregating holiday packages across tour operators.",
        "Refactored large Spark-based data pipelines and maintained Scala services for travel data curation.",
        "Operated production workloads with Jenkins, Docker, Kubernetes, HDFS, and Prometheus.",
      ],
    },
    {
      company: "HCL Technologies (Client: ING Bank)",
      role: "Senior Consultant",
      period: "May 2018 — Oct 2021",
      location: "Amsterdam, Netherlands",
      highlights: [
        "Built microservices powering ING's TouchPoint API marketplace and workflow engines.",
        "Ran Scala and Functional Programming workshops to level up internal teams.",
        "Championed modernization across Kubernetes, Cassandra, Kafka, and Azure DevOps.",
      ],
    },
    {
      company: "Springer Nature",
      role: "Senior Developer",
      period: "2017",
      location: "Pune, India",
      highlights: [
        "Co-architected a microservices-based publication platform using Scala, Kafka, and React.",
        "Supported hiring and mentoring initiatives within the engineering group.",
      ],
    },
    {
      company: "Bitwise Solutions",
      role: "Software Developer / Tech Lead",
      period: "2010 — 2016",
      location: "Pune, India",
      highlights: [
        "Led enterprise projects across Java, Scala, Big Data, and web stacks while mentoring engineers.",
        "Designed ETL testing and business-rule platforms and embedded Agile practices across teams.",
      ],
    },
    {
      company: "Tech Mahindra",
      role: "Software Engineer",
      period: "2009 — 2010",
      location: "Pune, India",
      highlights: ["Built telecom customer-care solutions using ColdFusion and C#."],
    },
    {
      company: "IMC Global Services (Alyx Technologies)",
      role: "Software Engineer",
      period: "2009",
      location: "Pune, India",
      highlights: ["Developed education and learning-management products with Java, ColdFusion, JavaScript, and SQL Server."],
    },
    {
      company: "MixedLab",
      role: "Programmer",
      period: "2008 — 2009",
      location: "Mumbai, India",
      highlights: ["Contributed to assessment and analytics products focused on cognitive strengths and talent evaluation."],
    },
  ],
  competencies: [
    {
      label: "Artificial Intelligence",
      items: [
        "Agentic AI",
        "Retrieval-Augmented Generation (RAG)",
        "WatsonX AI",
        "LangChain",
        "LLM Integration",
        "Prompt Engineering",
        "Fine-Tuning Concepts",
        "AI Evaluation & Guardrails",
      ],
    },
    {
      label: "Distributed Systems",
      items: [
        "Akka",
        "Event Sourcing",
        "CQRS",
        "Kafka",
        "Cassandra",
        "Elasticsearch",
        "Microservices",
        "High-Volume Event Processing",
      ],
    },
    {
      label: "Cloud & DevOps",
      items: ["Kubernetes", "OpenShift", "Docker", "Jenkins", "Azure DevOps", "CI/CD"],
    },
    {
      label: "Programming Languages",
      items: ["Scala", "Python", "Java", "JavaScript", "C#", "Haskell"],
    },
  ],
  openSource: [
    {
      title: "Dhall-Scala",
      description: "Contributor enabling Scala services to consume Dhall configuration files across the ecosystem.",
    },
    {
      title: "Hydrograph",
      description: "Shaped the initial product design and architecture for the data orchestration platform.",
    },
    {
      title: "Community repos",
      description: "Additional public work available on GitHub and internal engineering workshops.",
    },
  ],
  talks: [
    { title: "Cascading vs MapReduce", venue: "Pune Hadoop Meetup" },
    { title: "Introduction to Functional Programming", venue: "Pune Scala Meetup" },
    { title: "Scala, FP & Architecture Workshops", venue: "Internal engineering communities" },
  ],
  education: {
    program: "Polytechnic Diploma in Computer Engineering",
    institution: "MSBTE, Maharashtra, India",
    note: "Graduated with First Class.",
  },
  awards: [
    "Excellence Award — Bitwise Solutions",
    "Excellence Award — Bitwise Solutions",
  ],
};
