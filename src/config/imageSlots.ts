/**
 * Image Slots Configuration for PyNotes Store
 * 
 * Replace any image file path below with your real photography or 3D renders.
 * Every slot is configured with recommended resolution, aspect ratio, and descriptive alt text.
 */

export interface ImageSlot {
  id: string;
  name: string;
  fileName: string;
  path: string;
  recommendedSize: string;
  aspectRatio: string;
  altText: string;
  category: 'hero' | 'subject_mockup' | 'craftsmanship' | 'process' | 'sample_page';
  description: string;
}

export const IMAGE_SLOTS: Record<string, ImageSlot> = {
  // Hero Banner
  hero_banner: {
    id: 'hero_banner',
    name: 'Wide Hero Promo Banner',
    fileName: 'hero-banner.png',
    path: '/hero-banner.png',
    recommendedSize: '2880 × 1372 px (~2:1)',
    aspectRatio: '2880:1372',
    altText: 'PyNotes Promotional Hero Banner featuring books, bundles, and handwritten notes offer',
    category: 'hero',
    description: 'Full-width promo banner displayed in the Hero section with interactive CTA shop button',
  },

  // Hero Section
  hero_open_notebook: {
    id: 'hero_open_notebook',
    name: 'Open Notebook with Colourful Handwritten Pages',
    fileName: 'hero_open_notebook.webp',
    path: '/assets/images/hero_open_notebook.webp',
    recommendedSize: '1200 × 900 px (4:3)',
    aspectRatio: '4:3',
    altText: 'Open wire-bound notebook displaying colorful handwritten programming notes, multi-colored highlighters, syntax trees, and flowcharts',
    category: 'hero',
    description: 'Prominently showcased in the hero section alongside glossy book mockups',
  },

  // Close-up & Craftsmanship
  notes_macro_diagram: {
    id: 'notes_macro_diagram',
    name: 'Handwritten Diagrams & Syntax Macro Close-up',
    fileName: 'notes_macro_diagram.webp',
    path: '/assets/images/notes_macro_diagram.webp',
    recommendedSize: '800 × 600 px (4:3)',
    aspectRatio: '4:3',
    altText: 'Macro close-up of ink pen strokes, structured decision trees, and pastel highlighter highlights on textured cream paper',
    category: 'craftsmanship',
    description: 'Used in the Our Story and Comparison sections to highlight physical ink quality',
  },

  student_studying: {
    id: 'student_studying',
    name: 'Student Studying with Handwritten Notes',
    fileName: 'student_studying.webp',
    path: '/assets/images/student_studying.webp',
    recommendedSize: '800 × 600 px (4:3)',
    aspectRatio: '4:3',
    altText: 'Student focused at study desk annotating handwritten notes under warm desk lamp, hands writing with pen',
    category: 'craftsmanship',
    description: 'Visual for Our Story section showcasing active recall and deep focus',
  },

  parcel_shipping: {
    id: 'parcel_shipping',
    name: 'Packed Parcel Ready for Express Courier',
    fileName: 'parcel_shipping.webp',
    path: '/assets/images/parcel_shipping.webp',
    recommendedSize: '800 × 600 px (4:3)',
    aspectRatio: '4:3',
    altText: 'Safely packed parcel box with protective bubble mailer and express courier shipping label',
    category: 'process',
    description: 'Fourth step in the "How It is Made & Delivered" timeline',
  },

  // Sample Pages for "Look Inside" Carousel
  sample_page_algorithms: {
    id: 'sample_page_algorithms',
    name: 'Sample Page: Algorithm & Memory Layout',
    fileName: 'sample_page_algorithms.webp',
    path: '/assets/images/sample_page_algorithms.webp',
    recommendedSize: '900 × 1200 px (3:4)',
    aspectRatio: '3:4',
    altText: 'Sample handwritten page showing pointers, recursion stack memory frames, and colored execution pointers',
    category: 'sample_page',
    description: 'Page sample in the Look Inside carousel',
  },

  sample_page_trees: {
    id: 'sample_page_trees',
    name: 'Sample Page: Binary Search Trees & Graphs',
    fileName: 'sample_page_trees.webp',
    path: '/assets/images/sample_page_trees.webp',
    recommendedSize: '900 × 1200 px (3:4)',
    aspectRatio: '3:4',
    altText: 'Handwritten graph traversal algorithms with color-coded nodes and time-complexity cheat box',
    category: 'sample_page',
    description: 'Page sample in the Look Inside carousel',
  },

  sample_page_sql: {
    id: 'sample_page_sql',
    name: 'Sample Page: SQL Joins & Schema Relationships',
    fileName: 'sample_page_sql.webp',
    path: '/assets/images/sample_page_sql.webp',
    recommendedSize: '900 × 1200 px (3:4)',
    aspectRatio: '3:4',
    altText: 'Visual Venn diagrams explaining INNER, LEFT, and FULL OUTER joins with real SQL query traces',
    category: 'sample_page',
    description: 'Page sample in the Look Inside carousel',
  },

  // 3D Book Mockups (One per subject: 12 subjects)
  subject_c: {
    id: 'subject_c',
    name: 'C Programming Book Mockup',
    fileName: 'book_mockup_c.webp',
    path: '/assets/images/book_mockup_c.webp',
    recommendedSize: '800 × 1060 px (3:4)',
    aspectRatio: '3:4',
    altText: 'Glossy 3D book mockup of C Programming Simplified Handwritten Notes with ink spine and yellow highlighter title',
    category: 'subject_mockup',
    description: 'Subject card & product catalog for C Programming',
  },

  subject_cpp: {
    id: 'subject_cpp',
    name: 'C++ Programming Book Mockup',
    fileName: 'book_mockup_cpp.webp',
    path: '/assets/images/book_mockup_cpp.webp',
    recommendedSize: '800 × 1060 px (3:4)',
    aspectRatio: '3:4',
    altText: 'Glossy 3D book mockup of C++ Programming with STL & OOP Handwritten Notes',
    category: 'subject_mockup',
    description: 'Subject card & product catalog for C++',
  },

  subject_java: {
    id: 'subject_java',
    name: 'Java Programming Book Mockup',
    fileName: 'book_mockup_java.webp',
    path: '/assets/images/book_mockup_java.webp',
    recommendedSize: '800 × 1060 px (3:4)',
    aspectRatio: '3:4',
    altText: 'Glossy 3D book mockup of Core Java & OOPs Concepts Handwritten Notes with amber accents',
    category: 'subject_mockup',
    description: 'Subject card & product catalog for Java',
  },

  subject_python: {
    id: 'subject_python',
    name: 'Python Programming Book Mockup',
    fileName: 'book_mockup_python.webp',
    path: '/assets/images/book_mockup_python.webp',
    recommendedSize: '800 × 1060 px (3:4)',
    aspectRatio: '3:4',
    altText: 'Glossy 3D book mockup of Python Programming from Scratch Handwritten Notes with mint green accents',
    category: 'subject_mockup',
    description: 'Subject card & product catalog for Python',
  },

  subject_dsa: {
    id: 'subject_dsa',
    name: 'Data Structures & Algorithms Book Mockup',
    fileName: 'book_mockup_dsa.webp',
    path: '/assets/images/book_mockup_dsa.webp',
    recommendedSize: '800 × 1060 px (3:4)',
    aspectRatio: '3:4',
    altText: 'Glossy 3D book mockup of Data Structures & Algorithms Master Notes with diagrammatic illustrations',
    category: 'subject_mockup',
    description: 'Subject card & product catalog for DSA',
  },

  subject_sql: {
    id: 'subject_sql',
    name: 'SQL & Database Design Book Mockup',
    fileName: 'book_mockup_sql.webp',
    path: '/assets/images/book_mockup_sql.webp',
    recommendedSize: '800 × 1060 px (3:4)',
    aspectRatio: '3:4',
    altText: 'Glossy 3D book mockup of SQL & Query Optimization Handwritten Notes',
    category: 'subject_mockup',
    description: 'Subject card & product catalog for SQL',
  },

  subject_dbms: {
    id: 'subject_dbms',
    name: 'DBMS & Architecture Book Mockup',
    fileName: 'book_mockup_dbms.webp',
    path: '/assets/images/book_mockup_dbms.webp',
    recommendedSize: '800 × 1060 px (3:4)',
    aspectRatio: '3:4',
    altText: 'Glossy 3D book mockup of Database Management Systems Handwritten Notes with normalization tables',
    category: 'subject_mockup',
    description: 'Subject card & product catalog for DBMS',
  },

  subject_os: {
    id: 'subject_os',
    name: 'Operating System Book Mockup',
    fileName: 'book_mockup_os.webp',
    path: '/assets/images/book_mockup_os.webp',
    recommendedSize: '800 × 1060 px (3:4)',
    aspectRatio: '3:4',
    altText: 'Glossy 3D book mockup of Operating Systems Handwritten Notes with scheduling and memory management diagrams',
    category: 'subject_mockup',
    description: 'Subject card & product catalog for Operating System',
  },

  subject_html: {
    id: 'subject_html',
    name: 'HTML5 Semantic Web Book Mockup',
    fileName: 'book_mockup_html.webp',
    path: '/assets/images/book_mockup_html.webp',
    recommendedSize: '800 × 1060 px (3:4)',
    aspectRatio: '3:4',
    altText: 'Glossy 3D book mockup of HTML5 & Semantic Web Development Handwritten Notes with orange spine',
    category: 'subject_mockup',
    description: 'Subject card & product catalog for HTML',
  },

  subject_css: {
    id: 'subject_css',
    name: 'CSS3 & Modern Layouts Book Mockup',
    fileName: 'book_mockup_css.webp',
    path: '/assets/images/book_mockup_css.webp',
    recommendedSize: '800 × 1060 px (3:4)',
    aspectRatio: '3:4',
    altText: 'Glossy 3D book mockup of CSS3 Flexbox & Grid Masterclass Handwritten Notes',
    category: 'subject_mockup',
    description: 'Subject card & product catalog for CSS',
  },

  subject_js: {
    id: 'subject_js',
    name: 'JavaScript Core & ES6+ Book Mockup',
    fileName: 'book_mockup_javascript.webp',
    path: '/assets/images/book_mockup_javascript.webp',
    recommendedSize: '800 × 1060 px (3:4)',
    aspectRatio: '3:4',
    altText: 'Glossy 3D book mockup of Modern JavaScript Engine & Async/Await Handwritten Notes with yellow accents',
    category: 'subject_mockup',
    description: 'Subject card & product catalog for JavaScript',
  },

  subject_datascience: {
    id: 'subject_datascience',
    name: 'Data Science & Python Book Mockup',
    fileName: 'book_mockup_datascience.webp',
    path: '/assets/images/book_mockup_datascience.webp',
    recommendedSize: '800 × 1060 px (3:4)',
    aspectRatio: '3:4',
    altText: 'Glossy 3D book mockup of Practical Data Science & Machine Learning Handwritten Notes',
    category: 'subject_mockup',
    description: 'Subject card & product catalog for Data Science',
  },
};

export const getSlot = (id: string): ImageSlot => {
  return IMAGE_SLOTS[id] || {
    id,
    name: id,
    fileName: `${id}.webp`,
    path: `/assets/images/${id}.webp`,
    recommendedSize: '800 × 1060 px',
    aspectRatio: '3:4',
    altText: 'PyNotes printed handwritten coding notebook',
    category: 'subject_mockup',
    description: 'Configurable book image slot',
  };
};
