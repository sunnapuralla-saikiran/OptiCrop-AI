"""
OptiCropAI 2.0 - PDF Report Generation Service
Generates professional agricultural decision-support reports using ReportLab.
"""
import os
import io
from datetime import datetime
from typing import Dict, Any

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

REPORTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "reports"))
os.makedirs(REPORTS_DIR, exist_ok=True)

class ReportService:
    @staticmethod
    def generate_pdf(analysis_data: Dict[str, Any], output_path: str = None) -> str:
        """
        Creates a PDF report and returns the absolute file path.
        """
        if output_path is None:
            timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"OptiCropAI_Report_{timestamp_str}.pdf"
            output_path = os.path.join(REPORTS_DIR, filename)

        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()

        # Custom Agricultural Palette Styles
        primary_color = colors.HexColor("#1b4332")
        secondary_color = colors.HexColor("#2d6a4f")
        accent_color = colors.HexColor("#40916c")
        dark_text = colors.HexColor("#212529")
        light_bg = colors.HexColor("#f8f9fa")

        title_style = ParagraphStyle(
            "DocTitle",
            parent=styles["Heading1"],
            fontSize=22,
            leading=26,
            textColor=primary_color,
            spaceAfter=4
        )

        subtitle_style = ParagraphStyle(
            "DocSubTitle",
            parent=styles["Normal"],
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#52796f"),
            spaceAfter=12
        )

        h2_style = ParagraphStyle(
            "SectionH2",
            parent=styles["Heading2"],
            fontSize=13,
            leading=16,
            textColor=secondary_color,
            spaceBefore=12,
            spaceAfter=6
        )

        body_style = ParagraphStyle(
            "BodyDark",
            parent=styles["Normal"],
            fontSize=9,
            leading=13,
            textColor=dark_text
        )

        bold_label = ParagraphStyle(
            "BoldLabel",
            parent=styles["Normal"],
            fontSize=9,
            leading=13,
            textColor=primary_color,
            fontName="Helvetica-Bold"
        )

        elements = []

        # 1. Header Banner
        elements.append(Paragraph("🌾 OptiCropAI 2.0 — Agronomic Intelligence Report", title_style))
        elements.append(Paragraph(f"Autonomous Soil & Climatic Decision-Support System | Generated: {datetime.now().strftime('%B %d, %Y - %H:%M:%S UTC')}", subtitle_style))
        elements.append(HRFlowable(width="100%", thickness=2, color=primary_color, spaceAfter=10))

        # Extract payload data
        field_meta = analysis_data.get("field_meta", {})
        inputs = analysis_data.get("input_parameters", {})
        rec = analysis_data.get("recommendation", {})
        crop = rec.get("recommended_crop", "Unknown").capitalize()
        confidence = rec.get("confidence_percentage")
        conf_str = f"{confidence}%" if confidence is not None else "Model probability unavailable"
        model_ver = rec.get("model_version", "2.0.0")

        # 2. Field Information & Executive Summary Table
        field_table_data = [
            [
                Paragraph("<b>Field Name:</b>", bold_label),
                Paragraph(field_meta.get("field_name", "Primary Plot"), body_style),
                Paragraph("<b>Target Crop:</b>", bold_label),
                Paragraph(f"<b>{crop}</b>", bold_label)
            ],
            [
                Paragraph("<b>Location:</b>", bold_label),
                Paragraph(f"{field_meta.get('district', 'N/A')}, {field_meta.get('state', 'N/A')}", body_style),
                Paragraph("<b>Model Confidence:</b>", bold_label),
                Paragraph(conf_str, body_style)
            ],
            [
                Paragraph("<b>Soil Health Index:</b>", bold_label),
                Paragraph(f"{rec.get('soil_health', {}).get('soil_health_index', 'N/A')} / 100 ({rec.get('soil_health', {}).get('health_grade', '')})", body_style),
                Paragraph("<b>ML Engine:</b>", bold_label),
                Paragraph(f"RandomForest v{model_ver}", body_style)
            ]
        ]

        t_field = Table(field_table_data, colWidths=[1.4*inch, 2.2*inch, 1.4*inch, 2.2*inch])
        t_field.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), light_bg),
            ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#d8f3dc")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e9ecef")),
            ("PADDING", (0, 0), (-1, -1), 5),
        ]))
        elements.append(t_field)
        elements.append(Spacer(1, 10))

        # 3. Input Parameters Table
        elements.append(Paragraph("1. Soil & Environmental Telemetry", h2_style))
        param_table_data = [
            ["Parameter", "Field Value", "Standard Unit", "Agronomic Status"]
        ]

        param_analysis = rec.get("parameter_analysis", {})
        param_labels = {
            "N": "Nitrogen (N)", "P": "Phosphorus (P)", "K": "Potassium (K)",
            "ph": "Soil pH", "temperature": "Temperature",
            "humidity": "Relative Humidity", "rainfall": "Rainfall / Precip."
        }
        param_units = {
            "N": "kg/ha", "P": "kg/ha", "K": "kg/ha", "ph": "scale",
            "temperature": "°C", "humidity": "%", "rainfall": "mm"
        }

        for k, name in param_labels.items():
            val = inputs.get(k, "N/A")
            unit = param_units.get(k, "")
            stat = param_analysis.get(k, {}).get("status", "Analyzed")
            param_table_data.append([name, str(val), unit, stat])

        t_params = Table(param_table_data, colWidths=[2.2*inch, 1.4*inch, 1.4*inch, 2.2*inch])
        t_params.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), secondary_color),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 8),
            ("PADDING", (0, 0), (-1, -1), 4),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dee2e6")),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, light_bg])
        ]))
        elements.append(t_params)
        elements.append(Spacer(1, 8))

        # 4. Recommendation & Explainability
        elements.append(Paragraph(f"2. Recommendation Rationale: Why {crop}?", h2_style))
        exp = rec.get("explanation", {})
        summary = exp.get("summary", "Recommended based on multi-variable physiological match.")
        elements.append(Paragraph(summary, body_style))
        elements.append(Spacer(1, 4))

        for item in exp.get("reasons", [])[:4]:
            factor = item.get("factor", "Factor")
            rating = item.get("rating", "")
            detail = item.get("detail", "")
            p_text = f"• <b>{factor}</b> ({rating}): {detail}"
            elements.append(Paragraph(p_text, body_style))

        elements.append(Spacer(1, 8))

        # 5. Soil Health Assessment
        elements.append(Paragraph("3. Soil Health Assessment", h2_style))
        sh = rec.get("soil_health", {})
        elements.append(Paragraph(f"<b>Soil Health Index:</b> {sh.get('soil_health_index', 'N/A')}/100 — <i>{sh.get('health_grade', '')}</i>", body_style))
        elements.append(Paragraph(f"<b>Calculation Basis:</b> {sh.get('calculation_basis', '')}", body_style))

        for concern in sh.get("concerns", []):
            elements.append(Paragraph(f"• <b>Soil Concern:</b> {concern}", body_style))

        elements.append(Spacer(1, 8))

        # 6. Risk Analysis Table
        elements.append(Paragraph("4. Agronomic Hazard & Risk Analysis", h2_style))
        risks = rec.get("risks", [])
        risk_table_data = [["Category", "Severity", "Risk Description", "Recommended Action"]]
        for r in risks[:4]:
            risk_table_data.append([
                Paragraph(r.get("category", ""), body_style),
                Paragraph(r.get("severity", ""), bold_label),
                Paragraph(r.get("reason", ""), body_style),
                Paragraph(r.get("action", ""), body_style),
            ])

        t_risk = Table(risk_table_data, colWidths=[1.5*inch, 0.9*inch, 2.5*inch, 2.3*inch])
        t_risk.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#495057")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 8),
            ("PADDING", (0, 0), (-1, -1), 4),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#ced4da")),
        ]))
        elements.append(t_risk)
        elements.append(Spacer(1, 8))

        # 7. Action Plan
        elements.append(Paragraph("5. Field Action Plan", h2_style))
        actions = rec.get("action_plan", [])
        for act in actions[:5]:
            cat = act.get("category", "")
            action_text = act.get("action", "")
            reason_text = act.get("reason", "")
            priority = act.get("priority", "Medium")
            elements.append(Paragraph(f"• [<b>{cat}</b> - {priority}] <b>{action_text}</b> — <i>{reason_text}</i>", body_style))

        elements.append(Spacer(1, 10))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#ced4da"), spaceAfter=6))
        elements.append(Paragraph("OptiCropAI 2.0 Platform © 2026. Data-driven agronomic recommendations are advisory in nature.", subtitle_style))

        # Build Document
        doc.build(elements)
        return output_path
