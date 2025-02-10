import Footer from '@/components/footer/Footer';

export async function BaseTemplateAlt({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full px-1 text-gray-700 antialiased">
      <div className="mx-auto max-w-screen-xl">
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
