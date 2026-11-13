function targetSummary(uri) {
  try {
    const parsed = new URL(uri)
    return {
      hostname: parsed.hostname,
      database: parsed.pathname.slice(1) || '(missing)',
    }
  } catch {
    return { hostname: '(invalid)', database: '(invalid)' }
  }
}

function addErrorDetails(details, value) {
  if (!value || typeof value !== 'object') return
  if (typeof value.name === 'string') details.names.add(value.name)
  if (typeof value.code === 'string' || typeof value.code === 'number') details.codes.add(String(value.code))
  if (typeof value.codeName === 'string') details.codes.add(value.codeName)
  if (typeof value.message === 'string') details.messages.add(value.message)
  if (typeof value.errmsg === 'string') details.messages.add(value.errmsg)
  if (value.errorResponse && value.errorResponse !== value) addErrorDetails(details, value.errorResponse)
}

export function mongoFailureSummary(error, uri) {
  const details = { names: new Set(), codes: new Set(), messages: new Set() }
  addErrorDetails(details, error)
  addErrorDetails(details, error?.cause)
  addErrorDetails(details, error?.reason)

  const servers = error?.reason?.servers
  if (servers instanceof Map) {
    for (const description of servers.values()) {
      addErrorDetails(details, description?.error)
      addErrorDetails(details, description?.error?.cause)
    }
  }

  const codes = [...details.codes].sort()
  const atlasNetworkRejected = [...details.messages].some((message) => /ip not in (?:the )?(?:access list|whitelist)/i.test(message))
  let category = 'connection-failed'
  let hint = 'Check the Atlas target, credentials, and cluster state.'
  if (atlasNetworkRejected) {
    category = 'atlas-network-access-rejected'
    hint = 'Atlas rejected this connection source. Compare the Atlas project IP access list with the source used for MongoDB traffic.'
  } else if (codes.some((code) => code.startsWith('ERR_SSL_'))) {
    category = 'tls-handshake-failed'
    hint = 'TLS failed before authentication. Check this Atlas project\'s IP access list and cluster availability.'
  } else if (codes.some((code) => ['ENOTFOUND', 'EAI_AGAIN'].includes(code))) {
    category = 'dns-resolution-failed'
    hint = 'DNS resolution failed for the configured MongoDB host.'
  } else if (codes.includes('18') || codes.includes('AuthenticationFailed')) {
    category = 'authentication-rejected'
    hint = 'Atlas reached the database but rejected authentication. Check the database user and password.'
  } else if (codes.includes('AtlasError') || codes.includes('8000')) {
    category = 'atlas-command-rejected'
    hint = 'Atlas rejected the connection or command. Check project deployment status, network access, database credentials, and roles.'
  }

  return {
    target: targetSummary(uri),
    category,
    errorNames: [...details.names].sort(),
    errorCodes: codes,
    hint,
  }
}
