import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { Firestore as AdminFirestore } from 'firebase-admin/firestore';

export interface ResilientDocumentSnapshot {
  id: string;
  exists: boolean;
  data: () => Record<string, any> | undefined;
  ref: ResilientDocumentReference;
}

export interface ResilientQuerySnapshot {
  empty: boolean;
  size: number;
  docs: ResilientDocumentSnapshot[];
  forEach: (callback: (doc: ResilientDocumentSnapshot) => void) => void;
}

export interface ResilientDocumentReference {
  id: string;
  path: string;
  get: () => Promise<ResilientDocumentSnapshot>;
  set: (data: Record<string, any>, options?: { merge?: boolean }) => Promise<void>;
  update: (data: Record<string, any>) => Promise<void>;
  delete: () => Promise<void>;
}

export interface ResilientQuery {
  where: (fieldPath: string, opStr: string, value: any) => ResilientQuery;
  orderBy: (fieldPath: string, directionStr?: 'asc' | 'desc') => ResilientQuery;
  limit: (limitNum: number) => ResilientQuery;
  get: () => Promise<ResilientQuerySnapshot>;
}

export interface ResilientCollectionReference extends ResilientQuery {
  id: string;
  path: string;
  doc: (documentPath?: string) => ResilientDocumentReference;
  add: (data: Record<string, any>) => Promise<ResilientDocumentReference>;
}

export interface ResilientWriteBatch {
  set: (docRef: ResilientDocumentReference, data: Record<string, any>, options?: { merge?: boolean }) => ResilientWriteBatch;
  update: (docRef: ResilientDocumentReference, data: Record<string, any>) => ResilientWriteBatch;
  delete: (docRef: ResilientDocumentReference) => ResilientWriteBatch;
  commit: () => Promise<void>;
}

export interface ResilientDatabase {
  collection: (collectionPath: string) => ResilientCollectionReference;
  batch: () => ResilientWriteBatch;
  runTransaction?: any;
}

// Helper to resolve nested property
function getNestedValue(obj: any, pathStr: string): any {
  if (!obj || typeof obj !== 'object') return undefined;
  if (pathStr in obj) return obj[pathStr];
  const parts = pathStr.split('.');
  let curr = obj;
  for (const part of parts) {
    if (curr == null || typeof curr !== 'object') return undefined;
    curr = curr[part];
  }
  return curr;
}

// Helper to set nested property
function setNestedValue(obj: any, pathStr: string, val: any): void {
  const parts = pathStr.split('.');
  let curr = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (curr[part] == null || typeof curr[part] !== 'object') {
      curr[part] = {};
    }
    curr = curr[part];
  }
  curr[parts[parts.length - 1]] = val;
}

// Process field values such as transforms
function processFieldTransform(currentVal: any, incomingVal: any): any {
  if (incomingVal && typeof incomingVal === 'object') {
    // firebase-admin NumericIncrementTransform or custom { __type: 'increment', value: n }
    if ('operand' in incomingVal && typeof (incomingVal as any).operand === 'number') {
      return (Number(currentVal) || 0) + (incomingVal as any).operand;
    }
    if ((incomingVal as any).__type === 'increment') {
      return (Number(currentVal) || 0) + Number((incomingVal as any).value || 0);
    }
    // firebase-admin ArrayUnionTransform or custom { __type: 'arrayUnion', value: [...] }
    if ('elements' in incomingVal && Array.isArray((incomingVal as any).elements)) {
      const arr = Array.isArray(currentVal) ? [...currentVal] : [];
      for (const el of (incomingVal as any).elements) {
        if (!arr.includes(el)) arr.push(el);
      }
      return arr;
    }
    if ((incomingVal as any).__type === 'arrayUnion') {
      const arr = Array.isArray(currentVal) ? [...currentVal] : [];
      const toAdd = Array.isArray((incomingVal as any).value) ? (incomingVal as any).value : [(incomingVal as any).value];
      for (const el of toAdd) {
        if (!arr.includes(el)) arr.push(el);
      }
      return arr;
    }
  }
  return incomingVal;
}

export class LocalPersistentStore {
  private filePath: string;
  private tables: Record<string, Record<string, any>> = {};
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor(storageDir = './data', fileName = 'local_db.json') {
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    this.filePath = path.join(storageDir, fileName);
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.tables = JSON.parse(raw);
      }
    } catch (err: any) {
      console.warn('[LocalStore] Warning loading file, starting fresh:', err.message);
      this.tables = {};
    }
  }

  public save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.tables, null, 2), 'utf-8');
    } catch (e: any) {
      console.error('[LocalStore] Failed to save DB to disk:', e.message);
    }
  }

  public scheduleSave() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.save();
    }, 50);
  }

  public getTable(collectionName: string): Record<string, any> {
    if (!this.tables[collectionName]) {
      this.tables[collectionName] = {};
    }
    return this.tables[collectionName];
  }

  public getDoc(collectionName: string, docId: string): any | undefined {
    const table = this.getTable(collectionName);
    const doc = table[docId];
    return doc ? JSON.parse(JSON.stringify(doc)) : undefined;
  }

  public setDoc(collectionName: string, docId: string, data: Record<string, any>, merge = false) {
    const table = this.getTable(collectionName);
    let target = merge && table[docId] ? { ...table[docId] } : {};
    
    for (const [k, v] of Object.entries(data)) {
      const current = getNestedValue(target, k);
      const transformed = processFieldTransform(current, v);
      setNestedValue(target, k, transformed);
    }

    table[docId] = target;
    this.scheduleSave();
  }

  public updateDoc(collectionName: string, docId: string, data: Record<string, any>) {
    const table = this.getTable(collectionName);
    if (!table[docId]) {
      table[docId] = {};
    }
    const target = { ...table[docId] };
    for (const [k, v] of Object.entries(data)) {
      const current = getNestedValue(target, k);
      const transformed = processFieldTransform(current, v);
      setNestedValue(target, k, transformed);
    }
    table[docId] = target;
    this.scheduleSave();
  }

  public deleteDoc(collectionName: string, docId: string) {
    const table = this.getTable(collectionName);
    delete table[docId];
    this.scheduleSave();
  }

  public listDocs(collectionName: string): Array<{ id: string; data: any }> {
    const table = this.getTable(collectionName);
    return Object.entries(table).map(([id, d]) => ({
      id,
      data: JSON.parse(JSON.stringify(d)),
    }));
  }
}

export function createResilientFirestore(
  adminFirestoreInstance?: AdminFirestore | any,
  storageDir = './data'
): ResilientDatabase {
  const store = new LocalPersistentStore(storageDir);
  let adminHealthy = false;
  let hasCheckedHealth = false;

  // Periodic background health check & retry every 30s
  if (adminFirestoreInstance) {
    const checkHealth = async () => {
      try {
        await adminFirestoreInstance.collection('_healthcheck').limit(1).get();
        if (!adminHealthy) {
          console.log('[Database] Firestore reconnected successfully.');
        }
        adminHealthy = true;
        hasCheckedHealth = true;
      } catch (err: any) {
        adminHealthy = false;
        hasCheckedHealth = true;
        console.warn('[Database] Firestore health check failed (will retry):', err.message || err);
      }
    };
    checkHealth();
    setInterval(checkHealth, 30000);
  } else {
    hasCheckedHealth = true;
  }

  function ensureProductionFirestore() {
    if (process.env.NODE_ENV === 'production' && !adminHealthy) {
      const err: any = new Error('[Database] Firestore is unreachable in production. Service Unavailable.');
      err.status = 503;
      console.error('[Database ERROR] Production Firestore operation failed (503 Service Unavailable).');
      throw err;
    }
  }

  function createDocumentReference(colName: string, docId: string): ResilientDocumentReference {
    const docRef: ResilientDocumentReference = {
      id: docId,
      path: `${colName}/${docId}`,
      async get() {
        if (adminHealthy && adminFirestoreInstance) {
          try {
            const snap = await adminFirestoreInstance.collection(colName).doc(docId).get();
            return {
              id: snap.id,
              exists: snap.exists,
              data: () => snap.data(),
              ref: docRef,
            };
          } catch (e: any) {
            if (e.message?.includes('PERMISSION_DENIED') || e.code === 7) {
              adminHealthy = false;
            } else {
              throw e;
            }
          }
        }
        ensureProductionFirestore();
        const data = store.getDoc(colName, docId);
        return {
          id: docId,
          exists: data !== undefined,
          data: () => data,
          ref: docRef,
        };
      },
      async set(data: Record<string, any>, options?: { merge?: boolean }) {
        if (adminHealthy && adminFirestoreInstance) {
          try {
            await adminFirestoreInstance.collection(colName).doc(docId).set(data, options);
            store.setDoc(colName, docId, data, options?.merge);
            return;
          } catch (e: any) {
            if (e.message?.includes('PERMISSION_DENIED') || e.code === 7) {
              adminHealthy = false;
            } else {
              throw e;
            }
          }
        }
        ensureProductionFirestore();
        store.setDoc(colName, docId, data, options?.merge);
      },
      async update(data: Record<string, any>) {
        if (adminHealthy && adminFirestoreInstance) {
          try {
            await adminFirestoreInstance.collection(colName).doc(docId).update(data);
            store.updateDoc(colName, docId, data);
            return;
          } catch (e: any) {
            if (e.message?.includes('PERMISSION_DENIED') || e.code === 7) {
              adminHealthy = false;
            } else {
              throw e;
            }
          }
        }
        ensureProductionFirestore();
        store.updateDoc(colName, docId, data);
      },
      async delete() {
        if (adminHealthy && adminFirestoreInstance) {
          try {
            await adminFirestoreInstance.collection(colName).doc(docId).delete();
            store.deleteDoc(colName, docId);
            return;
          } catch (e: any) {
            if (e.message?.includes('PERMISSION_DENIED') || e.code === 7) {
              adminHealthy = false;
            } else {
              throw e;
            }
          }
        }
        ensureProductionFirestore();
        store.deleteDoc(colName, docId);
      },
    };
    return docRef;
  }

  function createQuery(
    colName: string,
    filters: Array<{ field: string; op: string; val: any }> = [],
    orderBys: Array<{ field: string; dir: 'asc' | 'desc' }> = [],
    limitNum?: number
  ): ResilientQuery {
    const queryObj: ResilientQuery = {
      where(fieldPath: string, opStr: string, value: any) {
        return createQuery(colName, [...filters, { field: fieldPath, op: opStr, val: value }], orderBys, limitNum);
      },
      orderBy(fieldPath: string, directionStr: 'asc' | 'desc' = 'asc') {
        return createQuery(colName, filters, [...orderBys, { field: fieldPath, dir: directionStr }], limitNum);
      },
      limit(n: number) {
        return createQuery(colName, filters, orderBys, n);
      },
      async get() {
        if (adminHealthy && adminFirestoreInstance) {
          try {
            let q: any = adminFirestoreInstance.collection(colName);
            for (const f of filters) {
              q = q.where(f.field, f.op as any, f.val);
            }
            for (const o of orderBys) {
              q = q.orderBy(o.field, o.dir);
            }
            if (limitNum !== undefined) {
              q = q.limit(limitNum);
            }
            const snap = await q.get();
            const docs: ResilientDocumentSnapshot[] = snap.docs.map((d: any) => ({
              id: d.id,
              exists: true,
              data: () => d.data(),
              ref: createDocumentReference(colName, d.id),
            }));
            return {
              empty: snap.empty,
              size: snap.size,
              docs,
              forEach: (cb: (doc: ResilientDocumentSnapshot) => void) => docs.forEach(cb),
            };
          } catch (e: any) {
            if (e.message?.includes('PERMISSION_DENIED') || e.code === 7) {
              adminHealthy = false;
            } else {
              throw e;
            }
          }
        }
        ensureProductionFirestore();

        // Run query against local store
        let all = store.listDocs(colName);

        // Filter
        for (const f of filters) {
          all = all.filter(item => {
            const val = getNestedValue(item.data, f.field);
            switch (f.op) {
              case '==':
                return val == f.val;
              case '!=':
                return val != f.val;
              case '<':
                return val < f.val;
              case '<=':
                return val <= f.val;
              case '>':
                return val > f.val;
              case '>=':
                return val >= f.val;
              case 'array-contains':
                return Array.isArray(val) && val.includes(f.val);
              case 'in':
                return Array.isArray(f.val) && f.val.includes(val);
              default:
                return true;
            }
          });
        }

        // Order
        for (const o of orderBys) {
          all.sort((a, b) => {
            const vA = getNestedValue(a.data, o.field);
            const vB = getNestedValue(b.data, o.field);
            if (vA === vB) return 0;
            if (vA === undefined) return 1;
            if (vB === undefined) return -1;
            const res = vA < vB ? -1 : 1;
            return o.dir === 'desc' ? -res : res;
          });
        }

        // Limit
        if (limitNum !== undefined && limitNum >= 0) {
          all = all.slice(0, limitNum);
        }

        const docs: ResilientDocumentSnapshot[] = all.map(item => ({
          id: item.id,
          exists: true,
          data: () => item.data,
          ref: createDocumentReference(colName, item.id),
        }));

        return {
          empty: docs.length === 0,
          size: docs.length,
          docs,
          forEach: (cb: (doc: ResilientDocumentSnapshot) => void) => docs.forEach(cb),
        };
      },
    };
    return queryObj;
  }

  function createCollectionReference(colName: string): ResilientCollectionReference {
    const baseQuery = createQuery(colName);
    return {
      id: colName,
      path: colName,
      ...baseQuery,
      doc(documentPath?: string) {
        const id = documentPath || crypto.randomUUID().replace(/-/g, '').slice(0, 16);
        return createDocumentReference(colName, id);
      },
      async add(data: Record<string, any>) {
        const id = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
        const docRef = createDocumentReference(colName, id);
        await docRef.set(data);
        return docRef;
      },
    };
  }

  return {
    collection(collectionPath: string) {
      return createCollectionReference(collectionPath);
    },
    batch() {
      const operations: Array<() => Promise<void>> = [];
      const batchObj: ResilientWriteBatch = {
        set(docRef: ResilientDocumentReference, data: Record<string, any>, options?: { merge?: boolean }) {
          operations.push(() => docRef.set(data, options));
          return batchObj;
        },
        update(docRef: ResilientDocumentReference, data: Record<string, any>) {
          operations.push(() => docRef.update(data));
          return batchObj;
        },
        delete(docRef: ResilientDocumentReference) {
          operations.push(() => docRef.delete());
          return batchObj;
        },
        async commit() {
          for (const op of operations) {
            await op();
          }
        },
      };
      return batchObj;
    },
  };
}
