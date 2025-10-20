// app/redirector/page.js
import { redirect } from 'next/navigation';

export default function Page({ searchParams }) {
  const c = searchParams?.c;

  if (!c) {
    return <p>Missing query parameter "c".</p>; // simple fallback
  }

  redirect(
    `http://localhost:7777/index.php?module=IFE_Report&action=index&record=e5066d95-55fa-08fb-9ffb-61fe4eb7a95d&name=Agendamentos&type=tasks&qrcode=${encodeURIComponent(c)}`
  );
}
