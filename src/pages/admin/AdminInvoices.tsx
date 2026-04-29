import { useEffect, useMemo, useState } from "react";
import { FileText, Loader2, Download, Search, Printer, FileDown, Plus, Trash2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/products-data";
import logoUrl from "@/assets/logo.png";

// Cache du logo en base64 pour jsPDF
let logoDataUrlCache: string | null = null;
const getLogoDataUrl = async (): Promise<string> => {
  if (logoDataUrlCache) return logoDataUrlCache;
  const res = await fetch(logoUrl);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      logoDataUrlCache = reader.result as string;
      resolve(logoDataUrlCache);
    };
    reader.readAsDataURL(blob);
  });
};

const COMPANY = {
  name: "Hasilaza Motor",
  address: "HLM 2, Dakar, Sénégal",
  phone: "+221 76 935 83 17",
  email: "hasilazasenegal@gmail.com",
  rccm: "SN DKR 2022 B 41650",
  ninea: "009893216",
};

interface InvoiceOrder {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  customer_city: string;
  product_name: string;
  quantity: number;
  unit_price: number | null;
  total_price: number | null;
  status: string;
  created_at: string;
}

const statusColor: Record<string, string> = {
  delivered: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  shipped: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
  processing: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/20",
  confirmed: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20",
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
  cancelled: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/20",
};

const formatInvoiceNumber = (id: string, date: string) => {
  const d = new Date(date);
  return `FAC-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}-${id.slice(0, 6).toUpperCase()}`;
};

const printInvoice = (order: InvoiceOrder) => {
  const number = formatInvoiceNumber(order.id, order.created_at);
  const date = new Date(order.created_at).toLocaleDateString("fr-FR");
  const html = `<!doctype html><html><head><meta charset="utf-8"/><title>${number}</title><style>
    *{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif}
    body{padding:48px;color:#0a0a0a;background:#fff}
    .head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:48px;padding-bottom:24px;border-bottom:2px solid #e57e5c}
    h1{font-size:14px;color:#666;text-transform:uppercase;letter-spacing:.2em;margin-bottom:8px}
    .num{font-size:32px;font-weight:800;color:#e57e5c}
    .brand{text-align:right}
    .brand .name{font-size:24px;font-weight:800}
    .brand .info{font-size:12px;color:#666;margin-top:4px;line-height:1.6}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:48px}
    .block h3{font-size:11px;color:#999;text-transform:uppercase;letter-spacing:.15em;margin-bottom:8px}
    .block p{font-size:14px;line-height:1.6}
    table{width:100%;border-collapse:collapse;margin-bottom:32px}
    th{background:#f5f5f5;padding:12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#666}
    td{padding:16px 12px;border-bottom:1px solid #eee;font-size:14px}
    .right{text-align:right}
    .total{display:flex;justify-content:flex-end;margin-bottom:48px}
    .total .box{width:300px;background:#fafafa;padding:24px;border-radius:12px}
    .total .row{display:flex;justify-content:space-between;padding:6px 0;font-size:14px}
    .total .grand{margin-top:8px;padding-top:12px;border-top:2px solid #e57e5c;font-size:18px;font-weight:800;color:#e57e5c}
    .footer{text-align:center;font-size:11px;color:#999;padding-top:32px;border-top:1px solid #eee;line-height:1.8}
    @media print{body{padding:24px}}
  </style></head><body>
    <div class="head">
      <div style="display:flex;align-items:center;gap:18px">
        <img src="${window.location.origin}/logo.png" alt="${COMPANY.name}" style="width:64px;height:64px;object-fit:contain"/>
        <div>
          <h1>Facture</h1>
          <div class="num">${number}</div>
          <div style="font-size:13px;color:#666;margin-top:8px">Émise le ${date}</div>
        </div>
      </div>
      <div class="brand">
        <div class="name">${COMPANY.name}</div>
        <div class="info">${COMPANY.address}<br/>${COMPANY.phone}<br/>${COMPANY.email}<br/><strong>RCCM:</strong> ${COMPANY.rccm}<br/><strong>NINEA:</strong> ${COMPANY.ninea}</div>
      </div>
    </div>
    <div class="grid">
      <div class="block"><h3>Facturé à</h3>
        <p><strong>${order.customer_name}</strong><br/>${order.customer_phone}<br/>${order.customer_email ?? ""}<br/>${order.customer_city}</p>
      </div>
      <div class="block" style="text-align:right"><h3>Statut</h3>
        <p><strong style="text-transform:capitalize">${order.status}</strong></p>
      </div>
    </div>
    <table>
      <thead><tr><th>Description</th><th class="right">Qté</th><th class="right">PU</th><th class="right">Total</th></tr></thead>
      <tbody><tr>
        <td><strong>${order.product_name}</strong></td>
        <td class="right">${order.quantity}</td>
        <td class="right">${order.unit_price ? formatPrice(Number(order.unit_price)) : "—"}</td>
        <td class="right"><strong>${order.total_price ? formatPrice(Number(order.total_price)) : "—"}</strong></td>
      </tr></tbody>
    </table>
    <div class="total"><div class="box">
      <div class="row"><span>Sous-total</span><span>${order.total_price ? formatPrice(Number(order.total_price)) : "—"}</span></div>
      <div class="row"><span>Livraison</span><span>Gratuite</span></div>
      <div class="row grand"><span>Total TTC</span><span>${order.total_price ? formatPrice(Number(order.total_price)) : "—"}</span></div>
    </div></div>
    <div class="footer">Merci de votre confiance.<br/>${COMPANY.name} — Tricycles, motos et pièces détachées au Sénégal<br/>RCCM: ${COMPANY.rccm} • NINEA: ${COMPANY.ninea}</div>
  </body></html>`;
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 250);
  }
};

const downloadInvoicePDF = async (order: InvoiceOrder) => {
  const number = formatInvoiceNumber(order.id, order.created_at);
  const date = new Date(order.created_at).toLocaleDateString("fr-FR");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const orange: [number, number, number] = [229, 126, 92];

  // Header band
  doc.setFillColor(...orange);
  doc.rect(0, 0, pageW, 4, "F");

  // Logo top-left
  try {
    const logoData = await getLogoDataUrl();
    doc.addImage(logoData, "PNG", margin, 12, 22, 22);
  } catch (e) {
    console.warn("Logo non chargé", e);
  }

  // Title left (décalé à droite du logo)
  const titleX = margin + 28;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text("FACTURE", titleX, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...orange);
  doc.text(number, titleX, 28);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Émise le ${date}`, titleX, 34);

  // Brand right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(20);
  doc.text(COMPANY.name, pageW - margin, 20, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100);
  const brandLines = [
    COMPANY.address,
    COMPANY.phone,
    COMPANY.email,
    `RCCM: ${COMPANY.rccm}`,
    `NINEA: ${COMPANY.ninea}`,
  ];
  brandLines.forEach((l, i) => doc.text(l, pageW - margin, 26 + i * 4.5, { align: "right" }));

  // Separator
  doc.setDrawColor(...orange);
  doc.setLineWidth(0.6);
  doc.line(margin, 52, pageW - margin, 52);

  // Bill to
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("FACTURÉ À", margin, 60);
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.setFont("helvetica", "bold");
  doc.text(order.customer_name, margin, 67);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80);
  const billLines = [
    order.customer_phone,
    order.customer_email ?? "",
    order.customer_city,
  ].filter(Boolean);
  billLines.forEach((l, i) => doc.text(l, margin, 72 + i * 4.5));

  // Status right
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("STATUT", pageW - margin, 60, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text(order.status.toUpperCase(), pageW - margin, 67, { align: "right" });

  // Table
  autoTable(doc, {
    startY: 92,
    head: [["Description", "Qté", "PU", "Total"]],
    body: [[
      order.product_name,
      String(order.quantity),
      order.unit_price ? formatPrice(Number(order.unit_price)) : "—",
      order.total_price ? formatPrice(Number(order.total_price)) : "—",
    ]],
    theme: "plain",
    headStyles: { fillColor: [245, 245, 245], textColor: 100, fontSize: 9, fontStyle: "bold" },
    bodyStyles: { fontSize: 10, textColor: 30, cellPadding: 4 },
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right", fontStyle: "bold" },
    },
    margin: { left: margin, right: margin },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const total = order.total_price ? formatPrice(Number(order.total_price)) : "—";

  // Totals box
  const boxX = pageW - margin - 70;
  const boxW = 70;
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(boxX, finalY, boxW, 28, 2, 2, "F");
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.setFont("helvetica", "normal");
  doc.text("Sous-total", boxX + 4, finalY + 7);
  doc.text(total, boxX + boxW - 4, finalY + 7, { align: "right" });
  doc.text("Livraison", boxX + 4, finalY + 13);
  doc.text("Gratuite", boxX + boxW - 4, finalY + 13, { align: "right" });
  doc.setDrawColor(...orange);
  doc.line(boxX + 3, finalY + 17, boxX + boxW - 3, finalY + 17);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...orange);
  doc.text("Total TTC", boxX + 4, finalY + 24);
  doc.text(total, boxX + boxW - 4, finalY + 24, { align: "right" });

  // Footer
  const ph = doc.internal.pageSize.getHeight();
  doc.setDrawColor(230);
  doc.line(margin, ph - 25, pageW - margin, ph - 25);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(140);
  doc.text("Merci de votre confiance.", pageW / 2, ph - 19, { align: "center" });
  doc.text(`${COMPANY.name} — Tricycles, motos et pièces détachées au Sénégal`, pageW / 2, ph - 14, { align: "center" });
  doc.text(`RCCM: ${COMPANY.rccm}  •  NINEA: ${COMPANY.ninea}`, pageW / 2, ph - 9, { align: "center" });

  doc.save(`${number}.pdf`);
};

interface ManualLine {
  description: string;
  quantity: number;
  unit_price: number;
}

interface ManualInvoice {
  number: string;
  date: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_city: string;
  status: string;
  lines: ManualLine[];
  shipping: number;
  notes: string;
}

const buildManualHTML = (inv: ManualInvoice) => {
  const dateStr = new Date(inv.date).toLocaleDateString("fr-FR");
  const subtotal = inv.lines.reduce((s, l) => s + l.quantity * l.unit_price, 0);
  const total = subtotal + (inv.shipping || 0);
  const rows = inv.lines.map((l) => `
    <tr>
      <td><strong>${l.description}</strong></td>
      <td class="right">${l.quantity}</td>
      <td class="right">${formatPrice(l.unit_price)}</td>
      <td class="right"><strong>${formatPrice(l.quantity * l.unit_price)}</strong></td>
    </tr>`).join("");
  return `<!doctype html><html><head><meta charset="utf-8"/><title>${inv.number}</title><style>
    *{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif}
    body{padding:48px;color:#0a0a0a;background:#fff}
    .head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:48px;padding-bottom:24px;border-bottom:2px solid #e57e5c}
    h1{font-size:14px;color:#666;text-transform:uppercase;letter-spacing:.2em;margin-bottom:8px}
    .num{font-size:32px;font-weight:800;color:#e57e5c}
    .brand{text-align:right}
    .brand .name{font-size:24px;font-weight:800}
    .brand .info{font-size:12px;color:#666;margin-top:4px;line-height:1.6}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:48px}
    .block h3{font-size:11px;color:#999;text-transform:uppercase;letter-spacing:.15em;margin-bottom:8px}
    .block p{font-size:14px;line-height:1.6}
    table{width:100%;border-collapse:collapse;margin-bottom:32px}
    th{background:#f5f5f5;padding:12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#666}
    td{padding:16px 12px;border-bottom:1px solid #eee;font-size:14px}
    .right{text-align:right}
    .total{display:flex;justify-content:flex-end;margin-bottom:32px}
    .total .box{width:300px;background:#fafafa;padding:24px;border-radius:12px}
    .total .row{display:flex;justify-content:space-between;padding:6px 0;font-size:14px}
    .total .grand{margin-top:8px;padding-top:12px;border-top:2px solid #e57e5c;font-size:18px;font-weight:800;color:#e57e5c}
    .notes{font-size:12px;color:#666;background:#fafafa;padding:16px;border-radius:8px;margin-bottom:24px;line-height:1.6}
    .footer{text-align:center;font-size:11px;color:#999;padding-top:32px;border-top:1px solid #eee;line-height:1.8}
    @media print{body{padding:24px}}
  </style></head><body>
    <div class="head">
      <div style="display:flex;align-items:center;gap:18px">
        <img src="${window.location.origin}/logo.png" alt="${COMPANY.name}" style="width:64px;height:64px;object-fit:contain"/>
        <div>
          <h1>Facture</h1>
          <div class="num">${inv.number}</div>
          <div style="font-size:13px;color:#666;margin-top:8px">Émise le ${dateStr}</div>
        </div>
      </div>
      <div class="brand">
        <div class="name">${COMPANY.name}</div>
        <div class="info">${COMPANY.address}<br/>${COMPANY.phone}<br/>${COMPANY.email}<br/><strong>RCCM:</strong> ${COMPANY.rccm}<br/><strong>NINEA:</strong> ${COMPANY.ninea}</div>
      </div>
    </div>
    <div class="grid">
      <div class="block"><h3>Facturé à</h3>
        <p><strong>${inv.customer_name || "—"}</strong><br/>${inv.customer_phone || ""}<br/>${inv.customer_email || ""}<br/>${inv.customer_city || ""}</p>
      </div>
      <div class="block" style="text-align:right"><h3>Statut</h3>
        <p><strong style="text-transform:capitalize">${inv.status}</strong></p>
      </div>
    </div>
    <table>
      <thead><tr><th>Description</th><th class="right">Qté</th><th class="right">PU</th><th class="right">Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="total"><div class="box">
      <div class="row"><span>Sous-total</span><span>${formatPrice(subtotal)}</span></div>
      <div class="row"><span>Livraison</span><span>${inv.shipping > 0 ? formatPrice(inv.shipping) : "Gratuite"}</span></div>
      <div class="row grand"><span>Total TTC</span><span>${formatPrice(total)}</span></div>
    </div></div>
    ${inv.notes ? `<div class="notes"><strong>Notes :</strong> ${inv.notes.replace(/</g, "&lt;")}</div>` : ""}
    <div class="footer">Merci de votre confiance.<br/>${COMPANY.name} — Tricycles, motos et pièces détachées au Sénégal<br/>RCCM: ${COMPANY.rccm} • NINEA: ${COMPANY.ninea}</div>
  </body></html>`;
};

const printManualInvoice = (inv: ManualInvoice) => {
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(buildManualHTML(inv));
    w.document.close();
    setTimeout(() => w.print(), 250);
  }
};

const downloadManualPDF = async (inv: ManualInvoice) => {
  const dateStr = new Date(inv.date).toLocaleDateString("fr-FR");
  const subtotal = inv.lines.reduce((s, l) => s + l.quantity * l.unit_price, 0);
  const total = subtotal + (inv.shipping || 0);
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const orange: [number, number, number] = [229, 126, 92];

  doc.setFillColor(...orange);
  doc.rect(0, 0, pageW, 4, "F");

  try {
    const logoData = await getLogoDataUrl();
    doc.addImage(logoData, "PNG", margin, 12, 22, 22);
  } catch (e) {
    console.warn("Logo non chargé", e);
  }

  const titleX = margin + 28;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text("FACTURE", titleX, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...orange);
  doc.text(inv.number, titleX, 28);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Émise le ${dateStr}`, titleX, 34);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(20);
  doc.text(COMPANY.name, pageW - margin, 20, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100);
  [COMPANY.address, COMPANY.phone, COMPANY.email, `RCCM: ${COMPANY.rccm}`, `NINEA: ${COMPANY.ninea}`]
    .forEach((l, i) => doc.text(l, pageW - margin, 26 + i * 4.5, { align: "right" }));

  doc.setDrawColor(...orange);
  doc.setLineWidth(0.6);
  doc.line(margin, 52, pageW - margin, 52);

  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("FACTURÉ À", margin, 60);
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.setFont("helvetica", "bold");
  doc.text(inv.customer_name || "—", margin, 67);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80);
  [inv.customer_phone, inv.customer_email, inv.customer_city].filter(Boolean)
    .forEach((l, i) => doc.text(l, margin, 72 + i * 4.5));

  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("STATUT", pageW - margin, 60, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text(inv.status.toUpperCase(), pageW - margin, 67, { align: "right" });

  const safe = (n: number) => formatPrice(Number.isFinite(n) ? n : 0);

  autoTable(doc, {
    startY: 92,
    head: [["Description", "Qté", "PU", "Total"]],
    body: inv.lines.map((l) => [
      l.description,
      String(l.quantity),
      safe(l.unit_price),
      safe(l.quantity * l.unit_price),
    ]),
    theme: "plain",
    headStyles: { fillColor: [245, 245, 245], textColor: 100, fontSize: 9, fontStyle: "bold" },
    bodyStyles: { fontSize: 10, textColor: 30, cellPadding: 4, overflow: "linebreak" },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { halign: "right", cellWidth: 18 },
      2: { halign: "right", cellWidth: 38 },
      3: { halign: "right", fontStyle: "bold", cellWidth: 38 },
    },
    margin: { left: margin, right: margin },
    tableWidth: pageW - margin * 2,
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const boxW = 90;
  const boxX = pageW - margin - boxW;
  const boxH = 32;
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(boxX, finalY, boxW, boxH, 2, 2, "F");
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.setFont("helvetica", "normal");
  doc.text("Sous-total", boxX + 5, finalY + 8);
  doc.text(safe(subtotal), boxX + boxW - 5, finalY + 8, { align: "right" });
  doc.text("Livraison", boxX + 5, finalY + 14);
  doc.text(inv.shipping > 0 ? safe(inv.shipping) : "Gratuite", boxX + boxW - 5, finalY + 14, { align: "right" });
  doc.setDrawColor(...orange);
  doc.line(boxX + 4, finalY + 19, boxX + boxW - 4, finalY + 19);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...orange);
  doc.text("Total TTC", boxX + 5, finalY + 27);
  doc.text(safe(total), boxX + boxW - 5, finalY + 27, { align: "right" });

  if (inv.notes) {
    const notesY = finalY + 34;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80);
    const lines = doc.splitTextToSize(`Notes : ${inv.notes}`, pageW - margin * 2);
    doc.text(lines, margin, notesY);
  }

  const ph = doc.internal.pageSize.getHeight();
  doc.setDrawColor(230);
  doc.line(margin, ph - 25, pageW - margin, ph - 25);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(140);
  doc.text("Merci de votre confiance.", pageW / 2, ph - 19, { align: "center" });
  doc.text(`${COMPANY.name} — Tricycles, motos et pièces détachées au Sénégal`, pageW / 2, ph - 14, { align: "center" });
  doc.text(`RCCM: ${COMPANY.rccm}  •  NINEA: ${COMPANY.ninea}`, pageW / 2, ph - 9, { align: "center" });

  doc.save(`${inv.number}.pdf`);
};

const generateManualNumber = () => {
  const d = new Date();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `FAC-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}-${rand}`;
};

const AdminInvoices = () => {
  const [orders, setOrders] = useState<InvoiceOrder[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Manual invoice creation
  const [manualOpen, setManualOpen] = useState(false);
  const [manual, setManual] = useState<ManualInvoice>(() => ({
    number: generateManualNumber(),
    date: new Date().toISOString().slice(0, 10),
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    customer_city: "",
    status: "pending",
    lines: [{ description: "", quantity: 1, unit_price: 0 }],
    shipping: 0,
    notes: "",
  }));

  const manualSubtotal = useMemo(
    () => manual.lines.reduce((s, l) => s + (l.quantity || 0) * (l.unit_price || 0), 0),
    [manual.lines],
  );
  const manualTotal = manualSubtotal + (manual.shipping || 0);

  const resetManual = () => setManual({
    number: generateManualNumber(),
    date: new Date().toISOString().slice(0, 10),
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    customer_city: "",
    status: "pending",
    lines: [{ description: "", quantity: 1, unit_price: 0 }],
    shipping: 0,
    notes: "",
  });

  const updateLine = (idx: number, patch: Partial<ManualLine>) =>
    setManual((m) => ({ ...m, lines: m.lines.map((l, i) => (i === idx ? { ...l, ...patch } : l)) }));
  const addLine = () =>
    setManual((m) => ({ ...m, lines: [...m.lines, { description: "", quantity: 1, unit_price: 0 }] }));
  const removeLine = (idx: number) =>
    setManual((m) => ({ ...m, lines: m.lines.length > 1 ? m.lines.filter((_, i) => i !== idx) : m.lines }));

  const validateManual = (): string | null => {
    if (!manual.customer_name.trim()) return "Le nom du client est requis.";
    if (!manual.lines.length) return "Ajoutez au moins une ligne.";
    for (const [i, l] of manual.lines.entries()) {
      if (!l.description.trim()) return `Ligne ${i + 1} : description manquante.`;
      if (l.quantity <= 0) return `Ligne ${i + 1} : quantité invalide.`;
      if (l.unit_price < 0) return `Ligne ${i + 1} : prix invalide.`;
    }
    return null;
  };

  const handleManualGenerate = async (mode: "pdf" | "print") => {
    const err = validateManual();
    if (err) {
      toast({ title: "Validation", description: err, variant: "destructive" });
      return;
    }
    if (mode === "pdf") await downloadManualPDF(manual);
    else printManualInvoice(manual);
    toast({ title: "Facture générée", description: `${manual.number} créée avec succès.` });
  };


  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, customer_name, customer_email, customer_phone, customer_city, product_name, quantity, unit_price, total_price, status, created_at")
        .order("created_at", { ascending: false });
      setOrders((data as InvoiceOrder[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.customer_name.toLowerCase().includes(q) ||
      o.product_name.toLowerCase().includes(q) ||
      formatInvoiceNumber(o.id, o.created_at).toLowerCase().includes(q)
    );
  });

  const totalAmount = filtered
    .filter((o) => o.status !== "cancelled" && o.status !== "pending")
    .reduce((sum, o) => sum + Number(o.total_price ?? 0), 0);

  const exportCSV = () => {
    const rows = [
      ["Facture", "Date", "Client", "Téléphone", "Produit", "Qté", "Total", "Statut"],
      ...filtered.map((o) => [
        formatInvoiceNumber(o.id, o.created_at),
        new Date(o.created_at).toLocaleDateString("fr-FR"),
        o.customer_name,
        o.customer_phone,
        o.product_name,
        o.quantity.toString(),
        o.total_price?.toString() ?? "",
        o.status,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `factures-hasilaza-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Facturation</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Factures</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Historique complet et impression PDF de toutes les factures.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => { resetManual(); setManualOpen(true); }}
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle facture
          </Button>
          <Button onClick={exportCSV} variant="outline" className="rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-3xl p-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Factures</p>
          <p className="font-display text-2xl font-bold mt-2">{filtered.length}</p>
        </div>
        <div className="bg-card border border-border rounded-3xl p-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Montant facturé</p>
          <p className="font-display text-2xl font-bold mt-2 text-primary">{formatPrice(totalAmount)}</p>
        </div>
        <div className="bg-card border border-border rounded-3xl p-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Période</p>
          <p className="font-display text-2xl font-bold mt-2">
            {orders.length > 0
              ? new Date(orders[orders.length - 1].created_at).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })
              : "—"}{" "}
            →{" "}
            {orders.length > 0
              ? new Date(orders[0].created_at).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })
              : "—"}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher (client, produit, n° facture)..."
          className="pl-11 h-11 rounded-xl"
        />
      </div>

      {/* List */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground text-sm">Aucune facture trouvée.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((o) => (
              <div
                key={o.id}
                className="flex flex-col md:flex-row md:items-center gap-4 p-5 hover:bg-muted/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1 grid md:grid-cols-3 gap-2 md:gap-6 items-center">
                  <div className="min-w-0">
                    <p className="font-display font-bold text-sm">{formatInvoiceNumber(o.id, o.created_at)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{o.customer_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{o.product_name} × {o.quantity}</p>
                  </div>
                  <div className="flex items-center gap-3 md:justify-end">
                    <div className="text-right">
                      <p className="font-display font-bold">{o.total_price ? formatPrice(Number(o.total_price)) : "—"}</p>
                      <Badge variant="outline" className={`${statusColor[o.status]} mt-1 text-[10px] border rounded-full`}>
                        {o.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => downloadInvoicePDF(o)}
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => printInvoice(o)}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual invoice dialog */}
      <Dialog open={manualOpen} onOpenChange={setManualOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Nouvelle facture manuelle</DialogTitle>
            <DialogDescription>
              Saisissez les informations puis téléchargez le PDF ou imprimez directement.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* Meta */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">N° Facture</Label>
                <Input
                  value={manual.number}
                  onChange={(e) => setManual({ ...manual, number: e.target.value })}
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Date</Label>
                <Input
                  type="date"
                  value={manual.date}
                  onChange={(e) => setManual({ ...manual, date: e.target.value })}
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Statut</Label>
                <select
                  value={manual.status}
                  onChange={(e) => setManual({ ...manual, status: e.target.value })}
                  className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
                >
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="processing">En traitement</option>
                  <option value="shipped">Expédiée</option>
                  <option value="delivered">Livrée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>
            </div>

            {/* Customer */}
            <div>
              <h3 className="font-display font-bold text-sm mb-3 uppercase tracking-wider text-muted-foreground">Client</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <Input
                  placeholder="Nom complet *"
                  value={manual.customer_name}
                  onChange={(e) => setManual({ ...manual, customer_name: e.target.value })}
                  className="rounded-xl"
                />
                <Input
                  placeholder="Téléphone"
                  value={manual.customer_phone}
                  onChange={(e) => setManual({ ...manual, customer_phone: e.target.value })}
                  className="rounded-xl"
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={manual.customer_email}
                  onChange={(e) => setManual({ ...manual, customer_email: e.target.value })}
                  className="rounded-xl"
                />
                <Input
                  placeholder="Ville / Adresse"
                  value={manual.customer_city}
                  onChange={(e) => setManual({ ...manual, customer_city: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>

            {/* Lines */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground">Articles</h3>
                <Button type="button" size="sm" variant="outline" className="rounded-xl" onClick={addLine}>
                  <Plus className="w-4 h-4 mr-1" />
                  Ligne
                </Button>
              </div>
              <div className="space-y-2">
                {manual.lines.map((l, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-start">
                    <Input
                      placeholder="Description *"
                      value={l.description}
                      onChange={(e) => updateLine(i, { description: e.target.value })}
                      className="col-span-6 rounded-xl"
                    />
                    <Input
                      type="number"
                      min="1"
                      placeholder="Qté"
                      value={l.quantity}
                      onChange={(e) => updateLine(i, { quantity: Number(e.target.value) || 0 })}
                      className="col-span-2 rounded-xl"
                    />
                    <Input
                      type="number"
                      min="0"
                      placeholder="Prix unitaire"
                      value={l.unit_price}
                      onChange={(e) => updateLine(i, { unit_price: Number(e.target.value) || 0 })}
                      className="col-span-3 rounded-xl"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="col-span-1 rounded-xl text-destructive hover:bg-destructive/10"
                      onClick={() => removeLine(i)}
                      disabled={manual.lines.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & notes */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Livraison (FCFA)</Label>
                <Input
                  type="number"
                  min="0"
                  value={manual.shipping}
                  onChange={(e) => setManual({ ...manual, shipping: Number(e.target.value) || 0 })}
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Notes (optionnel)</Label>
                <Input
                  value={manual.notes}
                  onChange={(e) => setManual({ ...manual, notes: e.target.value })}
                  placeholder="Remarques, conditions..."
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>

            {/* Totals preview */}
            <div className="bg-muted/40 rounded-2xl p-4 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span>{formatPrice(manualSubtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span>{manual.shipping > 0 ? formatPrice(manual.shipping) : "Gratuite"}</span></div>
              <div className="flex justify-between pt-2 border-t border-border font-display font-bold text-base text-primary"><span>Total TTC</span><span>{formatPrice(manualTotal)}</span></div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setManualOpen(false)}>
              Annuler
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={() => handleManualGenerate("print")}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
            <Button className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleManualGenerate("pdf")}>
              <FileDown className="w-4 h-4 mr-2" />
              Télécharger PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInvoices;
