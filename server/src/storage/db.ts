/**
 * Database initialization and connection
 * In-memory persistence engine with optional file/database backing.
 */
import { repository, RepositoryStore } from './repository';

export function initDatabase(_dbPath?: string): RepositoryStore {
  console.log('[Storage] Initialized CareerPilot database store');
  return repository;
}
