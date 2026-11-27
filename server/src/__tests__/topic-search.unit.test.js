import { describe, expect, it } from 'vitest'
import { orderTopics, searchTopics, topicTree, withTopic, withoutArea } from '../../../src/lib/topics.js'
import { aliasesFor } from '../data/topicAliases.js'
import { existingTopicNamed, parseTopicName, rootOf } from '../lib/topics.js'

const topics = [
  { _id: 'geo', name: 'Geometría', slug: 'omm-geometry', parent: null },
  { _id: 'alg', name: 'Álgebra', slug: 'omm-algebra', parent: null },
  { _id: 'com', name: 'Combinatoria', slug: 'omm-combinatorics', parent: null },
  { _id: 'proof', name: 'Demostraciones', slug: 'omm-proof', parent: null },
  { _id: 'how', name: 'Cómo entrenar', slug: 'omm-orientation', parent: null },
  { _id: 'casillas', name: 'Principio de casillas', parent: 'com', aliases: aliasesFor({ name: 'Principio de casillas' }) },
  { _id: 'cam-com', name: 'Caminos', parent: 'com', aliases: [] },
  { _id: 'cam-alg', name: 'Caminos', parent: 'alg', aliases: [] },
  { _id: 'tri', name: 'Triángulos', parent: 'geo', aliases: aliasesFor({ name: 'Triángulos' }) },
  { _id: 'abs', name: 'Contradicción', parent: 'proof', aliases: aliasesFor({ name: 'Contradicción' }) },
]

describe('buscar temas', () => {
  it('encuentra un tema por otro nombre y dice cuál coincidió', () => {
    const [first] = searchTopics('palomar', topics)
    expect(first.topic._id).toBe('casillas')
    expect(first.root.name).toBe('Combinatoria')
    expect(first.alias).toBe('palomar')
    expect(searchTopics('pitagoras', topics)[0].topic._id).toBe('tri')
    expect(searchTopics('absurdo', topics)[0].topic._id).toBe('abs')
  })

  it('ignora acentos y mayúsculas y no busca con una sola letra', () => {
    expect(searchTopics('TRIANGULO', topics)[0].topic._id).toBe('tri')
    expect(searchTopics('t', topics)).toEqual([])
  })

  it('distingue temas del mismo nombre por área y pone primero las áreas elegidas', () => {
    const results = searchTopics('caminos', topics, { preferRoots: ['alg'] })
    expect(results.map((r) => [r.topic._id, r.root.name])).toEqual([['cam-alg', 'Álgebra'], ['cam-com', 'Combinatoria']])
    // Topics already chosen are left out, and the área is still known.
    const rest = searchTopics('caminos', topics, { exclude: ['alg', 'cam-alg'] })
    expect(rest.map((r) => [r.topic._id, r.root.name])).toEqual([['cam-com', 'Combinatoria']])
  })

  it('arma las cuatro áreas en orden y deja aparte las técnicas', () => {
    const tree = topicTree(topics)
    expect(tree.areas.map((a) => a.name)).toEqual(['Geometría', 'Álgebra', 'Combinatoria'])
    expect(tree.areas.find((a) => a.name === 'Combinatoria').children.map((t) => t._id)).toEqual(['cam-com', 'casillas'])
    expect(tree.technique.children.map((t) => t._id)).toEqual(['abs'])
  })

  it('elegir un subtema agrega su área; quitar el área quita sus subtemas', () => {
    const { byId } = topicTree(topics)
    const chosen = withTopic(['geo'], 'casillas', byId)
    expect(chosen).toEqual(['geo', 'com', 'casillas'])
    expect(withoutArea(chosen, 'com', byId)).toEqual(['geo'])
    expect(orderTopics(['tri', 'geo', 'tri'], byId)).toEqual(['geo', 'tri'])
  })
})

describe('temas propuestos (servidor)', () => {
  it('valida el nombre y lo empieza con mayúscula', () => {
    expect(parseTopicName('  palomar  ')).toEqual({ name: 'Palomar' })
    expect(parseTopicName('')).toHaveProperty('error')
    expect(parseTopicName('<b>')).toHaveProperty('error')
  })

  it('reconoce un tema que ya existe por nombre o por otro nombre en la misma área', () => {
    expect(existingTopicNamed('Pichoneras', 'com', topics)?._id).toBe('casillas')
    expect(existingTopicNamed('caminos', 'alg', topics)?._id).toBe('cam-alg')
    expect(existingTopicNamed('palomar', 'geo', topics)).toBeNull()
  })

  it('sabe de qué área cuelga un subtema', () => {
    const byId = new Map(topics.map((t) => [t._id, t]))
    expect(rootOf('casillas', byId).name).toBe('Combinatoria')
    expect(rootOf('geo', byId).name).toBe('Geometría')
  })
})
