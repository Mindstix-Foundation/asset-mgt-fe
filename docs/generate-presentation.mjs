import PptxGenJS from 'pptxgenjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const screenshotsDir = join(__dirname, 'screenshots');
const outputPath = join(__dirname, 'Pebble_Asset_Tracker_Presentation.pptx');

const pptx = new PptxGenJS();
pptx.author = 'Mindstix Foundation Trust';
pptx.title = 'Pebble Asset Tracker - Project Overview';
pptx.subject = 'Asset Management Platform';
pptx.company = 'Mindstix Foundation Trust';

const COLORS = {
  primary: '1A365D',
  accent: '2B6CB0',
  light: 'EBF8FF',
  text: '2D3748',
  muted: '718096',
  white: 'FFFFFF',
};

const FOOTER = 'Pebble Asset Tracker | Mindstix Foundation Trust';

function addHeader(slide, title, subtitle) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.85,
    fill: { color: COLORS.primary },
    line: { color: COLORS.primary },
  });
  slide.addText(title, {
    x: 0.5,
    y: 0.12,
    w: 9,
    h: 0.45,
    fontSize: 22,
    bold: true,
    color: COLORS.white,
    fontFace: 'Arial',
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.5,
      y: 0.52,
      w: 9,
      h: 0.28,
      fontSize: 11,
      color: COLORS.light,
      fontFace: 'Arial',
    });
  }
}

function addFooter(slide) {
  slide.addText(FOOTER, {
    x: 0.5,
    y: 5.25,
    w: 9,
    h: 0.25,
    fontSize: 9,
    color: COLORS.muted,
    fontFace: 'Arial',
    align: 'center',
  });
}

function addBullets(slide, items, opts = {}) {
  const bullets = items.map((item) => ({
    text: item,
    options: { bullet: true, breakLine: true },
  }));
  slide.addText(bullets, {
    x: opts.x ?? 0.5,
    y: opts.y ?? 1.05,
    w: opts.w ?? 4.2,
    h: opts.h ?? 4.0,
    fontSize: opts.fontSize ?? 13,
    color: COLORS.text,
    fontFace: 'Arial',
    valign: 'top',
    paraSpaceAfter: 6,
  });
}

function loadScreenshotData(filename) {
  const filePath = join(screenshotsDir, filename);
  if (!existsSync(filePath)) {
    console.warn(`Screenshot missing: ${filePath}`);
    return null;
  }
  const base64 = readFileSync(filePath).toString('base64');
  return `image/png;base64,${base64}`;
}

function addScreenshotSlide({ title, subtitle, image, bullets = [], layout = 'split' }) {
  const slide = pptx.addSlide();
  addHeader(slide, title, subtitle);

  const imgData = loadScreenshotData(image);
  if (!imgData) {
    slide.addText(`Screenshot not found: ${image}`, {
      x: 0.5,
      y: 2,
      w: 9,
      h: 1,
      fontSize: 14,
      color: COLORS.muted,
      align: 'center',
    });
    addFooter(slide);
    return;
  }

  const imageOpts = { data: imgData };
  if (layout === 'full') {
    slide.addImage({ ...imageOpts, x: 0.35, y: 1.0, w: 9.3, h: 4.15 });
  } else {
    slide.addImage({ ...imageOpts, x: 4.85, y: 1.0, w: 4.85, h: 4.0 });
    if (bullets.length) {
      addBullets(slide, bullets, { x: 0.4, y: 1.05, w: 4.3, h: 3.8, fontSize: 12 });
    }
  }

  addFooter(slide);
}

// ── Slide 1: Title ──
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.primary };
  slide.addText('Pebble Asset Tracker', {
    x: 0.5, y: 1.6, w: 9, h: 1, fontSize: 40, bold: true,
    color: COLORS.white, align: 'center', fontFace: 'Arial',
  });
  slide.addText('Intelligent Asset Management Platform', {
    x: 0.5, y: 2.6, w: 9, h: 0.6, fontSize: 22,
    color: COLORS.light, align: 'center', fontFace: 'Arial',
  });
  slide.addText('Developed by Mindstix Foundation Trust', {
    x: 0.5, y: 3.5, w: 9, h: 0.4, fontSize: 16,
    color: COLORS.light, align: 'center', fontFace: 'Arial',
  });
  slide.addText('Project Overview & User Guide', {
    x: 0.5, y: 4.2, w: 9, h: 0.4, fontSize: 14,
    color: COLORS.muted, align: 'center', fontFace: 'Arial',
  });
}

// ── Slide 2: Challenge ──
{
  const slide = pptx.addSlide();
  addHeader(slide, 'The Challenge', 'Why organizations need a better asset management solution');
  addBullets(slide, [
    'Manual asset tracking in spreadsheets is time-consuming and error-prone',
    'Poor visibility into real-time asset status and location',
    'Inefficient assignment and collection workflows',
    'Missed maintenance schedules and warranty expirations',
    'Difficulty maintaining audit trails for compliance',
    'Hours spent on manual reporting',
  ], { w: 8.8 });
  addFooter(slide);
}

// ── Slide 3: Solution ──
{
  const slide = pptx.addSlide();
  addHeader(slide, 'Our Solution', 'Pebble Asset Tracker — automate the complete asset lifecycle');
  addBullets(slide, [
    'Reduces administrative time by 70%+ through automation',
    'Real-time visibility across the entire asset lifecycle',
    'Automated maintenance reminders and warranty tracking',
    'Data-driven analytics and instant report generation',
    'Proactive alerts for overdue maintenance',
    'Enterprise-ready, scalable platform for IT organizations',
  ], { w: 8.8 });
  addFooter(slide);
}

// ── Slide 4: Login Screenshot ──
addScreenshotSlide({
  title: 'Getting Started — Login',
  subtitle: 'Secure authentication to access the platform',
  image: '01-login.png',
  bullets: [
    'Navigate to the application URL',
    'Sign in with username, employee ID, or email',
    'JWT-based secure authentication',
    'Password reset available via email',
    'Role-based access after login',
  ],
});

// ── Slide 5: Dashboard Screenshot ──
addScreenshotSlide({
  title: 'Dashboard Overview',
  subtitle: 'Real-time metrics and quick actions at a glance',
  image: '02-dashboard.png',
  bullets: [
    'Total, assigned, and available asset counts',
    'Maintenance status summary',
    'Quick actions: Add, Issue, Collect, Schedule',
    'Recent activity feed',
    'Asset distribution charts',
  ],
});

// ── Slide 6: Core Modules ──
{
  const slide = pptx.addSlide();
  addHeader(slide, 'Core Modules', 'Six integrated modules for complete asset management');
  const modules = [
    ['Asset Management', 'Lifecycle tracking, serial numbers, bulk CSV import'],
    ['Assignment Management', 'Issue & collect workflows, condition docs'],
    ['Maintenance', 'Scheduling, cost tracking, automated alerts'],
    ['Employee Management', 'Profiles, asset mapping, bulk import'],
    ['Vendor Management', 'Supplier & service provider directory'],
    ['Reports & Analytics', 'Dashboard KPIs, PDF/Excel/CSV export'],
  ];
  modules.forEach(([t, d], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 4.7;
    const y = 1.1 + row * 1.35;
    slide.addShape(pptx.ShapeType.rect, {
      x, y, w: 4.4, h: 1.15,
      fill: { color: COLORS.light },
      line: { color: COLORS.accent, pt: 1 },
    });
    slide.addText(t, { x: x + 0.15, y: y + 0.1, w: 4.1, h: 0.35, fontSize: 13, bold: true, color: COLORS.primary, fontFace: 'Arial' });
    slide.addText(d, { x: x + 0.15, y: y + 0.45, w: 4.1, h: 0.6, fontSize: 11, color: COLORS.text, fontFace: 'Arial' });
  });
  addFooter(slide);
}

// ── Slide 7: Assets Screenshot ──
addScreenshotSlide({
  title: 'Asset Management',
  subtitle: 'Complete inventory with search, filters, and bulk operations',
  image: '03-assets.png',
  bullets: [
    'View all assets in list or grid view',
    'Search by ID, model, brand, or serial number',
    'Add assets individually or bulk upload via CSV',
    'Issue, collect, and schedule maintenance',
    'Track status, condition, and location',
  ],
});

// ── Slide 8: Issue Asset Screenshot ──
addScreenshotSlide({
  title: 'Issue Asset Workflow',
  subtitle: 'Assign available assets to employees in minutes',
  image: '09-issue-asset.png',
  bullets: [
    'Select from available assets only',
    'Choose active employee from dropdown',
    'Document issue reason and date',
    'Add optional notes for context',
    'Asset brand-model auto-populated',
  ],
});

// ── Slide 9: Employees Screenshot ──
addScreenshotSlide({
  title: 'Employee Management',
  subtitle: 'Manage employee profiles and asset assignments',
  image: '04-employees.png',
  bullets: [
    'Employee directory with search and filters',
    'View assets assigned to each employee',
    'Bulk import employees via CSV',
    'Issue assets directly from employee view',
    'Track employee status (Active/Inactive)',
  ],
});

// ── Slide 10: Maintenance Screenshot ──
addScreenshotSlide({
  title: 'Maintenance & Repairs',
  subtitle: 'Track maintenance status and service history',
  image: '05-maintenance.png',
  bullets: [
    'Status cards: Under Maintenance, Scheduled, Completed, Cancelled',
    'Search and filter maintenance records',
    'Schedule preventive or corrective maintenance',
    'Track estimated and actual costs',
    'Link maintenance to service vendors',
  ],
});

// ── Slide 11: Schedule Maintenance Screenshot ──
addScreenshotSlide({
  title: 'Schedule Maintenance',
  subtitle: 'Plan preventive and corrective maintenance activities',
  image: '06-schedule-maintenance.png',
  bullets: [
    'Select asset that needs maintenance',
    'Choose maintenance type (Preventive, Corrective, etc.)',
    'Set scheduled date and frequency',
    'Enter estimated cost and description',
    'Asset details auto-populated on selection',
  ],
});

// ── Slide 12: Vendors Screenshot ──
addScreenshotSlide({
  title: 'Vendor Management',
  subtitle: 'Centralized supplier and service provider directory',
  image: '07-vendors.png',
  bullets: [
    'Manage vendor profiles and contacts',
    'Classify as supplier, service provider, etc.',
    'Bulk import vendor data via CSV',
    'Link vendors to maintenance tasks',
    'Track active/inactive vendor status',
  ],
});

// ── Slide 13: Reports Screenshot ──
addScreenshotSlide({
  title: 'Reports & Analytics',
  subtitle: 'Generate and export comprehensive asset reports',
  image: '08-reports.png',
  bullets: [
    'Pre-built reports: Asset, Employee, Maintenance',
    'One-click Excel export for each report type',
    'Custom report builder with filters',
    'Analytics dashboard with charts',
    'Export to PDF, Excel, or CSV',
  ],
});

// ── Slide 14: Architecture ──
{
  const slide = pptx.addSlide();
  addHeader(slide, 'System Architecture', 'Modern full-stack web application');
  slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.3, w: 2.8, h: 1.2, fill: { color: COLORS.light }, line: { color: COLORS.accent, pt: 1.5 } });
  slide.addText('Frontend\n(Vue.js 3 + TypeScript)', { x: 0.5, y: 1.45, w: 2.8, h: 1, fontSize: 14, bold: true, color: COLORS.primary, align: 'center', fontFace: 'Arial' });
  slide.addShape(pptx.ShapeType.rect, { x: 3.6, y: 1.55, w: 2.8, h: 0.7, fill: { color: COLORS.accent }, line: { color: COLORS.accent } });
  slide.addText('REST API (NestJS)', { x: 3.6, y: 1.65, w: 2.8, h: 0.5, fontSize: 13, bold: true, color: COLORS.white, align: 'center', fontFace: 'Arial' });
  slide.addShape(pptx.ShapeType.rect, { x: 6.7, y: 1.3, w: 2.8, h: 1.2, fill: { color: COLORS.light }, line: { color: COLORS.accent, pt: 1.5 } });
  slide.addText('Database\n(PostgreSQL + Prisma)', { x: 6.7, y: 1.45, w: 2.8, h: 1, fontSize: 14, bold: true, color: COLORS.primary, align: 'center', fontFace: 'Arial' });
  slide.addText('→', { x: 3.2, y: 1.65, w: 0.5, h: 0.5, fontSize: 24, color: COLORS.accent });
  slide.addText('→', { x: 6.3, y: 1.65, w: 0.5, h: 0.5, fontSize: 24, color: COLORS.accent });
  addBullets(slide, [
    'Frontend: Vue 3, Vite, Bootstrap 5, Pinia, Vue Router',
    'Backend: NestJS, JWT auth, Swagger API docs at /api/docs',
    'Database: PostgreSQL with Prisma ORM and migrations',
    'Security: Role-based access, bcrypt passwords, token refresh',
  ], { y: 2.8, w: 8.8, fontSize: 14 });
  addFooter(slide);
}

// ── Slide 15: Setup ──
{
  const slide = pptx.addSlide();
  addHeader(slide, 'Development Setup', 'Run the application locally');
  addBullets(slide, [
    'Prerequisites: Node.js 18+, PostgreSQL 12+, npm 8+',
    'Backend: asset-mgt-be → npm install → .env → prisma migrate → npm run seed → npm run start:dev',
    'Frontend: asset-mgt-fe/frontend → npm install → VITE_API_BASE_URL → npm run dev',
    'Backend: http://localhost:3000  |  Swagger: /api/docs',
    'Frontend: http://localhost:5173',
  ], { w: 8.8, fontSize: 13 });
  addFooter(slide);
}

// ── Slide 16: Team ──
{
  const slide = pptx.addSlide();
  addHeader(slide, 'Project Team', 'Mindstix Foundation Trust');
  slide.addTable(
    [
      [
        { text: 'Role', options: { bold: true, fill: { color: COLORS.accent }, color: COLORS.white } },
        { text: 'Name', options: { bold: true, fill: { color: COLORS.accent }, color: COLORS.white } },
      ],
      ['Project Idea', 'Roshan Kulkarni, CEO — Mindstix Software Labs'],
      ['Project Manager', 'Siddhant Raut'],
      ['Developers', 'Uday Narsale & Nishant Bondre'],
    ],
    { x: 1.5, y: 1.5, w: 7, h: 2, fontSize: 14, fontFace: 'Arial', border: { type: 'solid', color: COLORS.muted, pt: 0.5 }, colW: [2.5, 4.5], valign: 'middle' }
  );
  slide.addText('Repositories: asset-mgt-fe (Frontend) | asset-mgt-be (Backend API)', {
    x: 0.5, y: 4, w: 9, h: 0.4, fontSize: 12, color: COLORS.muted, align: 'center', fontFace: 'Arial',
  });
  addFooter(slide);
}

// ── Slide 17: Thank You ──
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.primary };
  slide.addText('Thank You', {
    x: 0.5, y: 2, w: 9, h: 0.8, fontSize: 36, bold: true, color: COLORS.white, align: 'center', fontFace: 'Arial',
  });
  slide.addText('Pebble Asset Tracker', {
    x: 0.5, y: 2.9, w: 9, h: 0.5, fontSize: 20, color: COLORS.light, align: 'center', fontFace: 'Arial',
  });
  slide.addText('Simplifying asset management for IT companies\nEmpowering organizations, one asset at a time.', {
    x: 0.5, y: 3.6, w: 9, h: 0.8, fontSize: 14, color: COLORS.muted, align: 'center', fontFace: 'Arial',
  });
}

await pptx.writeFile({ fileName: outputPath });
console.log(`Presentation saved to: ${outputPath}`);
