import { eq } from 'drizzle-orm';
import { getTranslations } from 'next-intl/server';

import { db } from '@/libs/DB';
import { servicesSchema } from '@/models/Schema';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Welcome',
  });

  return {
    title: t('choose_a_date'),
  };
}

export default async function NewServiceServer(context: { params: { id: string } }) {
  const { id } = context.params;

  // Ensure `id` is parsed correctly
  const singleService = await db
    .select()
    .from(servicesSchema)
    .where(eq(servicesSchema.id, Number.parseInt(id, 10)))
    .limit(1);

  if (singleService.length === 0) {
    // Handle not found
    return <div>Service not found</div>;
  }

  // return <ChooseADate service={singleService[0]} />;

  return 'ChooseDate component';
}
