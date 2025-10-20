// app/redirector/page.js
import { redirect } from 'next/navigation';

export default function Page({ searchParams }) {
  redirect(`http://localhost:7777/index.php?module=IFE_Report&action=index&record=e5066d95-55fa-08fb-9ffb-61fe4eb7a95d&name=Agendamentos&type=tasks&qrcode=c`);
}
