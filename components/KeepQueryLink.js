import Link from 'next/link';
import { useRouter } from 'next/router';

export default function KeepQueryLink(props) {
  const { query } = useRouter();
  return <Link href={{ pathname: props.href, query }}>{props.children}</Link>;
}
