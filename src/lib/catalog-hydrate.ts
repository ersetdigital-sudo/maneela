import {
  services as baseServices,
  type Item,
  type Service,
} from "@/lib/catalog";
import {
  getCatalog,
  type CatalogMethod,
  type CatalogService,
} from "@/lib/db/server";
import type { WebBrand } from "@/lib/db/types";

export type Storefront = {
  services: Record<string, Service>;
  methods: CatalogMethod[];
  brand: WebBrand | null;
};

function hydrateService(service: Service, dbService: CatalogService): Service {
  if (service.bill) {
    const fixed = dbService.products[0];
    return {
      ...service,
      dbServiceId: dbService.dbId,
      billItem: fixed
        ? { name: fixed.nama, price: fixed.hargaJual, id: fixed.id }
        : null,
    };
  }

  if (service.byProvider) {
    const byProvider: Record<string, Item[]> = {};
    for (const [provider, items] of Object.entries(service.byProvider)) {
      byProvider[provider] = items.map((item) => {
        const dbProduct =
          dbService.products.find(
            (product) => product.nama === `${provider} · ${item.name}`,
          ) ?? dbService.products.find((product) => product.nama === item.name);
        return dbProduct
          ? { ...item, price: dbProduct.hargaJual, id: dbProduct.id }
          : item;
      });
    }
    return { ...service, dbServiceId: dbService.dbId, byProvider };
  }

  let index = 0;
  const items = (service.items ?? []).map((item) => {
    const dbProduct =
      dbService.products.find((product) => product.nama === item.name) ??
      dbService.products[index];
    index += 1;
    return dbProduct
      ? { ...item, price: dbProduct.hargaJual, id: dbProduct.id }
      : item;
  });

  return { ...service, dbServiceId: dbService.dbId, items };
}

export async function getStorefront(): Promise<Storefront> {
  const result = await getCatalog();
  if (!result.data) {
    return { services: baseServices, methods: [], brand: null };
  }

  const bySlug = new Map(
    result.data.services.map((service) => [service.slug, service]),
  );
  const services = { ...baseServices };
  for (const [slug, product] of Object.entries(baseServices)) {
    const dbService = bySlug.get(slug);
    if (dbService) services[product.slug] = hydrateService(product, dbService);
  }

  return {
    services,
    methods: result.data.methods,
    brand: result.data.brand,
  };
}

export async function getHydratedService(slug: string) {
  const storefront = await getStorefront();
  return {
    service: storefront.services[slug] ?? null,
    services: storefront.services,
    methods: storefront.methods,
    brand: storefront.brand,
  };
}
