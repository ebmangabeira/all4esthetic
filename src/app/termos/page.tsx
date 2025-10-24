import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
	title: "Termos de Uso | all4esthetic",
	description:
		"Condições de utilização do site all4esthetic (Portugal). Conheça seus direitos e obrigações ao utilizar o nosso website.",
	robots: { index: true, follow: true },
	alternates: { canonical: "/termos" },
	openGraph: {
		title: "Termos de Uso | all4esthetic",
		description: "Condições de utilização do site all4esthetic (Portugal).",
		type: "article",
		url: "/termos",
		siteName: "all4esthetic",
	},
	twitter: {
		card: "summary",
		title: "Termos de Uso | all4esthetic",
		description: "Condições de utilização do site all4esthetic (Portugal).",
	},
};

export default function TermosDeUsoPage() {
	return (
		<>
			<Header />

			<main id="main" className="privacy-page">
				<CookieBanner />

				<section>
					<div className="container">
						<div className="pp-card">
							<h1 className="mb-4">Termos de Uso</h1>
							<p className="text-muted pp-meta">
								<em>Última revisão: 07 de Agosto de 2025</em>
							</p>

							<h2>1. Aceitação dos Termos</h2>
							<p>
								Ao acessar e utilizar este website, você concorda em cumprir
								estes Termos de Uso e todas as leis aplicáveis. Caso não
								concorde com algum destes termos, por favor não utilize o site.
							</p>

							<h2>2. Uso do Website</h2>
							<p>
								Este site destina-se a fins informativos e comerciais
								relacionados a equipamentos estéticos. Você concorda em
								utilizá-lo apenas para propósitos legais e de forma que não
								infrinja os direitos de terceiros.
							</p>

							<h2>3. Propriedade Intelectual</h2>
							<p>
								Todos os conteúdos, imagens, textos, logos e demais materiais
								são de propriedade da all4esthetic ou de seus licenciadores,
								estando protegidos pelas leis de propriedade intelectual.
							</p>

							<h2>4. Limitação de Responsabilidade</h2>
							<p>
								A all4esthetic não se responsabiliza por quaisquer danos
								diretos ou indiretos decorrentes do uso ou impossibilidade de
								uso do site, incluindo a precisão das informações fornecidas.
							</p>

							<h2>5. Modificações nos Termos</h2>
							<p>
								Reservamo-nos o direito de alterar estes Termos de Uso a
								qualquer momento, sendo recomendada a consulta periódica desta
								página para verificar atualizações.
							</p>

							<h2>6. Privacidade</h2>
							<p>
								Para informações sobre coleta e uso de dados pessoais, consulte
								a nossa{" "}
								<Link href="/politica-privacidade" className="termos">
									Política de Privacidade
								</Link>
								.
							</p>

							<h2>7. Lei Aplicável</h2>
							<p>
								Estes Termos de Uso são regidos pelas leis vigentes em Portugal.
								Quaisquer disputas serão decididas nos tribunais competentes de
								Lisboa.
							</p>

							<h2>8. Contato</h2>
							<p>
								Em caso de dúvidas ou sugestões sobre estes Termos de Uso, entre
								em contato pelo email{" "}
								<a href="mailto:geral@all4esthetic.com" className="termos">
									geral@all4esthetic.com
								</a>
								.
							</p>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</>
	);
}
