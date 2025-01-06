import { BaseTemplate } from '@/templates/BaseTemplate';

export default function Layout({
  children,
  params, // ✅ Get params to extract locale
}: {
  children: React.ReactNode;
  params: { locale: string }; // ✅ Ensure locale is available
}) {
  return (
    <BaseTemplate locale={params.locale}>
      {children}
    </BaseTemplate>
  );
}
