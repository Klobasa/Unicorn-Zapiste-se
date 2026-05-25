export const DAYS = [
    { value: 0, label: "Pondělí",  short: "Po" },
    { value: 1, label: "Úterý",    short: "Út" },
    { value: 2, label: "Středa",   short: "St" },
    { value: 3, label: "Čtvrtek",  short: "Čt" },
    { value: 4, label: "Pátek",    short: "Pá" },
    { value: 5, label: "Sobota",   short: "So" },
    { value: 6, label: "Neděle",   short: "Ne" },
];

/** Vrátí objekt dne podle čísla (0–6), nebo undefined */
export const getDay = (value) => DAYS.find((d) => d.value === value);
