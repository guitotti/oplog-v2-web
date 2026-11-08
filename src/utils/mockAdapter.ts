import {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

type Row = { id: number } & Record<string, unknown>;
type MockDb = Record<string, Row[]>;

const LATENCY_MS = 400;

/**
 * Relacionamentos que o mock resolve nas escritas, simulando o back-end real
 */
const RELATIONS: Record<string, Record<string, string>> = {
  hubs: { parceiro: "parceiros" },
};

let dbPromise: Promise<MockDb> | null = null;

function loadDb(): Promise<MockDb> {
  dbPromise ??= import("../mocks/db.json").then(
    (m) => structuredClone(m.default) as unknown as MockDb,
  );
  return dbPromise;
}

function respond<T>(
  config: InternalAxiosRequestConfig,
  status: number,
  data: T,
): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: String(status),
    headers: new AxiosHeaders({ "content-type": "application/json" }),
    config,
    request: { mock: true },
  };
}

function fail(
  config: InternalAxiosRequestConfig,
  status: number,
  message: string,
): never {
  const response = respond(config, status, { message });
  throw new AxiosError(
    message,
    status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST,
    config,
    response.request,
    response,
  );
}

function parseBody(
  config: InternalAxiosRequestConfig,
): Record<string, unknown> {
  const { data } = config;
  if (!data) return {};
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      fail(config, 400, "Mock: corpo da requisição não é um JSON válido");
    }
  }
  return data as Record<string, unknown>;
}

function resolveRelations(
  config: InternalAxiosRequestConfig,
  db: MockDb,
  resource: string,
  body: Record<string, unknown>,
) {
  const relations = RELATIONS[resource] ?? {};
  const resolved = { ...body };

  for (const [field, target] of Object.entries(relations)) {
    const ref = body[field] as { id?: unknown } | null | undefined;
    if (ref?.id === undefined) continue;

    const related = db[target]?.find(
      (row) => String(row.id) === String(ref.id),
    );
    if (!related) {
      fail(config, 422, `Mock: ${field} com ID ${String(ref.id)} não existe`);
    }
    resolved[field] = structuredClone(related);
  }

  return resolved;
}

/**
 * Adapter do axios que simula a API a partir de src/mocks/db.json
 *
 * - GET    /<recurso>`     -> lista (com filtros por igualdade via query string)
 * - GET    /<recurso>/<id> -> um registro
 * - POST   /<recurso>      -> insere; o ID é gerado pelo mock
 * - PUT    /<recurso>/<id> -> substitui (atualiza) o registro (o ID não é alterado)
 * - DELETE /<recurso>/<id> -> remove
 */
export const mockAdapter: AxiosAdapter = async (config) => {
  const method = (config.method ?? "get").toLowerCase();
  const url = new URL(config.url ?? "", "http://mock.local");
  const [resource, id] = url.pathname.split("/").filter(Boolean);

  await new Promise((r) => setTimeout(r, LATENCY_MS));

  const db = await loadDb();
  const collection = resource ? db[resource] : undefined;

  if (!resource || !collection) {
    fail(config, 404, `Mock: recurso "/${resource ?? ""}" não encontrado`);
  }

  const index =
    id === undefined
      ? -1
      : collection.findIndex((row) => String(row.id) === id);

  if (id !== undefined && index === -1) {
    fail(config, 404, `Mock: /${resource}/${id} não encontrado`);
  }

  switch (method) {
    case "get": {
      if (id !== undefined) {
        return respond(config, 200, structuredClone(collection[index]));
      }

      const params = {
        ...Object.fromEntries(url.searchParams),
        ...(config.params as Record<string, unknown> | undefined),
      };
      const filtered = collection.filter((row) =>
        Object.entries(params).every(
          ([key, value]) =>
            value === undefined || String(row[key]) === String(value),
        ),
      );
      return respond(config, 200, structuredClone(filtered));
    }

    case "post": {
      if (id !== undefined)
        fail(config, 405, "Mock: POST não aceita ID na URL");
      const body = resolveRelations(config, db, resource, parseBody(config));
      const nextId =
        collection.reduce((max, row) => Math.max(max, row.id), 0) + 1;
      const created: Row = { ...body, id: nextId };
      collection.push(created);
      return respond(config, 201, structuredClone(created));
    }

    case "put": {
      if (id === undefined) fail(config, 405, "Mock: PUT exige ID na URL");
      const body = resolveRelations(config, db, resource, parseBody(config));
      const updated: Row = { ...body, id: collection[index].id };
      collection[index] = updated;
      return respond(config, 200, structuredClone(updated));
    }

    case "delete": {
      if (id === undefined) fail(config, 405, "Mock: DELETE exige ID na URL");
      collection.splice(index, 1);
      return respond(config, 204, null);
    }

    default:
      fail(config, 405, `Mock: método ${method.toUpperCase()} não suportado`);
  }
};
