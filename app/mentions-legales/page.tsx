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
        </div>
      </div>
    </div>
  );
}
