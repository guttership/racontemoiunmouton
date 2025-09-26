import Link from 'next/link';

export default function MentionsLegales() {
  return (
    <div
      itemScope
      itemType="https://schema.org/WebPage"
      className="min-h-screen bg-white flex flex-col items-center justify-center p-6"
    >
      <div className="max-w-2xl w-full bg-gray-50 rounded-2xl shadow-md p-8 border border-gray-200">
        <h1 className="text-3xl font-courgette text-[#ff7519] mb-6 text-center">
          Mentions légales
        </h1>
        <img
          src="/logo_mouton.svg"
          alt="Logo Raconte-moi un mouton, application d'histoires créatives pour enfants"
          width={60}
          height={60}
          className="mx-auto mb-4"
        />
        <div className="prose prose-lg text-gray-800">
          <h2 className="font-semibold text-xl mb-2">Éditeur du site</h2>
          <p>
            <strong>Auteur :</strong> Yann Gutter
            <br />
            <strong>Adresse :</strong> 16 rue Dietterlin, 67100 Strasbourg
            <br />
            <strong>Site web :</strong>{' '}
            <a
              href="https://dmum.eu"
              target="_blank"
              rel="noopener"
              className="text-[#ff7519] underline"
            >
              dmum.eu
            </a>
          </p>
          <h2 className="font-semibold text-xl mt-6 mb-2">Hébergement</h2>
          <p>
            Ce site est hébergé par Vercel.
          </p>
          <h2 className="font-semibold text-xl mt-6 mb-2">Propriété intellectuelle</h2>
          <p>
            Tous les contenus présents sur ce site sont protégés par le droit d&apos;auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable.
          </p>
          <h2 className="font-semibold text-xl mt-6 mb-2">Contact</h2>
          <p>
            Pour toute question, vous pouvez contacter l&apos;auteur via{' '}
            <a
              href="https://www.linkedin.com/in/yann-gutter-9192337a/"
              target="_blank"
              rel="noopener"
              className="text-[#ff7519] underline"
            >
              LinkedIn
            </a>{' '}
            ou{' '}
            <a
              href="https://www.facebook.com/profile.php?id=61571889646567"
              target="_blank"
              rel="noopener"
              className="text-[#ff7519] underline"
            >
              Facebook
            </a>
            .
          </p>
          <h2 className="font-semibold text-xl mt-6 mb-2">Politique de confidentialité et RGPD</h2>
          <p>
            Ce site respecte la vie privée des utilisateurs. Les données personnelles éventuellement collectées (nom, email, préférences d’histoire) ne sont utilisées que pour le fonctionnement du service et ne sont jamais transmises à des tiers. Conformément au RGPD, vous pouvez demander la suppression ou la rectification de vos données en contactant l’éditeur.
          </p>
          <h2 className="font-semibold text-xl mt-6 mb-2">Utilisation des cookies</h2>
          <p>
            Ce site utilise des cookies techniques nécessaires à son fonctionnement (session, préférences). Aucun cookie publicitaire ou de suivi n’est utilisé. Vous pouvez configurer votre navigateur pour bloquer les cookies, mais certaines fonctionnalités pourraient ne plus fonctionner correctement.
          </p>
          <h2 className="font-semibold text-xl mt-6 mb-2">Conditions d’utilisation</h2>
          <p>
            L’utilisation du site implique l’acceptation des présentes mentions légales. L’éditeur se réserve le droit de modifier le contenu du site ou les conditions d’utilisation à tout moment. L’utilisateur s’engage à ne pas publier de contenu illicite ou contraire à la loi.
          </p>
        </div>
      </div>
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-block px-5 py-2 rounded-xl bg-[#ff7519] text-white font-medium shadow hover:bg-orange-600 transition"
        >
          &larr; Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
