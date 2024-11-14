import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { intro, work, education, projects, openSource } from "@/lib/content";

export async function GET(request: Request) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 32px;
              color: #111;
              max-width: 1200px;
              margin: 0 auto;
            }

            h1 {
              font-size: 24px;
              font-weight: 400;
              margin: 0 0 16px 0;
            }

            .nav {
              display: flex;
              gap: 12px;
              margin-bottom: 16px;
            }

            .nav-item {
              font-size: 13px;
              color: #111;
              text-decoration: none;
              border-bottom: 1px solid #111;
            }

            .about {
              font-size: 13px;
              line-height: 1.5;
              margin-bottom: 32px;
              color: #666;
              max-width: 600px;
            }

            .section {
              margin-bottom: 32px;
            }

            .section-title {
              font-size: 24px;
              font-weight: 400;
              margin-bottom: 24px;
            }

            .item {
              display: grid;
              grid-template-columns: 200px 1fr;
              gap: 16px;
              margin-bottom: 24px;
              padding-bottom: 24px;
              border-bottom: 1px solid #eee;
            }

            .item:last-child {
              border-bottom: none;
            }

            .item-left {
              font-size: 13px;
            }

            .item-title {
              font-size: 13px;
              font-weight: 400;
              margin-bottom: 2px;
            }

            .item-date, .item-location {
              font-size: 13px;
              color: #666;
              margin-bottom: 2px;
            }

            .item-right {
              font-size: 13px;
              color: #666;
            }

            .item-description {
              margin-bottom: 6px;
              line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <h1>${intro.name}</h1>

          <div class="nav">
            <a href="${intro.href}" class="nav-item">Portfolio</a>
            <a href="${intro.github}" class="nav-item">Github</a>
            <a href="${intro.linkedin}" class="nav-item">LinkedIn</a>
            <a href="mailto:${intro.email}" class="nav-item">Email</a>
          </div>

          <p class="about">${intro.about}</p>

          <div class="section">
            <h2 class="section-title">Work</h2>
            ${work.map(item => `
              <div class="item">
                <div class="item-left">
                  <div class="item-title">${item.title}</div>
                  <div class="item-date">${item.date}</div>
                  <div class="item-location">${item.location}</div>
                </div>
                <div class="item-right">
                  ${item.description.map(desc => `
                    <div class="item-description">${desc}</div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2 class="section-title">Education</h2>
            ${education.map(item => `
              <div class="item">
                <div class="item-left">
                  <div class="item-title">${item.title}</div>
                  <div class="item-date">${item.date}</div>
                  <div class="item-location">${item.location}</div>
                </div>
                <div class="item-right">
                  ${item.description.map(desc => `
                    <div class="item-description">${desc}</div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2 class="section-title">Projects</h2>
            ${projects.map(item => `
              <div class="item">
                <div class="item-left">
                  <div class="item-title">${item.title}</div>
                </div>
                <div class="item-right">
                  ${item.description.map(desc => `
                    <div class="item-description">${desc}</div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2 class="section-title">Open Source</h2>
            ${openSource.map(item => `
              <div class="item">
                <div class="item-left">
                  <div class="item-title">${item.title}</div>
                </div>
                <div class="item-right">
                  ${item.description.map(desc => `
                    <div class="item-description">${desc}</div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;

    await page.setContent(html);

    const pdf = await page.pdf({
      format: 'a4',
      printBackground: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
    });

    await browser.close();

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}