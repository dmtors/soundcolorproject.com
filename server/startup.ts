/// <reference path="./globals.d.ts" />

import { readFileSync } from 'fs'
import { createServer, Server } from 'http'
import { createServer as createHttpsServer } from 'https'
import { join } from 'path'

import { logger } from '../shared/logger'

import { buildApp } from './app'
import { config, init } from './config'
import { FatalError, FatalErrorCode } from './errors/FatalError'
import { initDb } from './initDb'

/**
 * generates a random port number between 5000 - 49999
 */
function randomPort () {
  return 5000 + Math.floor(Math.random() * 35000)
}

function startServerOnPort (port: number, create: () => Server) {
  return new Promise<Server>((resolve, reject) => {
    logger.info('Starting server on port', port)
    const server = create()
    server.once('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        reject(err)
      }
    })
    server.listen(port, () => {
      // tslint:disable-next-line: no-console
      console.log(`Server listening on port ${port}`)
      resolve(server)
    })
  })
}

async function startServer () {
  let failCount = 0
  const MAX_FAILS = config.dev || config.standaloneApp ? 10 : 1
  const origPort = config.port
  const serverCreator = config.localSsl ?
    () => createHttpsServer({
      cert: readFileSync(join(__dirname, '../local/server.cert')),
      key: readFileSync(join(__dirname, '../local/server.key')),
    }) :
    () => createServer()
  while (failCount < MAX_FAILS) {
    try {
      config.port = failCount === 0 ? origPort : randomPort()
      // this has to be awaited in order to be able to catch the error
      const server = await startServerOnPort(config.port, serverCreator)
      return server
    } catch (e) {
      logger.warn(`Failed to listen on port ${config.port}!`)
      if (!config.dev && !config.standaloneApp) {
        throw new FatalError(
          FatalErrorCode.EXPECTED_PORT_FAILED_TO_OPEN,
          `Failed to listen on port ${config.port}!`,
        )
      }

      logger.warn(`Trying another port...`)
      failCount++
    }
  }
  logger.fatal(`Could not find an open port!`)
  throw new FatalError(
    FatalErrorCode.NO_AVAILABLE_PORTS,
    'Could not find an open port!',
  )
}

let server: Server | null = null
export async function startup () {
  init()
  let app = buildApp()
  await initDb()
  server = await startServer()
  server.on('request', app)
  // tslint:disable-next-line: no-console
  console.log('Server ready')

  if (module.hot) {
    let currentApp = app
    module.hot.accept('./app', () => {
      if (!server) {
        return
      }
      try {
        logger.info('New module for server/app')
        const { buildApp } = require('./app')
        server.removeListener('request', currentApp)
        currentApp = buildApp()
        server.on('request', currentApp)
        logger.info('Express app reloaded!')
      } catch (err) {
        logger.error('Failed to reload express app:', err)
      }
    })
  }
}

export function stopServer () {
  return new Promise<void>((resolve, reject) => {
    if (server && server.listening) {
      server.close((err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    } else {
      resolve()
    }
  })
}
