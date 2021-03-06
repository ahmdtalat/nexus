import * as Logger from '@nexus/logger'
import { cloneDeep } from 'lodash'
import * as Schema from '../schema'
import { SchemaSettingsManager } from '../schema/settings'
import * as Server from '../server'
import { ServerSettingsManager } from '../server/settings'

type SettingsInput = {
  logger?: Logger.SettingsInput
  schema?: Schema.SettingsInput
  server?: Server.SettingsInput
}

export type SettingsData = Readonly<{
  logger: Logger.SettingsData
  schema: Schema.SettingsData
  server: Server.SettingsData
}>

/**
 * todo
 */
export type Settings = {
  /**
   * todo
   */
  original: SettingsData
  /**
   * todo
   */
  current: SettingsData
  /**
   * todo
   */
  change(newSetting: SettingsInput): void
}

/**
 * Create an app settings component.
 *
 * @remarks
 *
 * The app settings component centralizes settings management of all other
 * components. Therefore it depends on the other components. It requires their
 * settings managers.
 */
export function create({
  schemaSettings,
  serverSettings,
  log,
}: {
  schemaSettings: SchemaSettingsManager
  serverSettings: ServerSettingsManager
  log: Logger.RootLogger
}) {
  const settings: Settings = {
    change(newSettings) {
      if (newSettings.logger) {
        log.settings(newSettings.logger)
      }
      if (newSettings.schema) {
        schemaSettings.change(newSettings.schema)
      }
      if (newSettings.server) {
        serverSettings.change(newSettings.server)
      }
    },
    current: {
      logger: log.settings,
      schema: schemaSettings.data,
      server: serverSettings.data,
    },
    original: cloneDeep({
      logger: log.settings,
      schema: schemaSettings.data,
      server: serverSettings.data,
    }),
  }

  return {
    public: settings,
  }
}
