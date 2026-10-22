import type { Dictionary } from "./en";
import type { ActionType, Role } from "@/types/game";

type P = Record<string, string | number>;

const roles: Record<Role, string> = {
  Duke: "Duque",
  Assassin: "Asesino",
  Captain: "Capitán",
  Ambassador: "Embajador",
  Contessa: "Condesa",
};

const actions: Record<ActionType, string> = {
  Income: "Ingresos",
  "Foreign aid": "Ayuda exterior",
  Coup: "Golpe de Estado",
  Tax: "Impuestos",
  Assassinate: "Asesinar",
  Steal: "Robar",
  Exchange: "Intercambiar",
};

const es: Dictionary = {
  locale: "es",
  meta: {
    title: "Coup — el juego de cartas de faroles, online",
    description:
      "Juega a Coup con tus amigos en el navegador. Miente, roba y asesina hasta hacerte con el poder. De 2 a 10 jugadores, sin registro.",
  },
  roles,
  actions,
  coins: (n: number) => (n === 1 ? "1 moneda" : `${n} monedas`),
  nav: {
    play: "Jugar",
    rules: "Reglas",
    source: "Código fuente",
    language: "Idioma",
    lightMode: "Cambiar a modo claro",
    darkMode: "Cambiar a modo oscuro",
    home: "Coup, inicio",
  },
  footer: {
    credit:
      "Coup fue diseñado por Rikki Tahta y lo publica Indie Boards & Cards. Esta es una versión online hecha por fans.",
    builtBy: "Hecho por",
    code: "Código en GitHub",
  },
  landing: {
    title: "Miente hasta llegar al poder.",
    lead: "Un juego de faroles para 2 a 10 jugadores. Di que eres cualquier personaje, toma lo que quieras y desenmascara a los mentirosos antes de que te desenmascaren a ti. Se juega en el navegador, sin registro.",
    create: "Crear una sala",
    joinLabel: "¿Te han invitado? Pega el enlace o el código de sala",
    joinPlaceholder: "Enlace o código de sala",
    join: "Entrar",
    joinInvalid: "Eso no parece un enlace ni un código de sala.",
    readRules: "Leer las reglas",
    courtTitle: "Cinco personajes. Nadie está obligado a decir la verdad.",
    courtLead:
      "Cada jugador tiene dos cartas boca abajo. Puedes decir que eres cualquier personaje: lo que tengas en la mano solo importa si alguien te desafía.",
    action: "Acción",
    blocks: "Bloquea",
    nothingToBlock: "Nada",
    court: {
      Duke: {
        action: "Impuestos: toma 3 monedas.",
        blocks: "La ayuda exterior",
      },
      Assassin: {
        action: "Paga 3 monedas: un jugador pierde una carta.",
        blocks: "",
      },
      Captain: {
        action: "Roba 2 monedas a un jugador.",
        blocks: "El robo",
      },
      Ambassador: {
        action: "Roba 2 cartas y quédate las que quieras.",
        blocks: "El robo",
      },
      Contessa: {
        action: "No tiene acción propia.",
        blocks: "El asesinato",
      },
    },
    turnTitle: "Cómo se juega un turno",
    steps: [
      {
        title: "Declara",
        text: "Elige una acción. Si necesita un personaje, basta con decir que lo tienes.",
      },
      {
        title: "Desafía",
        text: "Quien dude de ti puede desafiarte. El que se equivoque pierde una carta.",
      },
      {
        title: "Bloquea",
        text: "Algunas acciones se frenan diciendo que tienes el personaje adecuado. Los bloqueos también se pueden desafiar.",
      },
      {
        title: "Resuelve",
        text: "Si nada lo impide, la acción ocurre. Pierde tus dos cartas y quedas fuera.",
      },
    ],
    onlineTitle: "Pensado para jugar online con amigos",
    online: [
      {
        title: "Manda un enlace y a jugar",
        text: "Crea una sala, comparte la URL y empieza cuando estén todos. Sin cuentas.",
      },
      {
        title: "Nada de mirar cartas ajenas",
        text: "El servidor reparte y comprueba cada jugada. Tu navegador solo recibe tus propias cartas.",
      },
      {
        title: "¿Cerraste la pestaña sin querer?",
        text: "Vuelve a abrir el enlace y estarás en tu sitio con las mismas cartas.",
      },
    ],
    finalTitle: "Reúne a la corte.",
    finalText: "Tus amigos solo necesitan un enlace.",
  },
  rules: {
    title: "Cómo se juega a Coup",
    lead: "Todo lo que necesitas para tu primera partida, y la letra pequeña para las discusiones que vendrán.",
    toc: "En esta página",
    sections: {
      goal: "Objetivo",
      setup: "Preparación",
      turn: "Tu turno",
      actions: "Acciones",
      challenges: "Desafíos",
      blocks: "Bloqueos",
      losing: "Perder influencia",
      special: "Casos especiales",
      online: "Jugar online",
      characters: "Los personajes",
    },
    goal: "Ser el último jugador con al menos una carta. Cada carta boca abajo es influencia en la corte; si pierdes las dos, quedas exiliado.",
    setup: [
      "Cada jugador recibe 2 cartas boca abajo y 2 monedas.",
      "El mazo tiene 3 copias de cada personaje para 2–6 jugadores, 4 para 7–8 y 5 para 9–10.",
      "En partidas de dos jugadores, quien empieza lo hace con 1 sola moneda.",
      "Empieza un jugador al azar y se sigue en el orden en que entraron a la sala.",
    ],
    turn: [
      "En tu turno debes hacer exactamente una acción. No puedes pasar.",
      "Las acciones de personaje solo exigen que digas que tienes ese personaje. Puedes estar mintiendo.",
      "Si empiezas tu turno con 10 monedas o más, debes dar un Golpe de Estado.",
    ],
    table: {
      action: "Acción",
      character: "Personaje",
      effect: "Efecto",
      blockedBy: "La bloquea",
      anyone: "Cualquiera",
      none: "—",
    },
    effects: {
      Income: "Toma 1 moneda.",
      "Foreign aid": "Toma 2 monedas.",
      Coup: "Paga 7 monedas. El objetivo pierde una carta. No se puede bloquear ni desafiar.",
      Tax: "Toma 3 monedas.",
      Assassinate: "Paga 3 monedas. El objetivo pierde una carta.",
      Steal: "Toma 2 monedas del objetivo (o 1 si solo tiene una).",
      Exchange: "Roba 2 cartas y devuelve al mazo 2 cartas a tu elección.",
    },
    challenges: [
      "Cualquier jugador puede desafiar un personaje declarado, esté o no implicado.",
      "Si el desafiado tiene la carta, la enseña, la baraja en el mazo y roba otra. Quien desafió pierde una carta.",
      "Si no la tiene, pierde una carta y su acción o bloqueo fracasa.",
      "Una acción fallida no cuesta nada: se devuelven las monedas pagadas por un asesinato.",
    ],
    blocks: [
      "Cualquiera que diga ser el Duque puede bloquear la ayuda exterior.",
      "Solo el objetivo de un asesinato puede bloquearlo, diciendo ser la Condesa.",
      "Solo el objetivo de un robo puede bloquearlo, diciendo ser el Capitán o el Embajador.",
      "Una acción bloqueada fracasa, pero las monedas pagadas se pierden. Cualquiera puede desafiar el bloqueo.",
    ],
    losing: [
      "Cuando pierdes influencia eliges qué carta revelar. Queda boca arriba a la vista de todos.",
      "Si solo te queda una carta no hay nada que elegir: se revela automáticamente.",
      "Cuando tus dos cartas están reveladas, quedas fuera de la partida.",
    ],
    special: [
      "Doble pérdida: si desafías a un Asesino y pierdes, pierdes una carta por el desafío y otra por el asesinato. Lo mismo pasa si te desafían una Condesa falsa.",
      "Si el objetivo de una acción queda eliminado antes de que se resuelva, la acción no tiene efecto.",
      "En un intercambio te quedas con tantas cartas como tenías boca abajo: una o dos.",
    ],
    online: [
      "Cuando se puede responder a una acción o bloqueo, quienes pueden responder tienen 30 segundos. Quien no responda a tiempo la deja pasar.",
      "¿Perdiste la conexión? Vuelve a abrir el enlace de la sala en menos de 2 minutos para recuperar tu sitio. Después quedas eliminado.",
      "Al terminar, el anfitrión puede empezar la revancha con todos los que sigan en la sala.",
    ],
  },
  lobby: {
    title: "Sala de espera",
    invite:
      "Comparte este enlace con tus amigos. Quien lo abra entra en esta sala.",
    copy: "Copiar enlace",
    copied: "Enlace copiado",
    nickname: "Tu nombre",
    save: "Guardar",
    players: (n: number) => `Jugadores (${n}/10)`,
    host: "Anfitrión",
    you: "Tú",
    offline: "Desconectado",
    start: "Empezar la partida",
    needMore: "Falta al menos un jugador más.",
    waitingHost: (name: string) =>
      `Esperando a que ${name} empiece la partida.`,
  },
  game: {
    connecting: "Conectando con el servidor…",
    reconnecting: "Conexión perdida. Reconectando…",
    joining: "Entrando en la sala…",
    leftTitle: "Has abandonado la partida",
    backHome: "Volver al inicio",
    cantJoin: "No puedes entrar en esta sala",
    newGame: "Crear una sala nueva",
    yourTurn: "Tu turno",
    deck: "Mazo",
    log: "Registro de la partida",
    fullRules: "Abrir las reglas completas",
    leave: "Abandonar",
    leaveConfirm: "¿Abandonar la partida? Perderás tus cartas.",
    you: "Tú",
    out: "Fuera",
    offline: "Desconectado",
    deciding: "Decidiendo",
    turn: "Turno",
    autoPass: (s: number) => `Pasa solo en ${s} s`,
    chooseAction: "Elige una acción",
    chooseTarget: (action: string) => `${action}: elige un objetivo`,
    cancel: "Cancelar",
    real: "La tienes",
    bluff: "Farol",
    needsCoins: (n: number) => `Necesitas ${n} monedas`,
    mustCoup: "Con 10+ monedas debes dar un Golpe",
    challenge: "Desafiar",
    blockAs: (role: string) => `Bloquear como ${role}`,
    allow: "Dejarlo pasar",
    pass: "No desafiar",
    loseTitle: "Elige qué carta revelar",
    loseHint: "Quedará boca arriba y perderás su influencia.",
    exchangeTitle: (n: number) =>
      `Quédate ${n} ${n === 1 ? "carta" : "cartas"}`,
    exchangeHint: "Las demás vuelven al mazo.",
    confirm: "Confirmar",
    waiting: "Esperando al resto de jugadores…",
    spectating: "Estás fuera. Mira cómo termina.",
    winTitle: "La corte es tuya.",
    loseTitleEnd: (name: string) => `${name} se queda con la corte.`,
    rematch: "Jugar otra vez en esta sala",
    waitingRematch: "Esperando a que el anfitrión empiece la revancha…",
    claims: (role: string) => `dice ser ${role}`,
    reasons: {
      lostChallenge: "perdió un desafío",
      caughtBluffing: "fue pillado mintiendo",
      couped: "sufrió un golpe de Estado",
      assassinated: "fue asesinado",
    },
    phase: {
      action: (name: string, mine: boolean) =>
        mine
          ? "Tu turno: elige una acción."
          : `${name} está eligiendo una acción.`,
      challengeAction: (p: P) =>
        `${p.actor} quiere ${p.action}${p.target ? ` a ${p.target}` : ""} y dice ser ${p.role}.`,
      blockAction: (p: P) =>
        p.target
          ? `${p.actor} quiere ${p.action} a ${p.target}. ${p.target} puede bloquear.`
          : `${p.actor} quiere ayuda exterior. Cualquiera puede bloquear con un Duque.`,
      challengeBlock: (p: P) =>
        `${p.blocker} bloquea como ${p.role}. ¿Lo desafías?`,
      challengeActionMine: (p: P) =>
        `Dices ser ${p.role} para ${p.action}. Esperando desafíos.`,
      blockActionMine: (p: P) =>
        `Esperando a ver si alguien bloquea: ${p.name}.`,
      blockActionYou: (p: P) =>
        `${p.actor} quiere ${p.action}. Puedes bloquear.`,
      challengeBlockMine: (p: P) =>
        `Bloqueas como ${p.role}. Esperando desafíos.`,
      loseInfluence: (p: P) =>
        p.mine
          ? "Debes revelar una carta."
          : `${p.name} ${p.reason} y está eligiendo qué carta revelar.`,
      exchange: (p: P) =>
        p.mine
          ? "Elige qué cartas te quedas."
          : `${p.name} está intercambiando cartas.`,
    },
    verbsYou: {
      Income: "cobrar ingresos",
      "Foreign aid": "pedir ayuda exterior",
      Coup: "darte un golpe de Estado",
      Tax: "cobrar impuestos",
      Assassinate: "asesinarte",
      Steal: "robarte",
      Exchange: "intercambiar cartas",
    },
    verbs: {
      Income: "cobrar ingresos",
      "Foreign aid": "pedir ayuda exterior",
      Coup: "dar un golpe de Estado",
      Tax: "cobrar impuestos",
      Assassinate: "asesinar",
      Steal: "robar",
      Exchange: "intercambiar cartas",
    },
    events: {
      joined: (p: P) => `${p.name} entró en la sala`,
      renamed: (p: P) => `${p.from} ahora es ${p.to}`,
      started: (p: P) => `Empieza la partida. Abre ${p.name}`,
      backToLobby: () => "De vuelta a la sala de espera",
      newHost: (p: P) => `${p.name} es el nuevo anfitrión`,
      leftRoom: (p: P) => `${p.name} salió de la sala`,
      forfeit: (p: P) => `${p.name} abandonó la partida`,
      cancelled: (p: P) => `Se cancela la acción de ${p.name}`,
      declare: (p: P) =>
        `${p.name}: ${p.action}${p.target ? ` → ${p.target}` : ""}${p.role ? ` (dice ser ${p.role})` : ""}`,
      blockStands: (p: P) => `El ${p.role} de ${p.name} frena: ${p.action}`,
      challenge: (p: P) => `${p.name} desafía el ${p.role} de ${p.target}`,
      bluffing: (p: P) => `¡${p.name} iba de farol!`,
      isBlocked: (p: P) => `${p.action} queda bloqueada`,
      blockBluff: (p: P) => `${p.name} iba de farol. El bloqueo fracasa`,
      blockDeclared: (p: P) =>
        `${p.name} bloquea ${p.action} (dice ser ${p.role})`,
      reveal: (p: P) => `${p.name} enseña ${p.role} y roba otra carta`,
      lose: (p: P) => `${p.name} ${p.reason} y revela ${p.role}`,
      out: (p: P) => `${p.name} queda fuera de la partida`,
      noEffect: (p: P) =>
        `${p.action} no tiene efecto: el objetivo ya está fuera`,
      income: (p: P) => `${p.name} toma 1 moneda`,
      foreignAid: (p: P) => `${p.name} toma 2 monedas de ayuda exterior`,
      tax: (p: P) => `${p.name} cobra 3 monedas de impuestos`,
      steal: (p: P) => `${p.name} roba ${p.amount} a ${p.target}`,
      exchangeDraw: (p: P) => `${p.name} roba ${p.count} cartas`,
      exchangeReturn: (p: P) => `${p.name} devuelve ${p.count} cartas al mazo`,
      win: (p: P) => `¡${p.name} gana la partida!`,
      nobodyWins: () => "Nadie gana",
    },
    errors: {
      notInRoom: "No estás en esta sala.",
      alreadyStarted: "Esta partida ya ha empezado. Pide un enlace nuevo.",
      roomFull: "La sala está llena (10 jugadores).",
      emptyName: "Tu nombre no puede estar vacío.",
      hostOnly: "Solo el anfitrión puede hacer eso.",
      notEnoughPlayers: "Hacen falta al menos 2 jugadores.",
      notOver: "La partida aún no ha terminado.",
      notNow: "Eso no se puede hacer ahora.",
      notYourTurn: "No es tu turno.",
      unknownAction: "Acción desconocida.",
      mustCoup: "Con 10 monedas o más debes dar un Golpe de Estado.",
      needsCoins: "No tienes monedas suficientes.",
      invalidTarget: "Elige a un jugador que siga en la partida.",
      nothingToRespond: "No hay nada a lo que responder.",
      cannotRespond: "No puedes responder a esto.",
      alreadyPassed: "Ya has respondido.",
      blockOrPass: "Solo puedes bloquear o dejarlo pasar.",
      cannotBlock: "Ahora no puedes bloquear.",
      wrongBlocker: "Ese personaje no puede bloquear esta acción.",
      noLossPending: "No tienes que revelar ninguna carta.",
      chooseOwnCard: "Elige una de tus cartas boca abajo.",
      notExchanging: "No estás intercambiando cartas.",
      keepCount: "Elige el número correcto de cartas.",
      invalidRoom: "El enlace de la sala no es válido.",
      joinFirst: "Primero entra en una sala.",
      serverError: "El servidor tuvo un problema. Inténtalo de nuevo.",
      offline: "Sin conexión con el servidor. Reintentando…",
    },
  },
  notFound: {
    title: "Esta estancia del palacio no existe.",
    back: "Volver al inicio",
  },
  error: {
    title: "Algo se ha roto.",
    retry: "Recargar la página",
  },
};

export default es;
