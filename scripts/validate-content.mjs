import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const content = JSON.parse(
  readFileSync(new URL("../src/content/portal.json", import.meta.url), "utf8"),
);
const errors = [];
const requireText = (obj, key, label) => {
  if (typeof obj[key] !== "string" || !obj[key].trim())
    errors.push(`${label}: campo "${key}" obrigatório.`);
};
function dateValid(date) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date))
    return false;
  const value = new Date(`${date}T12:00:00Z`);
  return (
    !Number.isNaN(value.getTime()) && value.toISOString().slice(0, 10) === date
  );
}
function asset(value, label) {
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("..") ||
    !existsSync(resolve("public", value.slice(1)))
  )
    errors.push(
      `${label}: arquivo local não encontrado ou caminho inválido: ${value}`,
    );
}
for (const key of ["posts", "events", "resources"]) {
  if (!Array.isArray(content[key])) {
    errors.push(`${key} precisa ser uma lista.`);
    continue;
  }
  const ids = new Set();
  for (const item of content[key]) {
    const label = `${key}/${item.id || "(sem id)"}`;
    for (const field of ["id", "title"]) requireText(item, field, label);
    if (ids.has(item.id)) errors.push(`${label}: id duplicado.`);
    ids.add(item.id);
    if (key !== "resources" && !dateValid(item.date))
      errors.push(`${label}: data inválida; use AAAA-MM-DD.`);
    if (key === "posts") {
      for (const field of ["excerpt", "author", "initials", "readTime"])
        requireText(item, field, label);
      if (
        !["Avisos", "Campanhas", "Novidades", "Nossa cultura"].includes(
          item.category,
        )
      )
        errors.push(`${label}: categoria inválida.`);
      if (
        !Array.isArray(item.body) ||
        !item.body.length ||
        item.body.some((p) => typeof p !== "string" || !p.trim())
      )
        errors.push(`${label}: body precisa conter parágrafos de texto.`);
      if (item.image) {
        requireText(item, "imageAlt", label);
        asset(item.image, label);
      }
    }
    if (key === "events") {
      for (const field of ["description", "location", "category"])
        requireText(item, field, label);
      for (const field of ["time", "endTime"])
        if (item[field] && !/^([01]\d|2[0-3]):[0-5]\d$/.test(item[field]))
          errors.push(`${label}: ${field} deve usar HH:MM.`);
      if (item.time && (!item.endTime || item.endTime <= item.time))
        errors.push(
          `${label}: endTime precisa ser posterior a time, no mesmo dia.`,
        );
    }
    if (key === "resources") {
      requireText(item, "description", label);
      if (item.url) {
        if (item.url.startsWith("/")) asset(item.url, label);
        else if (!/^https:\/\//.test(item.url))
          errors.push(`${label}: use uma URL HTTPS ou caminho local.`);
      } else if (
        !Array.isArray(item.body) ||
        !item.body.length ||
        item.body.some((p) => typeof p !== "string")
      )
        errors.push(`${label}: preencha body ou url.`);
    }
  }
}
for (const key of ["name", "tagline", "footer"])
  requireText(content.company || {}, key, "company");
for (const key of ["eyebrow", "title", "description", "postId"])
  requireText(content.hero || {}, key, "hero");
if (!content.posts?.some((post) => post.id === content.hero?.postId))
  errors.push("hero.postId deve indicar uma publicação existente.");
if (errors.length) {
  console.error(
    `\nCorrija o conteúdo antes de publicar:\n${errors.map((e) => `- ${e}`).join("\n")}\n`,
  );
  process.exit(1);
}
console.log(
  `Conteúdo válido: ${content.posts.length} publicações, ${content.events.length} eventos e ${content.resources.length} recursos.`,
);
