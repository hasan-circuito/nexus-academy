import { redirect } from 'next/navigation';

interface Props { params: Promise<{ missionId: string }> }

export default async function MissionPage({ params }: Props) {
  const { missionId } = await params;
  redirect(`/mission/${missionId}/step/0`);
}
