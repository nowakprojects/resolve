export const LONG_STRING_SQL_TYPE = 'VARCHAR(190)'
export const LONG_NUMBER_SQL_TYPE = 'BIGINT'
export const INT8_SQL_TYPE = 'INT8'
export const JSON_SQL_TYPE = 'JSONB'
export const TEXT_SQL_TYPE = 'TEXT'
export const BIG_SERIAL = 'BIGSERIAL'

export const RESERVED_EVENT_SIZE = 66 // 3 reserved BIGINT fields with commas
export const BUFFER_SIZE = 512 * 1024
export const BATCH_SIZE = 100
export const LOAD_CHUNK_SIZE = 128000
export const SAVE_CHUNK_SIZE = 32000
export const DEFAULT_TABLE_NAME = '__ResolveSnapshots__'

export const PARTIAL_EVENT_FLAG = Symbol()
export const DATA_API_ERROR_FLAG = Symbol()
export const RESPONSE_SIZE_LIMIT = Symbol()

export const AGGREGATE_ID_SQL_TYPE = LONG_STRING_SQL_TYPE

// Although documentation describes a 1 MB limit, the actual limit is 512 KB
// https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html
export const MAX_RDS_DATA_API_RESPONSE_SIZE = 512000
