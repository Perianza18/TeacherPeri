import { motion } from 'framer-motion'
import { MeshGradient } from '@paper-design/shaders-react'
import Navbar from '../components/Navbar'
import { fadeUp } from '../components/motion/variants'

// Página 5/8: Estudia en el Extranjero. Contenido EXACTO pedido — guía
// larga, transcrita completa. Estructura: h2 = título, h3 = las 6
// secciones numeradas, h4 = subsecciones con letra/emoji, ul/li = listas,
// strong = énfasis en negritas — pedido explícitamente en la lógica de
// la página ("clear headings, bold text for emphasis, distinct sections").
// Un par de bloques que en el texto original venían como una sola oración
// larga con varios conceptos encadenados (los de becas en EE. UU./Canadá,
// y los dos enfoques de universidades) se partieron en sub-listas para
// que se lean mejor — sin cambiar ni una palabra del contenido.

function H3({ children }) {
  return <h2 className="font-display mt-12 text-2xl text-brand-900 first:mt-0">{children}</h2>
}

function H4({ children }) {
  return <h3 className="mt-6 text-lg font-semibold text-brand-900">{children}</h3>
}

function P({ children }) {
  return <p className="mt-3 text-brand-700">{children}</p>
}

function UL({ children }) {
  return <ul className="mt-3 flex flex-col gap-2 pl-5 text-brand-700 marker:text-[#B70B0D]">{children}</ul>
}

export default function EstudiaExtranjeroPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-[#120303] px-4 py-24 text-center sm:px-6">
          <div className="pointer-events-none absolute inset-0">
            <MeshGradient
              className="absolute inset-0 h-full w-full"
              colors={['#B70B0D', '#E57505', '#FFB401', '#120303']}
              speed={0.22}
              distortion={0.7}
              swirl={0.25}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#120303]/75 via-[#120303]/40 to-[#120303]/85" />
          </div>
          <motion.h1
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="font-display relative text-3xl text-white sm:text-4xl"
          >
            🎓 Estudia en el Extranjero siendo Olímpico
          </motion.h1>
        </section>

        {/* initial/animate (dispara una sola vez al montar), NO whileInView:
            revealProps espera que el 25% del elemento esté visible a la vez
            para aparecer, pero este artículo es muchísimas pantallas más
            alto que eso — ese 25% casi nunca se cumple con un scroll normal,
            así que el contenido se quedaba invisible la mayor parte del
            tiempo. Un artículo largo no necesita una animación de scroll
            -reveal de todos modos: solo tiene que aparecer al cargar. */}
        <motion.article
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mx-auto max-w-3xl px-4 py-16 sm:px-6"
        >
          <P>
            ¡Holaaa! Si estás aquí es porque seguro te has preguntado: "¿Mi esfuerzo en la
            olimpiada me puede abrir puertas en universidades de Estados Unidos o Canadá?". La
            respuesta corta es: ¡SÍ, Y BASTANTE! 🚀
          </P>
          <P>
            A continuación te explicamos exactamente cómo funciona el proceso, cómo sacarle el
            máximo jugo a tu perfil y los mejores tips para que no te agarren las carreras.
          </P>

          <H3>1. ¿Cómo ven las universidades tu trayectoria olímpica? (EE. UU. y Canadá)</H3>
          <P>
            Tanto en Estados Unidos como en Canadá, ser olímpico te posiciona en un grupo muy
            selecto. Sin embargo, cada país (y cada universidad) tiene su propio lente para
            evaluarte:
          </P>
          <UL>
            <li>
              <strong className="text-brand-900">El enfoque holístico (EE. UU. y Becas de Élite en Canadá):</strong>{' '}
              Las universidades de EE. UU. (MIT, Harvard, Stanford, Princeton) y convocatorias de
              máximo prestigio en Canadá (como la Beca Lester B. Pearson de la Universidad de
              Toronto) evalúan a la persona completa. No solo buscan promedios de 10 o puntajes
              perfectos; buscan pasión, resiliencia, liderazgo e impacto en la comunidad. Haber
              competido en la OMM, EGMO, PAGMO o IMO es visto como una actividad extracurricular
              de altísimo impacto (Tier 1 / Tier 2), pues demuestra que sabes resolver problemas
              complejos y lidiar con la frustración.
            </li>
            <li>
              <strong className="text-brand-900">El enfoque académico directo (Canadá en general):</strong>{' '}
              Para la admisión general en la mayoría de las universidades canadienses (como la
              Universidad de Waterloo, UBC o U of T sin beca de liderazgo), el proceso es mucho
              más académico y cuantitativo. Universidades como Waterloo aman a los olímpicos de
              matemáticas y computación, dando un peso gigante a tus promedios escolares y a tus
              posiciones en concursos oficiales (como el examen Euclid).
            </li>
          </UL>

          <H3>2. El súper poder de un Passion Project 💡</H3>
          <P>
            Participar en olimpiadas es genial, pero combinar tu talento matemático/técnico con
            un proyecto personal de impacto social es lo que realmente te vuelve un candidato
            irresistible. Un Passion Project es un proyecto propio nacido de lo que te apasiona.
            Si tu meta es estudiar Computer Science o alguna ingeniería, no te limites a resolver
            problemas en un papel: busca cómo usar la tecnología para resolver un problema de tu
            entorno (crear una app para tu comunidad, coordinar un taller gratuito de
            programación para niños de tu zona, desarrollar un juego educativo, etc.).
          </P>
          <div className="mt-4 rounded-xl border border-[#E57505]/30 bg-[#FFF3E2] p-4 text-brand-800">
            <strong>⚡ El secreto mejor guardado:</strong> ¡Empieza desde 3.º de secundaria!
            Comenzar a explorar e implementar proyectos a esta edad te da un margen increíble de
            2 a 3 años para probar ideas, equivocarte, mejorar y, sobre todo, mostrar un impacto
            real y sostenido a largo plazo cuando llegue el momento de aplicar en preparatoria.
          </div>

          <H3>3. Exámenes Estandarizados</H3>
          <H4>A. Examen de Dominio de Inglés (Obligatorio)</H4>
          <P>Debes demostrar que puedes tomar clases e investigar en inglés. Tienes tres opciones principales:</P>
          <UL>
            <li><strong className="text-brand-900">TOEFL iBT:</strong> El examen académico tradicional.</li>
            <li><strong className="text-brand-900">IELTS Academic:</strong> Ampliamente aceptado en Canadá, EE. UU. y Europa.</li>
            <li>
              <strong className="text-brand-900">Duolingo English Test (DET):</strong> Cada vez
              más universidades lo aceptan. Es la opción más accesible, económica y la puedes
              realizar 100% desde tu computadora en casa.
            </li>
          </UL>

          <H4>B. SAT o ACT (Para EE. UU.)</H4>
          <UL>
            <li><strong className="text-brand-900">El SAT Digital:</strong> Evalúa Lectura/Escritura y Matemáticas.</li>
            <li>
              Como olímpico, la sección de Matemáticas te parecerá muy accesible, pero ¡no te
              confíes! La clave está en practicar la velocidad de lectura en inglés y no cometer
              errores por desatención.
            </li>
            <li>
              Muchas universidades mantienen políticas Test-Optional, pero si logras un puntaje
              sobresaliente en Matemáticas (780-800), ¡enviarlo reforzará enormemente tu perfil!
            </li>
          </UL>

          <H3>4. Componentes clave de tu Solicitud</H3>
          <P>No basta con poner "fui a la Olimpiada Nacional". Tienes que saber contar tu historia:</P>
          <UL>
            <li>
              <strong className="text-brand-900">Ensayos (Personal Statement):</strong> No
              escribas un ensayo presuntuoso contando solo tus medallas. A las universidades les
              interesa saber quién eres gracias a las experiencias de tu vida. Habla de la
              comunidad que encontraste, de la primera vez que un problema te venció por semanas
              y cómo aprendiste a no rendirte, o de cómo disfrutas entrenar a los más pequeños de
              tu estado.
            </li>
            <li>
              <strong className="text-brand-900">Cartas de Recomendación:</strong> Generalmente
              te pedirán 2 profesores de tu escuela (por ejemplo, uno de Ciencias/Math y uno de
              Humanidades) y 1 recomendador opcional. Una carta de tu delegado o entrenador de
              olimpiadas explicando el nivel de exigencia del concurso y tu dedicación tiene un
              peso enorme.
            </li>
            <li>
              <strong className="text-brand-900">Lista de Actividades (Common App):</strong>{' '}
              Tienes espacio para 10 actividades. Detalla tus horas de entrenamiento, si fuiste
              asesor/asesora, tus proyectos personales y tus logros por nivel (Estatal, Nacional,
              Internacional).
            </li>
          </UL>

          <H3>5. Becas y Ayuda Financiera para Internacionales</H3>
          <P>¡Que el costo no te asuste! Hay formas reales de estudiar becado:</P>
          <P><strong className="text-brand-900">En Estados Unidos:</strong></P>
          <UL>
            <li>
              <strong className="text-brand-900">Universidades Need-Blind para Internacionales</strong>{' '}
              (Harvard, MIT, Princeton, Yale, Amherst, Bowdoin y Dartmouth). Evalúan tu solicitud
              sin importar la capacidad económica de tu familia. Si te aceptan, cubren el 100% de
              tu necesidad financiera demostrada.
            </li>
            <li>
              <strong className="text-brand-900">Universidades Need-Aware:</strong> Consideran si
              pides beca al momento de admitirte, pero si tu perfil brilla, otorgan becas muy
              generosas.
            </li>
          </UL>
          <P><strong className="text-brand-900">En Canadá:</strong></P>
          <UL>
            <li>
              <strong className="text-brand-900">Lester B. Pearson International Scholarship (U of T):</strong>{' '}
              Cubre 4 años de matrícula, libros, alojamiento e incidentales.
            </li>
            <li>
              <strong className="text-brand-900">Karen McKellin International Leader of Tomorrow (UBC):</strong>{' '}
              Beca basada en necesidad financiera, rendimiento académico y liderazgo.
            </li>
            <li>
              <strong className="text-brand-900">Becas de Entrada de Waterloo:</strong> Basadas en
              tus promedios y desempeño en concursos como el Euclid.
            </li>
          </UL>

          <H3>6. Pro Tips de Olímpico a Olímpico 📌</H3>

          <H4>🎯 Tips para el SAT</H4>
          <UL>
            <li>
              <strong className="text-brand-900">Ponte una fecha límite clara:</strong> Lo ideal
              es tener tu SAT listo entre inicios y mediados del 4.º semestre de prepa.
            </li>
            <li>
              <strong className="text-brand-900">Haz un examen de prueba ¡YA!:</strong> Esto te
              dará tu punto de partida real.
            </li>
            <li>
              <strong className="text-brand-900">La constancia le gana al 'atracón':</strong> Es
              mil veces mejor estudiar 30 minutos diarios que 6 horas un domingo.
            </li>
            <li>
              <strong className="text-brand-900">Simulacros con reloj en mano:</strong> La mejor
              estrategia para dominar el ritmo y controlar los nervios.
            </li>
            <li>
              <strong className="text-brand-900">Haz la mayor cantidad de ejercicios posible:</strong>{' '}
              El banco de preguntas tiene patrones muy claros.
            </li>
          </UL>

          <H4>🚀 Tips para tu Passion Project</H4>
          <UL>
            <li>
              <strong className="text-brand-900">Alinealo con tu vocación:</strong> Si quieres
              estudiar Computer Science, busca cómo implementar una aplicación que resuelva una
              necesidad en tu comunidad.
            </li>
            <li>
              <strong className="text-brand-900">Enfócate en el impacto positivo:</strong> Tu
              proyecto vale por el beneficio real que genera en los demás.
            </li>
            <li>
              <strong className="text-brand-900">Apóyate en tu escuela:</strong> Si planteas una
              idea creativa, es muy probable que tus profesores y directores te abran puertas.
            </li>
            <li>
              <strong className="text-brand-900">Comienza desde 3.º de secundaria:</strong>{' '}
              Iniciar temprano te permite experimentar y acumular impacto tangible.
            </li>
          </UL>

          <H4>✍️ Tips para tus Ensayos</H4>
          <UL>
            <li>
              <strong className="text-brand-900">Arranca a inicios de 4.º semestre de prepa:</strong>{' '}
              Te da tiempo para hacer borradores sin estrés.
            </li>
            <li>
              <strong className="text-brand-900">No los empieces demasiado antes:</strong> Lo más
              valioso serán las experiencias y madurez que irás adquiriendo.
            </li>
            <li>
              <strong className="text-brand-900">Sé auténtico sobre todas las cosas:</strong> Las
              universidades detectan de inmediato un ensayo inflado. Muestra tu voz real. ¡La
              autenticidad es lo que hace que te recuerden!
            </li>
          </UL>
        </motion.article>
      </main>
    </>
  )
}
