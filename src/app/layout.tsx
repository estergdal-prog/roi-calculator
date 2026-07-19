import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "מחשבון ROI לשיווק דיגיטלי",
  description:
    "השוו בין ה-ROI, ה-ROAS וה-CPA של ערוצי השיווק שלכם זה לצד זה. מחשבון נקי ומקצועי, מוכן להצגה בפני לקוחות.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
