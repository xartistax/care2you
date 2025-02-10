import { BaseTemplateAlt } from '@/templates/BaseTemplateAlt';

export default function Layout({
  children, // ✅ Get params to extract locale
}: {
  children: React.ReactNode; // ✅ Ensure locale is available
}) {
  return (
    <BaseTemplateAlt>
      {children}
    </BaseTemplateAlt>
  );
}
