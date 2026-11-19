import { Fragment, useMemo } from 'react'
import RichText from '../content/RichText'
import PracticeBox from '../content/PracticeBox'
import { AgregadosCulturales, Consejo, Definicion, Demostracion, Ejemplo, Enunciado, ErrorComun, Figuras, Intentalo, RespuestasDeControl, Revelar, Tabla, Teorema } from '../content/Bloques'
import { figureUrl, parseArticle } from '../../lib/theoryArticle'

// Theory renderer: lesson markup (spec «Página de teoría», Part 2) → the
// DESIGN §5 blocks. Markup names are English; every label the reader sees is
// Spanish. No raw HTML is ever executed: text stays React text and only
// KaTeX output is inserted.

function Blocks({ blocks, ctx, inStatement = false }) {
  return blocks.map((block, index) => <Block key={index} block={block} ctx={ctx} inStatement={inStatement} />)
}

// Section headings: the number in a circle of the section's color (the same
// four colors as the side index), the title big and boxless. Subheadings
// carry a small diamond in their section's color.
function Block({ block, ctx, inStatement, section = 0 }) {
  switch (block.type) {
    case 'heading':
      if (block.level === 2 && block.id) {
        return (
          <h2 id={block.id} className={`tp-lesson-heading tp-lesson-heading-${(block.number - 1) % 4} mt-6 scroll-mt-24`}>
            <span className="tp-lesson-num">{block.number}<span className="sr-only">.</span></span>
            <RichText as="span" text={block.title} />
          </h2>
        )
      }
      return <RichText as={block.level === 2 ? 'h2' : 'h3'} text={block.title} className={`tp-subheading ${section ? `tp-lesson-heading-${(section - 1) % 4}` : ''} mt-1.5 font-display text-xl font-extrabold leading-[1.3]`} />
    case 'paragraph': {
      const idea = inStatement && /^Idea:/.test(block.text)
      return <RichText text={block.text} className={block.lead ? 'text-[19px]' : idea ? 'text-[17px] text-tp-ink-soft' : ''} />
    }
    case 'list': {
      const List = block.ordered ? 'ol' : 'ul'
      return (
        <List start={block.ordered ? block.start : undefined} className={`flex flex-col gap-1.5 pl-[22px] ${block.ordered ? 'list-decimal' : 'list-disc'}`}>
          {block.items.map((item, index) => <li key={index}><RichText as="span" text={item} /></li>)}
        </List>
      )
    }
    case 'table':
      return <Tabla {...block} />
    case 'figures':
      return <Figuras images={block.images} resolveSrc={ctx.resolveFigure} />
    case 'answers':
      return <RespuestasDeControl text={block.text} />
    case 'cultural':
      return <AgregadosCulturales items={block.items} />
    case 'collection':
      return ctx.renderCollection?.(block.slug, block.kind) ?? null
    case 'practice':
      return ctx.practice ?? null
    case 'source':
      return (
        <p className="border-t-2 border-dashed border-tp-rule pt-4 font-sans text-[13px] text-tp-ink-muted">
          Explicaciones y actividades originales de TeacherPeri. Orden de secciones basado en <a className="font-bold underline" href={block.url} target="_blank" rel="noreferrer">el material de OMMBC ↗</a>.
        </p>
      )
    case 'example':
      return (
        <Ejemplo
          number={block.number}
          title={block.title}
          statement={block.statement && <Block block={block.statement} ctx={ctx} />}
          shown={block.shown.length > 0 && <Blocks blocks={block.shown} ctx={ctx} />}
          solution={block.hidden.length > 0 && <Blocks blocks={block.hidden} ctx={ctx} />}
        />
      )
    case 'box':
      return <BoxBlock block={block} ctx={ctx} />
    default:
      return null
  }
}

function BoxBlock({ block, ctx }) {
  const inner = <Blocks blocks={block.children} ctx={ctx} inStatement={['lemma', 'corollary', 'proposition'].includes(block.kind)} />
  switch (block.kind) {
    case 'definition': return <Definicion title={block.title}>{inner}</Definicion>
    case 'theorem': return <Teorema title={block.title}>{inner}</Teorema>
    case 'lemma':
    case 'corollary':
    case 'proposition': return <Enunciado kind={block.kind} title={block.title} number={block.number}>{inner}</Enunciado>
    case 'proof': return <Demostracion title={block.title}>{inner}</Demostracion>
    case 'try': return <Intentalo question={block.title}>{inner}</Intentalo>
    case 'tip': return <Consejo title={block.title}>{inner}</Consejo>
    case 'mistake': return <ErrorComun title={block.title}>{inner}</ErrorComun>
    default: return <Revelar title={block.title}>{inner}</Revelar>
  }
}

// `practice`: the lesson's practice box. It goes where the text puts
// `[[practice]]`; without a marker, right before «En resumen» (or at the
// end). `problems` + `context` build that box when `practice` is not given.
// `renderCollection(slug, kind)` draws `[[collection:…]]`; kind is
// `ejercicios`, `practice` or `dificiles` (`challenge` is an alias).
export default function ArticleText({ article, text, practice, problems = [], context = '', renderCollection, resolveFigure = figureUrl }) {
  const parsed = useMemo(() => article || parseArticle(text), [article, text])
  const practiceNode = practice !== undefined ? practice : problems.length > 0 ? <PracticeBox problems={problems} context={context} /> : null
  const ctx = { renderCollection, resolveFigure, practice: practiceNode }
  // The section each top-level block belongs to, for subheading colors.
  const sectionOf = useMemo(() => {
    const result = []
    let current = 0
    for (const block of parsed.blocks) {
      if (block.type === 'heading' && block.level === 2 && block.number) current = block.number
      result.push(current)
    }
    return result
  }, [parsed])
  const autoAt = !practiceNode || parsed.hasPracticeMarker ? -1 : parsed.summaryIndex >= 0 ? parsed.summaryIndex : parsed.blocks.length
  return (
    <>
      {parsed.blocks.map((block, index) => (
        <Fragment key={index}>
          {index === autoAt && practiceNode}
          <Block block={block} ctx={ctx} section={sectionOf[index]} />
        </Fragment>
      ))}
      {autoAt === parsed.blocks.length && practiceNode}
    </>
  )
}
