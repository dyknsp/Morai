import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import collections from "@/content/collections.json";
import { assetPath } from "@/lib/site";

export function CollectionGrid() {
  return (
    <div className="collection-grid">
      {collections.map((collection) => (
        <Link className="collection-card" href={"/collections/" + collection.slug} key={collection.slug}>
          <Image src={assetPath(collection.image)} alt="" fill sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 23vw" />
          <span className="collection-overlay" />
          <span className="collection-copy">
            <strong>{collection.title}</strong>
            <small>{collection.description}</small>
          </span>
          <ArrowUpRight className="collection-arrow" size={19} />
        </Link>
      ))}
    </div>
  );
}
