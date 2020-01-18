import Link from 'next/link';
import { useRouter } from 'next/router';

export default function KeepQueryLink({ href, children }) {
  const { query } = useRouter();
  return <Link href={{ pathname: href, query }}>{children}</Link>;
}
