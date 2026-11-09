import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Bookmark,
  Briefcase,
  Camera,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  FolderOpen,
  Heart,
  Home,
  Megaphone,
  MapPin,
  Menu,
  Pin,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import content from "./content/portal.json";

const categories = [
  "Todos",
  "Avisos",
  "Campanhas",
  "Novidades",
  "Nossa cultura",
];
const nav = [
  { label: "Mural", icon: Home },
  { label: "Avisos", icon: Megaphone },
  { label: "Campanhas", icon: Sparkles },
  { label: "Calendário", icon: CalendarDays },
  { label: "Salvos", icon: Bookmark },
];
const parseDate = (value) => new Date(`${value}T12:00:00`);
const dateLabel = (value, options = { day: "numeric", month: "short" }) =>
  parseDate(value).toLocaleDateString("pt-BR", options);
const localDate = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const posts = [...content.posts].sort((a, b) => b.date.localeCompare(a.date));
const events = [...content.events].sort((a, b) =>
  `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`),
);

function HeroPhotos() {
  return (
    <div className="hero-photos" aria-hidden="true">
      <img
        className="hero-photo hero-photo-main"
        src="/images/instagram/natal-ilheus.jpg"
        alt=""
      />
      <img
        className="hero-photo hero-photo-side"
        src="/images/instagram/corrida-botisun.jpg"
        alt=""
      />
      <img className="hero-seal" src="/brand/gptw-selo.png" alt="" />
    </div>
  );
}

const resourceIcons = {
  book: BookOpen,
  folder: FolderOpen,
  heart: Heart,
  briefcase: Briefcase,
  instagram: Camera,
};

function Calendar({ month, setMonth, selected, onSelect }) {
  const year = month.getFullYear(),
    index = month.getMonth();
  const first = new Date(year, index, 1).getDay();
  const count = new Date(year, index + 1, 0).getDate();
  const today = localDate(new Date());
  return (
    <div className="calendar">
      <div className="month-nav">
        <strong>
          {month.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </strong>
        <div>
          <button
            className="icon-button"
            aria-label="Mês anterior"
            onClick={() => setMonth(new Date(year, index - 1, 1))}
          >
            <ChevronLeft size={17} />
          </button>
          <button
            className="icon-button"
            aria-label="Próximo mês"
            onClick={() => setMonth(new Date(year, index + 1, 1))}
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
      <div className="calendar-grid">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((day, i) => (
          <span className="weekday" key={i}>
            {day}
          </span>
        ))}
        {Array.from({ length: first }, (_, i) => (
          <span key={`empty-${i}`} />
        ))}
        {Array.from({ length: count }, (_, i) => {
          const day = i + 1,
            value = localDate(new Date(year, index, day)),
            hasEvent = events.some((e) => e.date === value);
          return (
            <button
              key={day}
              className={`day ${today === value ? "today" : ""} ${selected === value ? "selected" : ""} ${hasEvent ? "has-event" : ""}`}
              onClick={() => onSelect(value)}
              aria-pressed={selected === value}
              aria-label={`${dateLabel(value, { day: "numeric", month: "long", year: "numeric" })}${hasEvent ? ", com evento" : ""}`}
            >
              {day}
              {hasEvent && <i />}
            </button>
          );
        })}
      </div>
      <div className="calendar-key">
        <i /> Eventos e datas importantes
      </div>
    </div>
  );
}

function PostCard({ post, saved, onSave, onOpen }) {
  return (
    <article className={`post-card ${!post.image ? "text-card" : ""}`}>
      {post.image && (
        <button
          className="post-image"
          onClick={() => onOpen(post)}
          aria-label={`Ler ${post.title}`}
        >
          <img src={post.image} alt={post.imageAlt} loading="lazy" />
          {post.pinned && (
            <span className="image-pin">
              <Pin size={12} /> Em destaque
            </span>
          )}
        </button>
      )}
      <div className="post-content">
        <div className="post-meta">
          <span
            className={`tag tag-${normalize(post.category).replaceAll(" ", "-")}`}
          >
            {post.category}
          </span>
          <span>{dateLabel(post.date)}</span>
          {!post.image && post.pinned && <Pin size={13} />}
        </div>
        <button className="post-title" onClick={() => onOpen(post)}>
          <h3>{post.title}</h3>
        </button>
        <p>{post.excerpt}</p>
        <div className="post-footer">
          <span className={`avatar avatar-${post.initials.toLowerCase()}`}>
            {post.initials}
          </span>
          <div>
            <strong>{post.author}</strong>
            <span>{post.readTime} de leitura</span>
          </div>
          <button
            className={`icon-button save-button ${saved ? "is-saved" : ""}`}
            aria-label={`${saved ? "Remover dos salvos" : "Salvar"}: ${post.title}`}
            aria-pressed={saved}
            onClick={() => onSave(post.id)}
          >
            <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </article>
  );
}

function EventItem({ event, onOpen }) {
  return (
    <button
      className="event-item"
      onClick={() => onOpen({ ...event, type: "event" })}
    >
      <span
        className={`event-date ${event.category === "Campanha" ? "pink" : ""}`}
      >
        <strong>{dateLabel(event.date, { day: "2-digit" })}</strong>
        <small>
          {dateLabel(event.date, { month: "short" }).replace(".", "")}
        </small>
      </span>
      <span>
        <strong>{event.title}</strong>
        <small>
          {event.time ? `${event.time} · ` : ""}
          {event.location}
        </small>
      </span>
      <ChevronRight size={15} />
    </button>
  );
}

function downloadEvent(event) {
  const escape = (text) =>
    text
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  const date = event.date.replaceAll("-", "");
  const next = parseDate(event.date);
  next.setDate(next.getDate() + 1);
  const start = event.time
    ? `DTSTART;TZID=America/Sao_Paulo:${date}T${event.time.replace(":", "")}00`
    : `DTSTART;VALUE=DATE:${date}`;
  const end = event.time
    ? `DTEND;TZID=America/Sao_Paulo:${date}T${(event.endTime || event.time).replace(":", "")}00`
    : `DTEND;VALUE=DATE:${localDate(next).replaceAll("-", "")}`;
  const text = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Portal Lara//Agenda//PT-BR",
    "BEGIN:VTIMEZONE",
    "TZID:America/Sao_Paulo",
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:-0300",
    "TZOFFSETTO:-0300",
    "TZNAME:-03",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${event.id}@portal-lara`,
    `DTSTAMP:${new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "")}`,
    start,
    end,
    `SUMMARY:${escape(event.title)}`,
    `DESCRIPTION:${escape(event.description)}`,
    `LOCATION:${escape(event.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/calendar;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.id}.ics`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function DetailDialog({ item, onClose, saved, onSave }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="detail-dialog"
      aria-labelledby="detail-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-inner">
        <button
          className="icon-button dialog-close"
          aria-label="Fechar publicação"
          onClick={onClose}
          autoFocus
        >
          <X size={22} />
        </button>
        {item.image && (
          <div className="dialog-media">
            <img className="dialog-image" src={item.image} alt={item.imageAlt} />
          </div>
        )}
        <div className="dialog-body">
          <span className="eyebrow">{item.category || "POR AQUI"}</span>
          <h2 id="detail-title">{item.title}</h2>
          {item.date && (
            <p className="dialog-date">
              {dateLabel(item.date, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {item.author ? ` · ${item.author}` : ""}
            </p>
          )}
          {(item.body || [item.description]).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          {item.type === "event" ? (
            <>
              <div className="event-details">
                <Clock3 size={18} />
                {item.time
                  ? `${item.time}${item.endTime ? ` às ${item.endTime}` : ""} (Brasília)`
                  : "Dia inteiro"}
                <span>· {item.location}</span>
              </div>
              <button
                className="primary-button"
                onClick={() => downloadEvent(item)}
              >
                <Download size={17} /> Adicionar à minha agenda
              </button>
            </>
          ) : item.author ? (
            <div className="dialog-actions">
            <button
              className="secondary-button"
              onClick={() => onSave(item.id)}
            >
              <Bookmark
                size={17}
                fill={saved.includes(item.id) ? "currentColor" : "none"}
              />
              {saved.includes(item.id)
                ? "Salvo neste navegador"
                : "Salvar para ler depois"}
            </button>
            {item.instagram && (
              <a
                className="secondary-button"
                href={item.instagram}
                target="_blank"
                rel="noreferrer"
              >
                <Camera size={17} /> Ver no Instagram
              </a>
            )}
            </div>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}

export default function App() {
  const [view, setView] = useState("Mural"),
    [category, setCategory] = useState("Todos"),
    [query, setQuery] = useState(""),
    [sort, setSort] = useState("recent");
  const [selected, setSelected] = useState(null),
    [month, setMonth] = useState(
      () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    );
  const [detail, setDetail] = useState(null),
    [menuOpen, setMenuOpen] = useState(false),
    [toast, setToast] = useState("");
  const [saved, setSaved] = useState(() => {
    try {
      const value = JSON.parse(localStorage.getItem("lara-saved-v1") || "[]");
      return Array.isArray(value)
        ? value.filter((id) => typeof id === "string")
        : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(timer);
  }, [toast]);
  function save(id) {
    const next = saved.includes(id)
      ? saved.filter((value) => value !== id)
      : [...saved, id];
    setSaved(next);
    try {
      localStorage.setItem("lara-saved-v1", JSON.stringify(next));
      setToast(
        next.includes(id)
          ? "Publicação salva neste navegador"
          : "Publicação removida dos salvos",
      );
    } catch {
      setToast("Salvo apenas nesta sessão: armazenamento indisponível");
    }
  }
  function navigate(next) {
    setView(next);
    setCategory(["Avisos", "Campanhas"].includes(next) ? next : "Todos");
    setQuery("");
    setSelected(null);
    setMenuOpen(false);
  }
  const filtered = posts
    .filter(
      (post) =>
        (view !== "Salvos" || saved.includes(post.id)) &&
        (category === "Todos" || post.category === category) &&
        normalize(
          `${post.title} ${post.excerpt} ${post.author} ${post.body.join(" ")}`,
        ).includes(normalize(query)),
    )
    .sort((a, b) =>
      sort === "old"
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date),
    );
  const today = localDate(new Date());
  const upcoming = events
    .filter((event) =>
      selected ? event.date === selected : event.date >= today,
    )
    .slice(0, 3);
  const monthEvents = events.filter(
    (event) =>
      event.date.startsWith(localDate(month).slice(0, 7)) &&
      (!selected || event.date === selected) &&
      normalize(`${event.title} ${event.description}`).includes(
        normalize(query),
      ),
  );
  const heroPost = posts.find((post) => post.id === content.hero.postId);
  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Pular para o conteúdo
      </a>
      {menuOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Fechar menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("Mural");
          }}
        >
          <img
            className="brand-logo"
            src="/brand/logo-green.png"
            alt={content.company.name}
          />
          <span className="brand-tagline">{content.company.tagline}</span>
        </a>
        <div className="nav-label">NOSSO ESPAÇO</div>
        <nav aria-label="Navegação principal">
          {nav.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${view === label ? "active" : ""}`}
              onClick={() => navigate(label)}
              aria-current={view === label ? "page" : undefined}
            >
              <Icon size={19} />
              <span>{label}</span>
              {label === "Salvos" &&
                saved.filter((id) => posts.some((p) => p.id === id)).length >
                  0 && (
                  <small>
                    {
                      saved.filter((id) => posts.some((p) => p.id === id))
                        .length
                    }
                  </small>
                )}
              {label === "Mural" && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <img
            className="note-seal"
            src="/brand/gptw-selo.png"
            alt="Selo Great Place To Work Certificada, Dez/2025 a Dez/2026"
          />
          <h3>Um ótimo lugar para trabalhar.</h3>
          <p>Certificados GPTW pela 2ª vez consecutiva.</p>
          <button
            onClick={() =>
              setDetail(posts.find((p) => p.id === "gptw-2026"))
            }
          >
            Saiba mais <ArrowUpRight size={15} />
          </button>
        </div>
        <div className="sidebar-footer">
          <span>
            {content.company.footer}
            <small>
              Portal {content.company.name} © {new Date().getFullYear()}
            </small>
          </span>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu size={21} />
            </button>
            <span>Nosso espaço</span>
            <ChevronRight size={14} />
            <strong>{view}</strong>
          </div>
          <div className="topbar-actions">
            <span className="today-label">
              <CalendarDays size={15} />
              {new Date().toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
              })}
            </span>
            <span className="topbar-divider" />
            <button
              className="icon-button notification-button"
              aria-label="Ver avisos"
              onClick={() => navigate("Avisos")}
            >
              <Bell size={19} />
            </button>
            <span className="team-avatar" title="Um portal para toda a equipe">
              <Users size={19} />
            </span>
          </div>
        </header>
        <main id="main">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                QUE BOM TER VOCÊ POR AQUI <span>●</span>
              </div>
              <h1>
                {view === "Mural"
                  ? "Acontece por aqui"
                  : view === "Calendário"
                    ? "Nossa agenda"
                    : view === "Salvos"
                      ? "Suas leituras, guardadas"
                      : view}
              </h1>
              <p>
                {view === "Mural"
                  ? "Fique por dentro. Participe. Faça parte."
                  : view === "Calendário"
                    ? "Encontros e datas para se conectar com a nossa gente."
                    : view === "Salvos"
                      ? "Publicações salvas neste navegador para revisitar quando quiser."
                      : "Informação e inspiração para o nosso dia a dia."}
              </p>
            </div>
            <label className="search-box">
              <Search size={18} />
              <input
                aria-label={
                  view === "Calendário" ? "Buscar eventos" : "Buscar no portal"
                }
                placeholder={
                  view === "Calendário"
                    ? "Buscar eventos..."
                    : "O que você procura?"
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button aria-label="Limpar busca" onClick={() => setQuery("")}>
                  <X size={15} />
                </button>
              )}
            </label>
          </div>
          {view === "Mural" && !query && (
            <section className="hero">
              <div className="hero-copy">
                <span className="hero-eyebrow">
                  <span /> {content.hero.eyebrow}
                </span>
                <h2>{content.hero.title}</h2>
                <p>{content.hero.description}</p>
                <div className="hero-actions">
                  <button
                    className="primary-button"
                    onClick={() => setDetail(heroPost)}
                  >
                    Conheça o portal <ArrowRight size={17} />
                  </button>
                  <a
                    className="ghost-button"
                    href={content.company.careers}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Briefcase size={16} /> Vagas abertas
                  </a>
                </div>
                <dl className="hero-stats">
                  {content.stats.map((stat) => (
                    <div key={stat.label}>
                      <dt>{stat.value}</dt>
                      <dd>{stat.label}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <HeroPhotos />
              <img
                className="hero-watermark"
                src="/brand/logo-white.png"
                alt=""
                aria-hidden="true"
              />
            </section>
          )}
          {view === "Mural" && !query && (
            <section className="brands-band" aria-label="Nossas marcas">
              <span>NOSSAS MARCAS</span>
              <img
                src="/brand/marcas-green.png"
                alt="O Boticário, Quem Disse, Berenice?, O.U.I, AU.migos Pets, Eudora e iaf"
              />
            </section>
          )}
          <div
            className={`content-layout ${view === "Calendário" ? "calendar-layout" : ""}`}
          >
            <section
              className="feed"
              aria-label={
                view === "Calendário" ? "Calendário de eventos" : "Publicações"
              }
            >
              {view === "Calendário" ? (
                <>
                  <div className="section-heading">
                    <h2>
                      <CalendarDays size={20} /> Calendário de eventos
                    </h2>
                    <button
                      className="text-button"
                      onClick={() => {
                        setMonth(
                          new Date(
                            new Date().getFullYear(),
                            new Date().getMonth(),
                            1,
                          ),
                        );
                        setSelected(null);
                      }}
                    >
                      Hoje
                    </button>
                  </div>
                  <div className="large-calendar panel">
                    <Calendar
                      month={month}
                      setMonth={(value) => {
                        setMonth(value);
                        setSelected(null);
                      }}
                      selected={selected}
                      onSelect={(value) =>
                        setSelected(value === selected ? null : value)
                      }
                    />
                  </div>
                  <div className="section-heading agenda-heading">
                    <h2>
                      {selected
                        ? dateLabel(selected, { day: "numeric", month: "long" })
                        : "Eventos do mês"}
                    </h2>
                    {selected && (
                      <button
                        className="text-button"
                        onClick={() => setSelected(null)}
                      >
                        Ver o mês inteiro
                      </button>
                    )}
                  </div>
                  <div className="panel month-events">
                    {monthEvents.length ? (
                      monthEvents.map((event) => (
                        <EventItem
                          key={event.id}
                          event={event}
                          onOpen={setDetail}
                        />
                      ))
                    ) : (
                      <div className="empty-state">
                        <CalendarDays />
                        <h3>Nenhum evento por aqui</h3>
                        <p>
                          Selecione outro dia ou mês para consultar a
                          programação.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="section-heading">
                    <h2>
                      Nosso mural <span>{filtered.length}</span>
                    </h2>
                    <label className="sort-label">
                      <ArrowDown size={13} />
                      <select
                        aria-label="Ordenar publicações"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                      >
                        <option value="recent">Mais recentes</option>
                        <option value="old">Mais antigas</option>
                      </select>
                    </label>
                  </div>
                  <div className="category-tabs" aria-label="Categorias">
                    {categories.map((item) => (
                      <button
                        key={item}
                        className={category === item ? "selected" : ""}
                        aria-pressed={category === item}
                        onClick={() => {
                          setCategory(item);
                          if (view === "Avisos" || view === "Campanhas")
                            setView("Mural");
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <div className="posts-grid">
                    {filtered.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        saved={saved.includes(post.id)}
                        onSave={save}
                        onOpen={setDetail}
                      />
                    ))}
                  </div>
                  {filtered.length === 0 && (
                    <div className="empty-state panel">
                      <Search size={30} />
                      <h3>
                        {view === "Salvos" && !query
                          ? "Suas próximas leituras ficam aqui"
                          : "Nenhuma publicação encontrada"}
                      </h3>
                      <p>
                        {view === "Salvos"
                          ? "Toque no marcador de uma publicação para guardá-la."
                          : "Experimente outro termo ou uma categoria diferente."}
                      </p>
                      <button
                        className="secondary-button"
                        onClick={() => navigate("Mural")}
                      >
                        Voltar ao mural
                      </button>
                    </div>
                  )}
                  {filtered.length > 0 && (
                    <p className="feed-end">
                      <span /> Você está por dentro de tudo <Check size={13} />
                      <span />
                    </p>
                  )}
                </>
              )}
            </section>
            <aside className="right-column" aria-label="Agenda e atalhos">
              {view !== "Calendário" && (
                <section className="panel agenda-panel">
                  <div className="panel-title">
                    <h2>
                      <CalendarDays size={18} /> Na nossa agenda
                    </h2>
                    <button
                      className="icon-button"
                      aria-label="Abrir calendário completo"
                      onClick={() => navigate("Calendário")}
                    >
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                  <Calendar
                    month={month}
                    setMonth={(value) => {
                      setMonth(value);
                      setSelected(null);
                    }}
                    selected={selected}
                    onSelect={(value) =>
                      setSelected(value === selected ? null : value)
                    }
                  />
                  <div className="upcoming-heading">
                    <span>
                      {selected
                        ? dateLabel(selected, { day: "numeric", month: "long" })
                        : "PRÓXIMOS ENCONTROS"}
                    </span>
                    {selected && (
                      <button
                        className="text-button"
                        onClick={() => setSelected(null)}
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                  <div className="upcoming-list">
                    {upcoming.length ? (
                      upcoming.map((event) => (
                        <EventItem
                          key={event.id}
                          event={event}
                          onOpen={setDetail}
                        />
                      ))
                    ) : (
                      <p className="no-events">
                        Nenhum evento {selected ? "neste dia" : "programado"}.
                        Volte em breve!
                      </p>
                    )}
                  </div>
                  <button
                    className="calendar-link"
                    onClick={() => navigate("Calendário")}
                  >
                    Ver calendário completo <ArrowRight size={15} />
                  </button>
                </section>
              )}
              <section className="panel quick-links">
                <div className="panel-title">
                  <h2>
                    <FolderOpen size={18} /> À mão
                  </h2>
                  <span className="little-stars">✧</span>
                </div>
                {content.resources.map((resource) => {
                  const Icon = resourceIcons[resource.icon] || Heart;
                  const inner = (
                    <>
                      <span className={`resource-icon ${resource.icon}`}>
                        <Icon size={18} />
                      </span>
                      <span>
                        <strong>{resource.title}</strong>
                        <small>{resource.description}</small>
                      </span>
                      <ArrowUpRight size={16} />
                    </>
                  );
                  return resource.url ? (
                    <a
                      className="resource-link"
                      href={resource.url}
                      key={resource.id}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {inner}
                    </a>
                  ) : (
                    <button
                      className="resource-link"
                      key={resource.id}
                      onClick={() => setDetail(resource)}
                    >
                      {inner}
                    </button>
                  );
                })}
              </section>
              <section className="panel cities-panel">
                <div className="panel-title">
                  <h2>
                    <MapPin size={18} /> Onde estamos
                  </h2>
                </div>
                <p>Nossa gente está em lojas e na Venda Direta pela Bahia.</p>
                <ul>
                  {content.cities.map((city) => (
                    <li key={city}>{city}</li>
                  ))}
                </ul>
              </section>
              <section className="panel insta-panel">
                <div className="panel-title">
                  <h2>
                    <Camera size={18} /> No nosso Instagram
                  </h2>
                  <a
                    className="icon-button"
                    href={content.company.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Abrir o Instagram do Grupo Lara"
                  >
                    <ArrowUpRight size={18} />
                  </a>
                </div>
                <div className="insta-grid">
                  {content.gallery.map((item) => (
                    <a
                      key={item.url + item.image}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      title={item.alt}
                    >
                      <img src={item.image} alt={item.alt} loading="lazy" />
                    </a>
                  ))}
                </div>
                <a
                  className="calendar-link"
                  href={content.company.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  Seguir @grupo_lara_ <ArrowRight size={15} />
                </a>
              </section>
              <div className="quote-card">
                <span>“</span>
                <p>
                  Há 36 anos
                  <br />
                  transformando pessoas e
                  <br />
                  <em>movimentando o varejo.</em>
                </p>
                <div>
                  <span /> NOSSA GENTE, NOSSA FORÇA
                </div>
                <img
                  className="quote-logo"
                  src="/brand/logo-white.png"
                  alt=""
                  aria-hidden="true"
                />
              </div>
            </aside>
          </div>
          <footer className="page-footer">
            <span>
              Grupo Lara · Feito para aproximar a nossa gente{" "}
              <Heart size={12} />
            </span>
            <span>
              {content.company.demo
                ? "Versão de demonstração · agenda sujeita a confirmação"
                : `Portal ${content.company.name}`}
            </span>
          </footer>
        </main>
      </div>
      {detail && (
        <DetailDialog
          key={detail.id}
          item={detail}
          onClose={() => setDetail(null)}
          saved={saved}
          onSave={save}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <Check size={17} />
          {toast}
        </div>
      )}
    </div>
  );
}
