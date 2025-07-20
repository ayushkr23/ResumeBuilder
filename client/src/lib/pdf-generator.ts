import jsPDF from "jspdf";
import type { ResumeData } from "@shared/schema";

export async function generatePDF(resumeData: ResumeData, template: string): Promise<void> {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Set font
  pdf.setFont("helvetica");

  if (template === "modern") {
    // Modern template with blue header
    // Header background
    pdf.setFillColor(59, 130, 246); // Blue-500
    pdf.rect(0, 0, pageWidth, 40, "F");

    // Name
    pdf.setFontSize(24);
    pdf.setTextColor(255, 255, 255);
    pdf.text(`${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}`, 20, 25);

    // Title
    pdf.setFontSize(14);
    pdf.text(resumeData.personalInfo.title || "", 20, 35);

    // Contact info
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    let yPos = 55;
    pdf.text(`Email: ${resumeData.personalInfo.email}`, 20, yPos);
    yPos += 8;
    if (resumeData.personalInfo.phone) {
      pdf.text(`Phone: ${resumeData.personalInfo.phone}`, 20, yPos);
      yPos += 8;
    }
    if (resumeData.personalInfo.location) {
      pdf.text(`Location: ${resumeData.personalInfo.location}`, 20, yPos);
      yPos += 8;
    }

    // Education section
    yPos += 10;
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Education", 20, yPos);
    yPos += 10;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    if (resumeData.education.length > 0) {
      const edu = resumeData.education[0];
      pdf.text(`${edu.degree} ${edu.fieldOfStudy || ""}`, 20, yPos);
      yPos += 6;
      pdf.text(`${edu.institution}`, 20, yPos);
      yPos += 6;
      if (edu.startYear && edu.endYear) {
        pdf.text(`${edu.startYear} - ${edu.endYear}`, 20, yPos);
        yPos += 6;
      }
      if (edu.gpa) {
        pdf.text(`GPA: ${edu.gpa}`, 20, yPos);
        yPos += 10;
      }
    }

    // Skills section
    if (resumeData.skills.length > 0) {
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Skills", 20, yPos);
      yPos += 10;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const skillsText = resumeData.skills.map(skill => skill.name).join(", ");
      const splitSkills = pdf.splitTextToSize(skillsText, pageWidth - 40);
      pdf.text(splitSkills, 20, yPos);
      yPos += splitSkills.length * 6;
    }

  } else if (template === "minimal") {
    // Minimal template
    let yPos = 30;

    // Name (centered)
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    const name = `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}`;
    const nameWidth = pdf.getTextWidth(name);
    pdf.text(name, (pageWidth - nameWidth) / 2, yPos);
    yPos += 10;

    // Title (centered)
    if (resumeData.personalInfo.title) {
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      const titleWidth = pdf.getTextWidth(resumeData.personalInfo.title);
      pdf.text(resumeData.personalInfo.title, (pageWidth - titleWidth) / 2, yPos);
      yPos += 15;
    }

    // Horizontal line
    pdf.setLineWidth(0.5);
    pdf.line(20, yPos, pageWidth - 20, yPos);
    yPos += 15;

    // Contact info (centered)
    pdf.setFontSize(10);
    const contactInfo = [
      resumeData.personalInfo.email,
      resumeData.personalInfo.phone,
      resumeData.personalInfo.location,
    ].filter(Boolean).join(" • ");
    
    const contactWidth = pdf.getTextWidth(contactInfo);
    pdf.text(contactInfo, (pageWidth - contactWidth) / 2, yPos);
    yPos += 20;

    // Education
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Education", 20, yPos);
    yPos += 10;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    if (resumeData.education.length > 0) {
      const edu = resumeData.education[0];
      pdf.text(`${edu.degree} ${edu.fieldOfStudy || ""}`, 20, yPos);
      yPos += 6;
      pdf.text(`${edu.institution}`, 20, yPos);
      yPos += 6;
      if (edu.startYear && edu.endYear) {
        pdf.text(`${edu.startYear} - ${edu.endYear}`, 20, yPos);
        yPos += 10;
      }
    }

    // Skills
    if (resumeData.skills.length > 0) {
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Skills", 20, yPos);
      yPos += 10;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const skillsText = resumeData.skills.map(skill => skill.name).join(", ");
      const splitSkills = pdf.splitTextToSize(skillsText, pageWidth - 40);
      pdf.text(splitSkills, 20, yPos);
    }

  } else if (template === "creative") {
    // Creative sidebar template
    // Sidebar background
    pdf.setFillColor(147, 51, 234); // Purple-600
    pdf.rect(0, 0, 70, pageHeight, "F");

    // Name in sidebar
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(255, 255, 255);
    pdf.text(resumeData.personalInfo.firstName || "", 10, 30);
    pdf.text(resumeData.personalInfo.lastName || "", 10, 45);

    // Title in sidebar
    if (resumeData.personalInfo.title) {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      const splitTitle = pdf.splitTextToSize(resumeData.personalInfo.title, 50);
      pdf.text(splitTitle, 10, 60);
    }

    // Main content area
    pdf.setTextColor(0, 0, 0);
    let yPos = 30;

    // Contact info
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Contact", 80, yPos);
    yPos += 10;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(resumeData.personalInfo.email, 80, yPos);
    yPos += 6;
    if (resumeData.personalInfo.phone) {
      pdf.text(resumeData.personalInfo.phone, 80, yPos);
      yPos += 6;
    }
    if (resumeData.personalInfo.location) {
      pdf.text(resumeData.personalInfo.location, 80, yPos);
      yPos += 15;
    }

    // Education
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Education", 80, yPos);
    yPos += 10;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    if (resumeData.education.length > 0) {
      const edu = resumeData.education[0];
      pdf.text(`${edu.degree} ${edu.fieldOfStudy || ""}`, 80, yPos);
      yPos += 6;
      pdf.text(`${edu.institution}`, 80, yPos);
      yPos += 6;
      if (edu.startYear && edu.endYear) {
        pdf.text(`${edu.startYear} - ${edu.endYear}`, 80, yPos);
        yPos += 15;
      }
    }

    // Skills
    if (resumeData.skills.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Skills", 80, yPos);
      yPos += 10;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const skillsText = resumeData.skills.map(skill => skill.name).join(", ");
      const splitSkills = pdf.splitTextToSize(skillsText, pageWidth - 100);
      pdf.text(splitSkills, 80, yPos);
    }
  }

  // Add timestamp
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 20, pageHeight - 10);

  // Download the PDF
  const fileName = `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.pdf`.replace(/\s+/g, '_');
  pdf.save(fileName);
}
