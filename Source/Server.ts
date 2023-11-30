import { listen } from './Socket/index'
import ExistTables from './Database/ExistTables'

ExistTables()
listen()