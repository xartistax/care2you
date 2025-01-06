import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

export default function ProfileImage(props: { params: { username: string } }) {
  const { user } = useUser();

  if (!user) {
    return <div>Image Loading...</div>;
  }

  return (<Image width={50} height={50} src={user.imageUrl} alt={props.params.username} />);
}
